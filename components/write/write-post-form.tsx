"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, LoaderCircle, PenSquare, Tags } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { QuillEditor } from "@/components/write/quill-editor";
import {
  useCreatePostMutation,
  useUpdatePostMutation,
  useCreateTagMutation,
  useGetCategoriesQuery,
  useGetTagsQuery,
  type BlogPost,
} from "@/lib/services/auth-api";
import { useAppSelector } from "@/lib/store";

type ApiErrorPayload = {
  message?: string;
  validationErrors?: Record<string, string>;
};

const EMPTY_PARAGRAPH = "<p><br></p>";

function getErrorMessage(error: unknown) {
  const payload = (error as { data?: ApiErrorPayload } | undefined)?.data;
  if (payload?.validationErrors) {
    return Object.values(payload.validationErrors)[0] ?? payload.message ?? "Validation failed.";
  }

  return payload?.message ?? "Unable to save the post right now.";
}

interface WritePostFormProps {
  initialData?: BlogPost;
  isEditing?: boolean;
}

export function WritePostForm({ initialData, isEditing = false }: WritePostFormProps) {
  const router = useRouter();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [thumbnail, setThumbnail] = useState(initialData?.thumbnailUrl ?? "");
  const [categoryId, setCategoryId] = useState(initialData?.category?.id ?? "");
  const [tagIds, setTagIds] = useState<string[]>(initialData?.tags?.map(t => t.id) ?? []);
  const [newTagName, setNewTagName] = useState("");
  const [content, setContent] = useState(initialData?.content ?? EMPTY_PARAGRAPH);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [createdSlug, setCreatedSlug] = useState<string | null>(null);

  const { data: categories = [], isLoading: categoriesLoading } = useGetCategoriesQuery();
  const { data: tags = [], isLoading: tagsLoading } = useGetTagsQuery();
  const [createPost, { isLoading: isCreating }] = useCreatePostMutation();
  const [updatePost, { isLoading: isUpdating }] = useUpdatePostMutation();
  const [createTag, { isLoading: isCreatingTag }] = useCreateTagMutation();

  const isSaving = isCreating || isUpdating;

  // Added categoryId requirement to canSubmit
  const canSubmit = isAuthenticated && title.trim() && categoryId && content !== EMPTY_PARAGRAPH && !isSaving;

  useEffect(() => {
    if (initialData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTitle(initialData.title);
      setThumbnail(initialData.thumbnailUrl ?? "");
      setCategoryId(initialData.category?.id ?? "");
      setTagIds(initialData.tags?.map(t => t.id) ?? []);
      setContent(initialData.content);
    }
  }, [initialData]);

  function toggleTag(tagId: string) {
    setTagIds((current) =>
      current.includes(tagId) ? current.filter((value) => value !== tagId) : [...current, tagId].slice(0, 10),
    );
  }

  async function handleCreateTag() {
    const trimmedName = newTagName.trim();
    if (!isAuthenticated || !trimmedName) {
      return;
    }

    const existingTag = tags.find((tag) => tag.name.toLowerCase() === trimmedName.toLowerCase());
    if (existingTag) {
      setTagIds((current) => (current.includes(existingTag.id) ? current : [...current, existingTag.id].slice(0, 10)));
      setNewTagName("");
      setFeedback(`Tag "${existingTag.name}" already exists, so it was selected for this post.`);
      setCreatedSlug(null);
      return;
    }

    try {
      const createdTag = await createTag({ name: trimmedName }).unwrap();
      setTagIds((current) => (current.includes(createdTag.id) ? current : [...current, createdTag.id].slice(0, 10)));
      setNewTagName("");
      setFeedback(`Tag "${createdTag.name}" created and selected.`);
      setCreatedSlug(null);
    } catch (error) {
      setFeedback(getErrorMessage(error));
      setCreatedSlug(null);
    }
  }

  async function handleSubmit(status: "DRAFT" | "PUBLISHED") {
    if (!isAuthenticated) {
      setFeedback("Please sign in to save your story.");
      return;
    }
    
    if (!title.trim()) {
      setFeedback("Story title is required.");
      return;
    }

    if (!categoryId) {
      setFeedback("Please select a category for your story.");
      return;
    }

    if (content === EMPTY_PARAGRAPH) {
      setFeedback("Story content cannot be empty.");
      return;
    }

    if (!canSubmit) {
      return;
    }

    setFeedback(null);
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

        setFeedback(status === "PUBLISHED" ? "Post updated and published successfully." : "Draft updated successfully.");
        setCreatedSlug(post.slug);
        
        if (post.slug !== initialData.slug) {
            router.push(`/write/${post.slug}`);
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

        setFeedback(status === "PUBLISHED" ? "Post published successfully." : "Draft saved successfully.");
        setCreatedSlug(post.slug);
        setTitle("");
        setThumbnail("");
        setCategoryId("");
        setTagIds([]);
        setNewTagName("");
        setContent(EMPTY_PARAGRAPH);
      }
    } catch (error) {
      setFeedback(getErrorMessage(error));
    }
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <main className="relative">
        <section className="relative overflow-hidden border-b-4 border-primary bg-muted/40">
          <div className="pointer-events-none absolute inset-0 opacity-20 halftone-bg" />
          <div className="relative container mx-auto px-4 py-14 md:py-18">
            <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="space-y-5">
                <div className="inline-flex items-center gap-2 bg-card px-4 py-2 font-oswald text-xs uppercase tracking-[0.28em] text-primary comic-border">
                  <PenSquare size={16} />
                  {isEditing ? "Edit Your Story Arc" : "Create Your Story Arc"}
                </div>
                <div>
                  <h1 className="max-w-3xl font-bangers text-5xl leading-none drop-shadow-[3px_3px_0px_hsl(var(--primary))] md:text-7xl">
                    {isEditing ? "EDIT YOUR ISSUE" : "WRITE YOUR OWN ISSUE"}
                  </h1>
                  <p className="mt-4 max-w-2xl font-oswald text-lg uppercase tracking-wide text-muted-foreground">
                    {isEditing 
                      ? "Refine your story, update the visuals, and keep your readers engaged with the latest version."
                      : "Draft fast, polish with Quill, and publish straight to the API your frontend already uses."}
                  </p>
                </div>
                <div className="flex flex-wrap gap-3 font-oswald text-sm uppercase tracking-wide">
                  <div className="bg-card px-4 py-2 comic-border">
                    {categoriesLoading ? "Loading categories..." : `${categories.length} categories ready`}
                  </div>
                  <div className="bg-card px-4 py-2 comic-border-secondary">
                    {tagsLoading ? "Loading tags..." : `${tags.length} tags ready`}
                  </div>
                </div>
              </div>

              <div className="self-start bg-card p-6 shadow-lg comic-border-secondary">
                {user ? (
                  <>
                    <p className="font-oswald text-xs uppercase tracking-[0.3em] text-muted-foreground">Logged in as</p>
                    <p className="mt-2 font-bangers text-3xl text-primary">{user.username}</p>
                    <p className="mt-2 font-sans text-sm text-muted-foreground">
                      Posts will be {isEditing ? "updated" : "created"} under your account.
                    </p>
                    {isSaving && (
                      <div className="mt-4 flex items-center gap-2 font-oswald text-sm uppercase tracking-wide text-primary">
                        <LoaderCircle size={16} className="animate-spin" />
                        {isEditing ? "Updating..." : "Publishing..."}
                      </div>
                    )}
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-10">
          <div className="mx-auto max-w-5xl">
            <div className="space-y-6">
              <div className="bg-card p-6 shadow-md comic-border">
                <div className="grid gap-5 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label className="mb-2 block font-oswald text-xs uppercase tracking-[0.28em] text-muted-foreground">
                      Story Title
                    </label>
                    <input
                      value={title}
                      onChange={(event) => setTitle(event.target.value)}
                      placeholder="The day the algorithm learned sarcasm"
                      disabled={!isAuthenticated}
                      className="w-full bg-background px-4 py-3 font-bangers text-3xl text-foreground placeholder:text-muted-foreground/50 disabled:cursor-not-allowed disabled:opacity-70 focus:outline-none comic-border"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-2 block font-oswald text-xs uppercase tracking-[0.28em] text-muted-foreground">
                      Thumbnail URL
                    </label>
                    <input
                      value={thumbnail}
                      onChange={(event) => setThumbnail(event.target.value)}
                      placeholder="https://example.com/cover-image.jpg"
                      disabled={!isAuthenticated}
                      className="w-full bg-background px-4 py-3 font-sans text-base text-foreground placeholder:text-muted-foreground/50 disabled:cursor-not-allowed disabled:opacity-70 focus:outline-none comic-border-secondary"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block font-oswald text-xs uppercase tracking-[0.28em] text-muted-foreground">
                      Category
                    </label>
                    <select
                      value={categoryId}
                      onChange={(event) => setCategoryId(event.target.value)}
                      disabled={!isAuthenticated || categoriesLoading}
                      className={`w-full bg-background px-4 py-3 font-oswald text-sm uppercase tracking-wide text-foreground disabled:cursor-not-allowed disabled:opacity-70 focus:outline-none comic-border ${
                        !categoryId && title.trim() ? "border-destructive/50" : ""
                      }`}
                    >
                      <option value="" disabled>Select category *</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block font-oswald text-xs uppercase tracking-[0.28em] text-muted-foreground">
                      Actions
                    </label>
                    <div className="flex h-full items-center gap-3">
                      <button
                        type="button"
                        onClick={() => void handleSubmit("DRAFT")}
                        disabled={!canSubmit}
                        className="flex-1 px-4 py-3 font-bangers text-xl transition-colors hover:text-accent disabled:cursor-not-allowed disabled:opacity-50 comic-border-secondary"
                      >
                        {isEditing ? "Update Draft" : "Save Draft"}
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleSubmit("PUBLISHED")}
                        disabled={!canSubmit}
                        className="flex-1 bg-accent px-4 py-3 font-bangers text-xl text-background transition-colors hover:bg-primary disabled:cursor-not-allowed disabled:opacity-50 comic-border"
                      >
                        {isEditing ? "Update & Publish" : "Publish"}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="mb-2 block font-oswald text-xs uppercase tracking-[0.28em] text-muted-foreground">
                    Blog Content
                  </label>
                  <div className={`${!isAuthenticated ? "pointer-events-none opacity-70" : ""}`}>
                    <QuillEditor
                      value={content}
                      onChange={setContent}
                      placeholder="Open with a hook, break it into scenes, and make it worth scrolling."
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <div className="mb-3 flex items-center gap-2 font-oswald text-xs uppercase tracking-[0.28em] text-muted-foreground">
                    <Tags size={14} />
                    Pick up to 10 tags
                  </div>
                  <div className="mb-4 flex gap-3">
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
                      disabled={!isAuthenticated || isCreatingTag || tagIds.length >= 10}
                      className="flex-1 bg-background px-4 py-3 font-sans text-base text-foreground placeholder:text-muted-foreground/50 disabled:cursor-not-allowed disabled:opacity-70 focus:outline-none comic-border-secondary"
                    />
                    <button
                      type="button"
                      onClick={() => void handleCreateTag()}
                      disabled={!isAuthenticated || !newTagName.trim() || isCreatingTag || tagIds.length >= 10}
                      className="px-4 py-3 font-bangers text-xl transition-colors hover:text-accent disabled:cursor-not-allowed disabled:opacity-50 comic-border-secondary"
                    >
                      {isCreatingTag ? "Adding..." : "Add Tag"}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {tags.map((tag) => {
                      const active = tagIds.includes(tag.id);
                      return (
                        <button
                          key={tag.id}
                          type="button"
                          onClick={() => toggleTag(tag.id)}
                          disabled={!isAuthenticated}
                          className={`px-4 py-2 font-oswald text-sm uppercase tracking-wide transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
                            active ? "bg-primary text-primary-foreground" : "bg-background hover:text-accent"
                          } comic-border`}
                        >
                          {tag.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {feedback && (
                    <motion.div
                      key={feedback}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className={`mt-6 flex items-start gap-3 p-4 ${
                        createdSlug ? "bg-primary/15" : "bg-destructive/10"
                      } comic-border`}
                    >
                      {createdSlug ? <CheckCircle2 className="mt-0.5 text-primary" size={18} /> : <AlertCircle className="mt-0.5 text-destructive" size={18} />}
                      <div>
                        <p className="font-oswald text-sm uppercase tracking-wide">{feedback}</p>
                        {createdSlug && (
                          <p className="mt-1 font-sans text-sm text-muted-foreground">
                            {isEditing ? "Updated slug: " : "Created slug: "} <span className="font-medium text-foreground">{createdSlug}</span>
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
