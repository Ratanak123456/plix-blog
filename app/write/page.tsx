"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, BookOpenText, CheckCircle2, LoaderCircle, PenSquare, Sparkles, Tags } from "lucide-react";
import { useMemo, useState } from "react";
import { AuthModal } from "@/components/auth-modal";
import { QuillEditor } from "@/components/write/quill-editor";
import { useCreatePostMutation, useCreateTagMutation, useGetCategoriesQuery, useGetTagsQuery } from "@/lib/services/auth-api";
import { useAppSelector } from "@/lib/store";

type ApiErrorPayload = {
  message?: string;
  validationErrors?: Record<string, string>;
};

const EMPTY_PARAGRAPH = "<p><br></p>";

function stripHtml(input: string) {
  return input
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getErrorMessage(error: unknown) {
  const payload = (error as { data?: ApiErrorPayload } | undefined)?.data;
  if (payload?.validationErrors) {
    return Object.values(payload.validationErrors)[0] ?? payload.message ?? "Validation failed.";
  }

  return payload?.message ?? "Unable to save the post right now.";
}

export default function WritePage() {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [title, setTitle] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [tagIds, setTagIds] = useState<string[]>([]);
  const [newTagName, setNewTagName] = useState("");
  const [content, setContent] = useState(EMPTY_PARAGRAPH);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [createdSlug, setCreatedSlug] = useState<string | null>(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [modalType, setModalType] = useState<"login" | "register">("login");

  const { data: categories = [], isLoading: categoriesLoading } = useGetCategoriesQuery();
  const { data: tags = [], isLoading: tagsLoading } = useGetTagsQuery();
  const [createPost, { isLoading: isSaving }] = useCreatePostMutation();
  const [createTag, { isLoading: isCreatingTag }] = useCreateTagMutation();

  const plainText = useMemo(() => stripHtml(content), [content]);
  const wordCount = plainText ? plainText.split(" ").length : 0;
  const canSubmit = isAuthenticated && title.trim() && plainText && !isSaving;

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
    if (!canSubmit) {
      return;
    }

    setFeedback(null);
    setCreatedSlug(null);

    try {
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
    } catch (error) {
      setFeedback(getErrorMessage(error));
    }
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <AuthModal open={loginOpen} mode={modalType} onClose={() => setLoginOpen(false)} onModeChange={setModalType} />

      <main className="relative">
        <section className="relative overflow-hidden border-b-4 border-primary bg-muted/40">
          <div className="pointer-events-none absolute inset-0 opacity-20 halftone-bg" />
          <div className="relative container mx-auto px-4 py-14 md:py-18">
            <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="space-y-5">
                <div className="inline-flex items-center gap-2 bg-card px-4 py-2 font-oswald text-xs uppercase tracking-[0.28em] text-primary comic-border">
                  <PenSquare size={16} />
                  Create Your Story Arc
                </div>
                <div>
                  <h1 className="max-w-3xl font-bangers text-5xl leading-none drop-shadow-[3px_3px_0px_hsl(var(--primary))] md:text-7xl">
                    WRITE YOUR OWN ISSUE
                  </h1>
                  <p className="mt-4 max-w-2xl font-oswald text-lg uppercase tracking-wide text-muted-foreground">
                    Draft fast, polish with Quill, and publish straight to the API your frontend already uses.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3 font-oswald text-sm uppercase tracking-wide">
                  <div className="bg-card px-4 py-2 comic-border">
                    {categoriesLoading ? "Loading categories..." : `${categories.length} categories ready`}
                  </div>
                  <div className="bg-card px-4 py-2 comic-border-secondary">
                    {tagsLoading ? "Loading tags..." : `${tags.length} tags ready`}
                  </div>
                  <div className="bg-card px-4 py-2 comic-border-accent">{wordCount} words in progress</div>
                </div>
              </div>

              <div className="self-start bg-card p-6 shadow-lg comic-border-secondary">
                {isAuthenticated && user ? (
                  <>
                    <p className="font-oswald text-xs uppercase tracking-[0.3em] text-muted-foreground">Logged in as</p>
                    <p className="mt-2 font-bangers text-3xl text-primary">{user.username}</p>
                    <p className="mt-2 font-sans text-sm text-muted-foreground">
                      Posts will be created under your account using the authenticated `POST /posts` API.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="font-bangers text-3xl text-primary">Sign in to write</p>
                    <p className="mt-3 font-sans text-sm text-muted-foreground">
                      The backend requires authentication for creating posts, so the editor stays read-only until you
                      log in.
                    </p>
                    <div className="mt-5 flex gap-3">
                      <button
                        onClick={() => {
                          setModalType("login");
                          setLoginOpen(true);
                        }}
                        className="bg-accent px-4 py-3 font-bangers text-xl text-background transition-colors hover:bg-primary comic-border"
                      >
                        Login
                      </button>
                      <button
                        onClick={() => {
                          setModalType("register");
                          setLoginOpen(true);
                        }}
                        className="px-4 py-3 font-bangers text-xl transition-colors hover:text-accent comic-border"
                      >
                        Register
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-10">
          <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_24rem]">
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
                      className="w-full bg-background px-4 py-3 font-oswald text-sm uppercase tracking-wide text-foreground disabled:cursor-not-allowed disabled:opacity-70 focus:outline-none comic-border"
                    >
                      <option value="">No category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block font-oswald text-xs uppercase tracking-[0.28em] text-muted-foreground">
                      Status
                    </label>
                    <div className="flex h-full items-center gap-3">
                      <button
                        type="button"
                        onClick={() => void handleSubmit("DRAFT")}
                        disabled={!canSubmit}
                        className="flex-1 px-4 py-3 font-bangers text-xl transition-colors hover:text-accent disabled:cursor-not-allowed disabled:opacity-50 comic-border-secondary"
                      >
                        Save Draft
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleSubmit("PUBLISHED")}
                        disabled={!canSubmit}
                        className="flex-1 bg-accent px-4 py-3 font-bangers text-xl text-background transition-colors hover:bg-primary disabled:cursor-not-allowed disabled:opacity-50 comic-border"
                      >
                        Publish
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
                            Created slug: <span className="font-medium text-foreground">{createdSlug}</span>
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <aside className="space-y-6">
              <div className="bg-card p-6 shadow-md comic-border-accent">
                <div className="flex items-center gap-2 font-oswald text-xs uppercase tracking-[0.28em] text-muted-foreground">
                  <BookOpenText size={15} />
                  Live Preview
                </div>
                <h2 className="mt-3 font-bangers text-3xl">{title.trim() || "Your headline will land here"}</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {categoryId && categories.find((category) => category.id === categoryId) && (
                    <span className="bg-primary px-3 py-1 font-oswald text-xs uppercase tracking-wide text-primary-foreground comic-border">
                      {categories.find((category) => category.id === categoryId)?.name}
                    </span>
                  )}
                  {tagIds.map((tagId) => {
                    const tag = tags.find((entry) => entry.id === tagId);
                    if (!tag) {
                      return null;
                    }

                    return (
                      <span key={tag.id} className="bg-background px-3 py-1 font-oswald text-xs uppercase tracking-wide comic-border-secondary">
                        {tag.name}
                      </span>
                    );
                  })}
                </div>
                {thumbnail.trim() && (
                  <div className="mt-5 overflow-hidden comic-border">
                    <img src={thumbnail.trim()} alt="Post thumbnail preview" className="h-48 w-full object-cover" />
                  </div>
                )}
                <div
                  className="editor-preview mt-5 text-sm leading-7 text-foreground/90"
                  dangerouslySetInnerHTML={{ __html: plainText ? content : "<p>Start writing to see the preview.</p>" }}
                />
              </div>

              <div className="bg-card p-6 shadow-md comic-border-secondary">
                <div className="flex items-center gap-2 font-oswald text-xs uppercase tracking-[0.28em] text-muted-foreground">
                  <Sparkles size={15} />
                  Submission Notes
                </div>
                <ul className="mt-4 space-y-3 font-sans text-sm text-muted-foreground">
                  <li>The backend accepts HTML content from Quill in the `content` field.</li>
                  <li>`thumbnail` must be a valid `http` or `https` URL.</li>
                  <li>`categoryId` is optional. You can create a new tag here or select up to 10 existing tags.</li>
                  <li>Use `Save Draft` for `DRAFT` or `Publish` for `PUBLISHED`.</li>
                </ul>
                {isSaving && (
                  <div className="mt-5 flex items-center gap-2 font-oswald text-sm uppercase tracking-wide text-primary">
                    <LoaderCircle size={16} className="animate-spin" />
                    Sending to API...
                  </div>
                )}
              </div>
            </aside>
          </div>
        </section>
      </main>
    </div>
  );
}
