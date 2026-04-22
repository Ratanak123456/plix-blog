"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  LoaderCircle,
  PenSquare,
  Search,
  Tags,
  Upload,
  X,
} from "lucide-react";
import { type ChangeEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { QuillEditor } from "@/components/write/quill-editor";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  useCreatePostMutation,
  useUpdatePostMutation,
  useCreateTagMutation,
  useGetCategoriesQuery,
  useGetTagsQuery,
  type BlogPost,
} from "@/lib/services/auth-api";
import { useAppSelector } from "@/lib/store";
import {
  getFileUploadErrorMessage,
  uploadImageFile,
} from "@/lib/utils/file-upload";
import { navigateWithFallback } from "@/lib/utils/client-navigation";

type ApiErrorPayload = {
  message?: string;
  validationErrors?: Record<string, string>;
};

const EMPTY_PARAGRAPH = "<p><br></p>";

function getErrorMessage(error: unknown) {
  const payload = (error as { data?: ApiErrorPayload } | undefined)?.data;
  if (payload?.validationErrors) {
    return (
      Object.values(payload.validationErrors)[0] ??
      payload.message ??
      "Validation failed."
    );
  }

  return payload?.message ?? "Unable to save the post right now.";
}

interface WritePostFormProps {
  initialData?: BlogPost;
  isEditing?: boolean;
}

type FeedbackTone = "success" | "error";

export function WritePostForm({
  initialData,
  isEditing = false,
}: WritePostFormProps) {
  const router = useRouter();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [thumbnail, setThumbnail] = useState(initialData?.thumbnailUrl ?? "");
  const [categoryId, setCategoryId] = useState(initialData?.category?.id ?? "");
  const [tagIds, setTagIds] = useState<string[]>(
    initialData?.tags?.map((t) => t.id) ?? [],
  );
  const [tagQuery, setTagQuery] = useState("");
  const [isTagPickerOpen, setIsTagPickerOpen] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [content, setContent] = useState(
    initialData?.content ?? EMPTY_PARAGRAPH,
  );
  const [feedback, setFeedback] = useState<string | null>(null);
  const [feedbackTone, setFeedbackTone] = useState<FeedbackTone>("error");
  const [createdSlug, setCreatedSlug] = useState<string | null>(null);
  const [isThumbnailUploading, setIsThumbnailUploading] = useState(false);
  const [thumbnailUploadMessage, setThumbnailUploadMessage] = useState<
    string | null
  >(null);
  const [thumbnailUploadError, setThumbnailUploadError] = useState<
    string | null
  >(null);

  const { data: categories = [], isLoading: categoriesLoading } =
    useGetCategoriesQuery();
  const { data: tags = [], isLoading: tagsLoading } = useGetTagsQuery();
  const [createPost, { isLoading: isCreating }] = useCreatePostMutation();
  const [updatePost, { isLoading: isUpdating }] = useUpdatePostMutation();
  const [createTag, { isLoading: isCreatingTag }] = useCreateTagMutation();

  const isSaving = isCreating || isUpdating;
  const normalizedTagQuery = tagQuery.trim().toLowerCase();
  const selectedTags = tags.filter((tag) => tagIds.includes(tag.id));
  const filteredTags = tags
    .filter((tag) => tag.name.toLowerCase().includes(normalizedTagQuery))
    .sort((left, right) => left.name.localeCompare(right.name))
    .slice(0, 20);

  const canSubmit =
    isAuthenticated &&
    title.trim() &&
    categoryId &&
    content !== EMPTY_PARAGRAPH &&
    !isSaving &&
    !isThumbnailUploading;

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setThumbnail(initialData.thumbnailUrl ?? "");
      setCategoryId(initialData.category?.id ?? "");
      setTagIds(initialData.tags?.map((t) => t.id) ?? []);
      setContent(initialData.content);
    }
  }, [initialData]);

  function toggleTag(tagId: string) {
    setTagIds((current) =>
      current.includes(tagId)
        ? current.filter((value) => value !== tagId)
        : [...current, tagId].slice(0, 10),
    );
  }

  async function handleThumbnailFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    setThumbnailUploadError(null);
    setThumbnailUploadMessage(null);
    setIsThumbnailUploading(true);

    try {
      const uploadedFile = await uploadImageFile(file);
      setThumbnail(uploadedFile.location);
      setThumbnailUploadMessage(
        `Uploaded "${file.name}". The post payload will use the returned location URL.`,
      );
    } catch (error) {
      setThumbnailUploadError(getFileUploadErrorMessage(error));
    } finally {
      setIsThumbnailUploading(false);
    }
  }

  async function handleCreateTag() {
    const trimmedName = newTagName.trim();
    if (!isAuthenticated || !trimmedName) {
      return;
    }

    const existingTag = tags.find(
      (tag) => tag.name.toLowerCase() === trimmedName.toLowerCase(),
    );
    if (existingTag) {
      setNewTagName("");
      setTagQuery(existingTag.name);
      setFeedback(
        `Tag "${existingTag.name}" already exists. Search and select it from the tag picker.`,
      );
      setFeedbackTone("success");
      setCreatedSlug(null);
      return;
    }

    try {
      const createdTag = await createTag({ name: trimmedName }).unwrap();
      setNewTagName("");
      setTagQuery(createdTag.name);
      setFeedback(
        `Tag "${createdTag.name}" created. Select it from the tag picker if you want to use it.`,
      );
      setFeedbackTone("success");
      setCreatedSlug(null);
    } catch (error) {
      setFeedback(getErrorMessage(error));
      setFeedbackTone("error");
      setCreatedSlug(null);
    }
  }

  async function handleSubmit(status: "DRAFT" | "PUBLISHED") {
    if (!isAuthenticated) {
      setFeedback("Please sign in to save your story.");
      setFeedbackTone("error");
      return;
    }

    if (!title.trim()) {
      setFeedback("Story title is required.");
      setFeedbackTone("error");
      return;
    }

    if (!categoryId) {
      setFeedback("Please select a category for your story.");
      setFeedbackTone("error");
      return;
    }

    if (content === EMPTY_PARAGRAPH) {
      setFeedback("Story content cannot be empty.");
      setFeedbackTone("error");
      return;
    }

    if (isThumbnailUploading) {
      setFeedback("Wait for the thumbnail upload to finish before saving.");
      setFeedbackTone("error");
      return;
    }

    if (!canSubmit) {
      return;
    }

    setFeedback(null);
    setFeedbackTone("error");
    setCreatedSlug(null);

    try {
      if (isEditing && initialData) {
        const post = await updatePost({
          id: initialData.id,
          title: title.trim(),
          content,
          thumbnail: thumbnail.trim(),
          categoryId: categoryId || null,
          tagIds,
          status,
        }).unwrap();

        setFeedback(
          status === "PUBLISHED"
            ? "Post updated and published successfully."
            : "Draft updated successfully.",
        );
        setFeedbackTone("success");
        setCreatedSlug(post.slug);

        if (post.slug !== initialData.slug) {
          navigateWithFallback(router, `/write/${post.slug}`);
        }
      } else {
        const post = await createPost({
          title: title.trim(),
          content,
          thumbnail: thumbnail.trim(),
          categoryId: categoryId || null,
          tagIds,
          status,
        }).unwrap();

        setFeedback(
          status === "PUBLISHED"
            ? "Post published successfully."
            : "Draft saved successfully.",
        );
        setFeedbackTone("success");
        setCreatedSlug(post.slug);
        setTitle("");
        setThumbnail("");
        setThumbnailUploadMessage(null);
        setThumbnailUploadError(null);
        setCategoryId("");
        setTagIds([]);
        setNewTagName("");
        setContent(EMPTY_PARAGRAPH);
      }
    } catch (error) {
      setFeedback(getErrorMessage(error));
      setFeedbackTone("error");
    }
  }

  return (
    <div className="min-h-screen overflow-x-hidden dark:bg-gray-950 text-foreground">
      <main className="relative">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b-8 border-black dark:border-white bg-white dark:bg-gray-900">
          {/* Halftone Background */}
          <div
            className="absolute inset-0 opacity-[0.06] dark:opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle, black 1.5px, transparent 1.5px)",
              backgroundSize: "20px 20px",
            }}
          />

          {/* Action Lines */}
          <svg
            className="absolute top-0 left-0 w-40 h-full opacity-[0.07] dark:opacity-[0.04] pointer-events-none"
            viewBox="0 0 100 400"
            preserveAspectRatio="none"
          >
            <path
              d="M80 0 L20 200 L85 400"
              stroke="black"
              strokeWidth="3"
              fill="none"
              strokeDasharray="12 6"
            />
            <path
              d="M60 50 L10 200 L70 350"
              stroke="black"
              strokeWidth="2"
              fill="none"
              strokeDasharray="8 8"
            />
          </svg>
          <svg
            className="absolute top-0 right-0 w-40 h-full opacity-[0.07] dark:opacity-[0.04] pointer-events-none rotate-180"
            viewBox="0 0 100 400"
            preserveAspectRatio="none"
          >
            <path
              d="M80 0 L20 200 L85 400"
              stroke="black"
              strokeWidth="3"
              fill="none"
              strokeDasharray="12 6"
            />
          </svg>

          {/* Floating Sound Effects */}
          <div className="absolute top-16 left-[10%] bg-[#f0b443] border-3 border-black dark:border-white px-3 py-1 font-bangers text-sm text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.3)] -rotate-12 pointer-events-none hidden lg:block">
            CREATE!
          </div>
          <div className="absolute bottom-16 right-[15%] bg-[#f28b6a] border-3 border-black dark:border-white px-3 py-1 font-bangers text-sm text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.3)] rotate-12 pointer-events-none hidden lg:block">
            PUBLISH!
          </div>

          <div className="relative container mx-auto px-4 py-16 md:py-24">
            <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
              {/* Left Content */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ type: "spring", stiffness: 100 }}
                className="space-y-6"
              >
                {/* Eyebrow Badge */}
                <div className="relative inline-block">
                  <svg
                    className="absolute -inset-4 w-[calc(100%+32px)] h-[calc(100%+32px)] text-yellow-400 -z-10"
                    viewBox="0 0 100 100"
                  >
                    <path
                      d="M50 0 L58 38 L95 30 L65 55 L85 90 L50 68 L15 90 L35 55 L5 30 L42 38Z"
                      fill="currentColor"
                      stroke="black"
                      strokeWidth="2"
                    />
                  </svg>
                  <div className="inline-flex items-center gap-2 bg-[#f0b443] border-3 border-black dark:border-white px-4 py-2 font-oswald text-xs uppercase tracking-[0.28em] text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.3)]">
                    <PenSquare size={16} strokeWidth={3} />
                    {isEditing
                      ? "Edit Your Story Arc"
                      : "Create Your Story Arc"}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <h1
                    className="max-w-3xl font-bangers text-5xl leading-none text-black dark:text-white sm:text-6xl md:text-8xl tracking-wide"
                    style={{
                      textShadow:
                        "4px 4px 0px rgba(0,0,0,0.1) dark:shadow-[4px_4px_0px_rgba(255,255,255,0.1)]",
                      WebkitTextStroke: "1.5px black dark:stroke-white",
                    }}
                  >
                    {isEditing ? "EDIT YOUR" : "WRITE YOUR OWN"}
                    <span
                      className="block text-[#f0b443] mt-2"
                      style={{ textShadow: "3px 3px 0px rgba(0,0,0,0.15)" }}
                    >
                      {isEditing ? "ISSUE" : "ISSUE"}
                    </span>
                  </h1>
                  <p className="mt-5 max-w-2xl font-oswald text-base uppercase tracking-wide text-gray-600 dark:text-gray-400 sm:text-lg">
                    {isEditing
                      ? "Refine your story, update the visuals, and keep your readers engaged with the latest version."
                      : "Draft fast, polish with Quill, and publish straight to the API your frontend already uses."}
                  </p>
                </div>

                {/* Stats Badges */}
                <div className="flex flex-wrap gap-3 font-oswald text-sm uppercase tracking-wide">
                  <div className="bg-white dark:bg-gray-800 border-3 border-black dark:border-white px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] flex items-center gap-2">
                    <BookOpen
                      size={16}
                      className="text-[#f0b443]"
                      strokeWidth={3}
                    />
                    {categoriesLoading
                      ? "Loading..."
                      : `${categories.length} categories ready`}
                  </div>
                  <div className="bg-white dark:bg-gray-800 border-3 border-black dark:border-white px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] flex items-center gap-2">
                    <Tags
                      size={16}
                      className="text-[#f28b6a]"
                      strokeWidth={3}
                    />
                    {tagsLoading ? "Loading..." : `${tags.length} tags ready`}
                  </div>
                </div>
              </motion.div>

              {/* Right Panel - User Info */}
              <motion.div
                initial={{ opacity: 0, x: 50, rotate: 2 }}
                animate={{ opacity: 1, x: 0, rotate: 0 }}
                transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
                className="self-start"
              >
                <div className="bg-white dark:bg-gray-900 border-4 border-black dark:border-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.15)] relative">
                  {/* Inner dashed border */}
                  <div className="absolute inset-2 border-2 border-dashed border-gray-200 dark:border-gray-700 pointer-events-none" />

                  {/* Corner accent */}
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-[#f28b6a] border-3 border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.3)]" />

                  {user ? (
                    <>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-3 h-3 bg-green-500 border-2 border-black dark:border-white rounded-full animate-pulse" />
                        <p className="font-oswald text-xs uppercase tracking-[0.3em] text-gray-500 dark:text-gray-400">
                          Logged in as
                        </p>
                      </div>
                      <p
                        className="font-bangers text-4xl text-[#f0b443] tracking-wide"
                        style={{ textShadow: "2px 2px 0px rgba(0,0,0,0.1)" }}
                      >
                        {user.username}
                      </p>
                      <div className="mt-3 h-[2px] bg-black dark:bg-white shadow-[1px_1px_0px_0px_rgba(0,0,0,0.2)]" />
                      <p className="mt-3 font-sans text-sm text-gray-600 dark:text-gray-400">
                        Posts will be {isEditing ? "updated" : "created"} under
                        your account.
                      </p>
                      {isSaving && (
                        <div className="mt-4 flex items-center gap-2 bg-[#f0b443]/20 border-2 border-[#f0b443] px-3 py-2">
                          <LoaderCircle
                            size={16}
                            className="animate-spin text-[#f0b443]"
                            strokeWidth={3}
                          />
                          <span className="font-oswald text-sm uppercase tracking-wide text-[#f0b443] font-bold">
                            {isEditing ? "Updating..." : "Publishing..."}
                          </span>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-4">
                      <p className="font-bangers text-2xl text-gray-400 dark:text-gray-600">
                        Not logged in
                      </p>
                      <p className="mt-2 font-oswald text-xs uppercase tracking-wider text-gray-500">
                        Sign in to create posts
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Form Section */}
        <section className="container mx-auto px-4 py-12 md:py-16">
          <div className="mx-auto max-w-5xl">
            <div className="space-y-8">
              {/* Main Form Panel */}
              <div className="bg-white dark:bg-gray-900 border-4 border-black dark:border-white p-6 md:p-8 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] dark:shadow-[10px_10px_0px_0px_rgba(255,255,255,0.15)] relative">
                {/* Inner dashed border */}
                <div className="absolute inset-3 border-2 border-dashed border-gray-200 dark:border-gray-700 pointer-events-none" />

                {/* Corner accents */}
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-[#f0b443] border-3 border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.3)]" />
                <div className="absolute -bottom-3 -right-3 w-8 h-8 bg-[#f28b6a] border-3 border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.3)]" />

                <div className="relative z-10 grid gap-6 md:grid-cols-2">
                  {/* Title Input */}
                  <div className="md:col-span-2">
                    <label className="mb-2 inline-block bg-[#f0b443] border-2 border-black dark:border-white px-3 py-1 font-oswald text-xs uppercase tracking-[0.28em] text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.3)]">
                      Story Title *
                    </label>
                    <input
                      value={title}
                      onChange={(event) => setTitle(event.target.value)}
                      placeholder="The day the algorithm learned sarcasm"
                      disabled={!isAuthenticated}
                      className="w-full bg-[#F5F5F0] dark:bg-gray-800 border-3 border-black dark:border-white px-4 py-4 font-bangers text-2xl text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:focus:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.1)]"
                    />
                  </div>

                  {/* Thumbnail URL */}
                  <div className="md:col-span-2">
                    <label className="mb-2 inline-block bg-[#f28b6a] border-2 border-black dark:border-white px-3 py-1 font-oswald text-xs uppercase tracking-[0.28em] text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.3)]">
                      Thumbnail
                    </label>
                    <input
                      value={thumbnail}
                      onChange={(event) => {
                        setThumbnail(event.target.value);
                        setThumbnailUploadMessage(null);
                        setThumbnailUploadError(null);
                      }}
                      placeholder="Paste a URL or upload an image below"
                      disabled={!isAuthenticated}
                      className="w-full bg-[#F5F5F0] dark:bg-gray-800 border-3 border-black dark:border-white px-4 py-3 font-sans text-base text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:focus:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.1)]"
                    />
                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <label className={`inline-flex cursor-pointer items-center gap-2 border-3 border-black dark:border-white px-4 py-2 font-oswald text-xs uppercase tracking-[0.28em] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all ${isThumbnailUploading ? "bg-[#f0b443] text-black" : "bg-white text-black dark:bg-gray-800 dark:text-white"}`}>
                        {isThumbnailUploading ? (
                          <LoaderCircle size={16} className="animate-spin" />
                        ) : (
                          <Upload size={16} />
                        )}
                        {isThumbnailUploading ? "Uploading..." : "Upload thumbnail"}
                        <input
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={(event) => void handleThumbnailFileChange(event)}
                          disabled={!isAuthenticated || isThumbnailUploading}
                        />
                      </label>
                      {thumbnail ? (
                        <button
                          type="button"
                          onClick={() => {
                            setThumbnail("");
                            setThumbnailUploadMessage(null);
                            setThumbnailUploadError(null);
                          }}
                          className="border-3 border-black dark:border-white bg-transparent px-4 py-2 font-oswald text-xs uppercase tracking-[0.28em] text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all hover:bg-[#f28b6a] hover:text-white dark:text-white"
                        >
                          Clear image
                        </button>
                      ) : null}
                    </div>
                    {thumbnailUploadMessage ? (
                      <p className="mt-2 font-sans text-sm text-green-700 dark:text-green-400">
                        {thumbnailUploadMessage}
                      </p>
                    ) : null}
                    {thumbnailUploadError ? (
                      <p className="mt-2 font-sans text-sm text-red-500">
                        {thumbnailUploadError}
                      </p>
                    ) : null}
                  </div>

                  {/* Category Select */}
                  <div>
                    <label className="mb-2 inline-block bg-[#f0b443] border-2 border-black dark:border-white px-3 py-1 font-oswald text-xs uppercase tracking-[0.28em] text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.3)]">
                      Category *
                    </label>
                    <select
                      value={categoryId}
                      onChange={(event) => setCategoryId(event.target.value)}
                      disabled={!isAuthenticated || categoriesLoading}
                      className={`w-full bg-[#F5F5F0] dark:bg-gray-800 border-3 border-black dark:border-white px-4 py-3 font-oswald text-sm uppercase tracking-wide text-black dark:text-white focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:focus:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.1)] ${
                        !categoryId && title.trim()
                          ? "border-red-500 dark:border-red-400"
                          : ""
                      }`}
                    >
                      <option value="" disabled>
                        Select category
                      </option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Action Buttons */}
                  <div>
                    <label className="mb-2 inline-block bg-[#f28b6a] border-2 border-black dark:border-white px-3 py-1 font-oswald text-xs uppercase tracking-[0.28em] text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.3)]">
                      Actions
                    </label>
                    <div className="flex h-full items-start gap-3">
                      <button
                        type="button"
                        onClick={() => void handleSubmit("DRAFT")}
                        disabled={!canSubmit}
                        className="flex-1 bg-white dark:bg-gray-800 border-3 border-black dark:border-white px-4 py-3 font-bangers text-xl text-black dark:text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.3)] hover:bg-[#f0b443] hover:text-black disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                      >
                        {isEditing ? "Update Draft" : "Save Draft"}
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleSubmit("PUBLISHED")}
                        disabled={!canSubmit}
                        className="flex-1 bg-[#f28b6a] border-3 border-black dark:border-white px-4 py-3 font-bangers text-xl text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.4)] hover:bg-[#f0b443] hover:text-black disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                      >
                        {isEditing ? "Update & Publish" : "Publish"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Content Editor */}
                <div className="mt-8 relative z-10">
                  <label className="mb-2 inline-block bg-[#f0b443] border-2 border-black dark:border-white px-3 py-1 font-oswald text-xs uppercase tracking-[0.28em] text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.3)]">
                    Blog Content *
                  </label>
                  <div
                    className={`border-3 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] ${!isAuthenticated ? "pointer-events-none opacity-70" : ""}`}
                  >
                    <QuillEditor
                      value={content}
                      onChange={setContent}
                      placeholder="Open with a hook, break it into scenes, and make it worth scrolling."
                    />
                  </div>
                </div>

                {/* Tags Section */}
                <div className="mt-8 relative z-10">
                  <div className="mb-4 flex items-center gap-2">
                    <div className="bg-[#f28b6a] border-2 border-black dark:border-white p-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.3)]">
                      <Tags size={14} className="text-white" strokeWidth={3} />
                    </div>
                    <span className="font-oswald text-xs uppercase tracking-[0.28em] text-gray-600 dark:text-gray-400 font-bold">
                      Pick up to 10 tags
                    </span>
                  </div>

                  {/* Selected Tags */}
                  <div className="border-3 border-black dark:border-white bg-[#F5F5F0] dark:bg-gray-800 p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] mb-4">
                    <label className="mb-3 block font-oswald text-xs uppercase tracking-[0.28em] text-gray-500 dark:text-gray-400">
                      Selected Tags
                    </label>
                    {selectedTags.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {selectedTags.map((tag) => (
                          <button
                            key={tag.id}
                            type="button"
                            onClick={() => toggleTag(tag.id)}
                            disabled={!isAuthenticated}
                            className="inline-flex items-center gap-2 bg-[#f0b443] border-2 border-black dark:border-white px-3 py-2 font-oswald text-xs uppercase tracking-wide text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.3)] transition-all hover:-translate-y-1 hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            <span className="font-bangers">{tag.name}</span>
                            <X size={12} strokeWidth={3} />
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="font-sans text-sm text-gray-500 dark:text-gray-500 italic">
                        No tags selected yet. Search below to add the ones you
                        need.
                      </p>
                    )}
                  </div>

                  {/* Tag Picker */}
                  <div className="mb-4">
                    <label className="mb-2 block font-oswald text-xs uppercase tracking-[0.28em] text-gray-500 dark:text-gray-400">
                      Select Tags
                    </label>
                    <Popover
                      open={isTagPickerOpen}
                      onOpenChange={setIsTagPickerOpen}
                    >
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          disabled={
                            !isAuthenticated ||
                            tagsLoading ||
                            tagIds.length >= 10
                          }
                          className="flex w-full items-center justify-between gap-3 bg-white dark:bg-gray-800 border-3 border-black dark:border-white px-4 py-3 text-left shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.3)] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
                        >
                          <div>
                            <p className="font-oswald text-sm uppercase tracking-wide text-black dark:text-white">
                              {tagsLoading
                                ? "Loading tags..."
                                : normalizedTagQuery
                                  ? `Showing ${filteredTags.length} matching tags`
                                  : `Browse ${tags.length} available tags`}
                            </p>
                            <p className="mt-1 font-sans text-sm text-gray-500 dark:text-gray-500">
                              {tagIds.length >= 10
                                ? "Tag limit reached. Remove one to add another."
                                : "Open the picker to browse or search the tag library."}
                            </p>
                          </div>
                          <ChevronDown
                            size={18}
                            className="shrink-0 text-[#f0b443]"
                            strokeWidth={3}
                          />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent
                        align="start"
                        className="w-[min(32rem,calc(100vw-2rem))] bg-white dark:bg-gray-900 border-3 border-black dark:border-white p-0 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)]"
                      >
                        <div className="border-b-3 border-black dark:border-white p-3">
                          <div className="flex items-center gap-3 bg-[#F5F5F0] dark:bg-gray-800 border-2 border-black dark:border-white px-4 py-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)]">
                            <Search
                              size={16}
                              className="text-[#f0b443]"
                              strokeWidth={3}
                            />
                            <input
                              value={tagQuery}
                              onChange={(event) =>
                                setTagQuery(event.target.value)
                              }
                              placeholder="Search existing tags"
                              className="w-full bg-transparent font-sans text-base text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none"
                            />
                          </div>
                        </div>
                        <div className="max-h-72 overflow-y-auto p-3">
                          {filteredTags.length > 0 ? (
                            <div className="space-y-2">
                              {filteredTags.map((tag) => {
                                const active = tagIds.includes(tag.id);
                                return (
                                  <button
                                    key={tag.id}
                                    type="button"
                                    onClick={() => toggleTag(tag.id)}
                                    className={`flex w-full items-center justify-between px-4 py-3 text-left font-oswald text-sm uppercase tracking-wide transition-all border-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.2)] hover:-translate-y-0.5 ${
                                      active
                                        ? "bg-[#f0b443] text-black border-black dark:border-white"
                                        : "bg-[#F5F5F0] dark:bg-gray-800 text-black dark:text-white border-black dark:border-white hover:bg-[#f28b6a] hover:text-white"
                                    }`}
                                  >
                                    <span className="font-bangers">
                                      {tag.name}
                                    </span>
                                    <span
                                      className={`text-[10px] tracking-[0.2em] px-2 py-0.5 border-2 ${
                                        active
                                          ? "bg-white text-[#f0b443] border-black dark:border-white"
                                          : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border-black dark:border-white"
                                      }`}
                                    >
                                      {active ? "Selected" : "Add"}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          ) : (
                            <p className="px-1 py-2 font-sans text-sm text-gray-500 dark:text-gray-500 text-center">
                              No matching tags found. Create a new one below if
                              needed.
                            </p>
                          )}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Create New Tag */}
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <input
                      value={newTagName}
                      onChange={(event) => setNewTagName(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.preventDefault();
                          void handleCreateTag();
                        }
                      }}
                      placeholder="Create a new tag"
                      disabled={!isAuthenticated || isCreatingTag}
                      className="flex-1 bg-white dark:bg-gray-800 border-3 border-black dark:border-white px-4 py-3 font-sans text-base text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:focus:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.1)]"
                    />
                    <button
                      type="button"
                      onClick={() => void handleCreateTag()}
                      disabled={
                        !isAuthenticated || !newTagName.trim() || isCreatingTag
                      }
                      className="w-full bg-[#f0b443] border-3 border-black dark:border-white px-6 py-3 font-bangers text-xl text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.4)] hover:bg-[#f28b6a] hover:text-white disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 sm:w-auto"
                    >
                      {isCreatingTag ? "Adding..." : "Add Tag"}
                    </button>
                  </div>
                </div>

                {/* Feedback Messages */}
                <AnimatePresence mode="wait">
                  {feedback && (
                    <motion.div
                      key={feedback}
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      className={`mt-8 flex items-start gap-3 p-5 border-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] relative ${
                        feedbackTone === "success"
                          ? "bg-[#f0b443]/20 border-[#f0b443]"
                          : "bg-red-500/10 border-red-500"
                      }`}
                    >
                      <div
                        className={`absolute -top-3 -right-3 w-6 h-6 ${feedbackTone === "success" ? "bg-[#f0b443]" : "bg-red-500"} border-2 border-black dark:border-white`}
                      />
                      {feedbackTone === "success" ? (
                        <CheckCircle2
                          className="mt-0.5 text-[#f0b443]"
                          size={20}
                          strokeWidth={3}
                        />
                      ) : (
                        <AlertCircle
                          className="mt-0.5 text-red-500"
                          size={20}
                          strokeWidth={3}
                        />
                      )}
                      <div>
                        <p className="font-oswald text-sm uppercase tracking-wide font-bold text-black dark:text-white">
                          {feedback}
                        </p>
                        {createdSlug && (
                          <p className="mt-1 font-sans text-sm text-gray-600 dark:text-gray-400">
                            {isEditing ? "Updated slug: " : "Created slug: "}{" "}
                            <span className="font-medium text-[#f0b443] font-bangers">
                              {createdSlug}
                            </span>
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
