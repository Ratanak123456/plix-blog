"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { skipToken } from "@reduxjs/toolkit/query";
import { ArrowLeft, Bookmark, Eye, Heart, MessageCircle, Send } from "lucide-react";
import { PostActions } from "@/components/home/post-actions";
import {
  type BlogComment,
  type UserProfile,
  useCreateCommentMutation,
  useGetPostBySlugQuery,
  useGetPostCommentsQuery,
  useGetPostLikesQuery,
} from "@/lib/services/auth-api";
import { useAppSelector } from "@/lib/store";

function stripHtml(input: string) {
  return input
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getReadTime(content: string) {
  const wordCount = stripHtml(content).split(" ").filter(Boolean).length;
  return `${Math.max(1, Math.ceil(wordCount / 200))} min read`;
}

function formatDate(input: string | null) {
  if (!input) {
    return "Unscheduled";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(input));
}

function formatDateTime(input: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(input));
}

function getAuthorInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "PB";
}

function UserProfileLink({ user, labelClassName }: { user: UserProfile; labelClassName?: string }) {
  return (
    <Link
      href={`/users/${user.username}`}
      className="group inline-flex items-center gap-3 transition-transform hover:-translate-y-0.5"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary font-bangers text-base text-primary-foreground">
        {getAuthorInitials(user.fullName)}
      </div>
      <div>
        <p className={`font-bangers text-2xl text-primary transition-colors group-hover:text-accent ${labelClassName ?? ""}`}>
          {user.fullName}
        </p>
        <p className="font-sans text-sm text-muted-foreground">@{user.username}</p>
      </div>
    </Link>
  );
}

function CommentCard({ comment }: { comment: BlogComment }) {
  return (
    <div className="space-y-4">
      <article className="bg-background p-4 comic-border-secondary">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <UserProfileLink user={comment.user} labelClassName="text-xl" />
          <div className="text-right">
            <p className="font-oswald text-[10px] uppercase tracking-[0.28em] text-muted-foreground">Commented</p>
            <p className="font-sans text-xs text-muted-foreground">{formatDateTime(comment.createdAt)}</p>
          </div>
        </div>
        <p className="mt-4 whitespace-pre-wrap font-sans text-sm leading-7 text-foreground">{comment.content}</p>
      </article>

      {comment.replies.length ? (
        <div className="ml-4 space-y-4 border-l-4 border-accent pl-4 md:ml-8 md:pl-6">
          {comment.replies.map((reply) => (
            <CommentCard key={reply.id} comment={reply} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function PostDetailView({ slug }: { slug: string }) {
  const { data: post, isLoading, isError } = useGetPostBySlugQuery(slug);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { data: likes = [] } = useGetPostLikesQuery(post ? { postId: post.id } : skipToken);
  const { data: comments = [] } = useGetPostCommentsQuery(post ? { postId: post.id } : skipToken);
  const [createComment, { isLoading: isSubmittingComment }] = useCreateCommentMutation();
  const [commentDraft, setCommentDraft] = useState("");
  const [commentError, setCommentError] = useState<string | null>(null);

  async function handleCommentSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!post || !isAuthenticated || isSubmittingComment) {
      return;
    }

    const trimmed = commentDraft.trim();
    if (!trimmed) {
      setCommentError("Comment content is required.");
      return;
    }

    try {
      await createComment({
        postId: post.id,
        content: trimmed,
      }).unwrap();
      setCommentDraft("");
      setCommentError(null);
    } catch {
      setCommentError("Unable to post the comment right now.");
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <main className="container mx-auto px-4 py-10 md:py-14">
          <div className="h-8 w-36 animate-pulse bg-card comic-border-secondary" />
          <div className="mt-8 h-16 max-w-4xl animate-pulse bg-card comic-border" />
          <div className="mt-4 h-6 max-w-2xl animate-pulse bg-card comic-border-secondary" />
          <div className="mt-8 aspect-[16/7] w-full animate-pulse bg-card comic-border-accent" />
          <div className="mt-8 grid gap-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="h-6 animate-pulse bg-card comic-border-secondary" />
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <main className="container mx-auto px-4 py-16">
          <div className="mx-auto max-w-3xl bg-card p-8 text-center comic-border-secondary">
            <p className="font-oswald text-xs uppercase tracking-[0.35em] text-muted-foreground">404 issue</p>
            <h1 className="mt-3 font-bangers text-5xl text-primary md:text-6xl">Post not found</h1>
            <p className="mt-4 font-sans text-base text-muted-foreground">
              This story arc could not be loaded from the current post feed.
            </p>
            <Link
              href="/"
              className="mt-8 inline-flex items-center gap-2 bg-accent px-6 py-3 font-bangers text-xl text-accent-foreground comic-border"
            >
              <ArrowLeft size={18} />
              Back to home
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <main>
        <section className="relative overflow-hidden border-b-4 border-primary bg-muted/40">
          <div className="pointer-events-none absolute inset-0 opacity-20 halftone-bg" />
          <div className="relative container mx-auto px-4 py-10 md:py-14">
            <Link
              href="/#blog"
              className="inline-flex items-center gap-2 bg-card px-4 py-2 font-oswald text-xs uppercase tracking-[0.28em] text-primary comic-border-secondary"
            >
              <ArrowLeft size={14} />
              Back to issues
            </Link>

            <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
              <div>
                <div className="flex flex-wrap items-center gap-3 font-oswald text-xs uppercase tracking-[0.28em] text-muted-foreground">
                  <span className="bg-accent px-3 py-1 text-accent-foreground comic-border">
                    {post.category?.name ?? "Latest"}
                  </span>
                  <span>{formatDate(post.publishedAt ?? post.createdAt)}</span>
                  <span>{getReadTime(post.content)}</span>
                </div>
                <h1 className="mt-5 max-w-5xl font-bangers text-5xl leading-none text-foreground drop-shadow-[3px_3px_0px_hsl(var(--primary))] md:text-7xl">
                  {post.title}
                </h1>
                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <div>
                    <p className="mb-2 font-oswald text-xs uppercase tracking-[0.3em] text-muted-foreground">Written by</p>
                    <UserProfileLink user={post.author} />
                  </div>
                </div>
              </div>

              <aside className="self-start bg-card p-6 comic-border-secondary">
                <p className="font-oswald text-xs uppercase tracking-[0.35em] text-muted-foreground">Panel stats</p>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="bg-background p-4 comic-border">
                    <div className="flex items-center gap-2 font-oswald text-xs uppercase tracking-wider text-muted-foreground">
                      <Eye size={14} />
                      Views
                    </div>
                    <p className="mt-2 font-bangers text-3xl text-primary">{post.viewCount}</p>
                  </div>
                  <div className="bg-background p-4 comic-border-accent">
                    <div className="flex items-center gap-2 font-oswald text-xs uppercase tracking-wider text-muted-foreground">
                      <Heart size={14} />
                      Likes
                    </div>
                    <p className="mt-2 font-bangers text-3xl text-primary">{post.likeCount}</p>
                  </div>
                  <div className="bg-background p-4 comic-border-secondary">
                    <div className="flex items-center gap-2 font-oswald text-xs uppercase tracking-wider text-muted-foreground">
                      <Bookmark size={14} />
                      Saves
                    </div>
                    <p className="mt-2 font-bangers text-3xl text-primary">{post.bookmarkCount}</p>
                  </div>
                  <div className="bg-background p-4 comic-border">
                    <div className="flex items-center gap-2 font-oswald text-xs uppercase tracking-wider text-muted-foreground">
                      <MessageCircle size={14} />
                      Comments
                    </div>
                    <p className="mt-2 font-bangers text-3xl text-primary">{post.commentCount}</p>
                  </div>
                </div>
                <div className="mt-5">
                  <PostActions
                    postId={post.id}
                    initialLikeCount={post.likeCount}
                    initialBookmarkCount={post.bookmarkCount}
                    initialLiked={post.likedByCurrentUser}
                    initialBookmarked={post.bookmarkedByCurrentUser}
                  />
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-10 md:py-12">
          <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_18rem]">
            <div className="space-y-8">
              <article className="overflow-hidden bg-card comic-border">
                <div className="relative aspect-[16/7] overflow-hidden bg-linear-to-br from-orange-800 via-primary/50 to-amber-300">
                  <div className="absolute inset-0 opacity-25 halftone-bg" />
                  {post.thumbnailUrl ? (
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${post.thumbnailUrl})` }}
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-linear-to-t from-background/70 via-transparent to-transparent" />
                </div>
                <div className="prose prose-neutral max-w-none p-6 md:p-10 dark:prose-invert">
                  <div
                    className="post-content font-sans text-base leading-8 text-foreground"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />
                </div>
              </article>

              <section className="bg-card p-6 comic-border-secondary">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-oswald text-xs uppercase tracking-[0.35em] text-muted-foreground">Reader reactions</p>
                    <h2 className="mt-2 font-bangers text-4xl text-primary">Who liked this blog</h2>
                  </div>
                  <div className="flex items-center gap-2 bg-background px-4 py-2 font-oswald text-xs uppercase tracking-[0.28em] text-muted-foreground comic-border">
                    <Heart size={14} />
                    {likes.length} visible likes
                  </div>
                </div>

                {likes.length ? (
                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    {likes.map((user) => (
                      <div key={user.id} className="bg-background p-4 comic-border">
                        <UserProfileLink user={user} labelClassName="text-2xl" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-6 font-sans text-sm text-muted-foreground">
                    No public likes yet for this post.
                  </p>
                )}
              </section>

              <section className="bg-card p-6 comic-border-accent">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-oswald text-xs uppercase tracking-[0.35em] text-muted-foreground">Discussion</p>
                    <h2 className="mt-2 font-bangers text-4xl text-primary">Comments</h2>
                  </div>
                  <div className="bg-background px-4 py-2 font-oswald text-xs uppercase tracking-[0.28em] text-muted-foreground comic-border">
                    {comments.length} thread{comments.length === 1 ? "" : "s"}
                  </div>
                </div>

                <form onSubmit={handleCommentSubmit} className="mt-6 space-y-3">
                  <label className="block font-oswald text-xs uppercase tracking-[0.28em] text-muted-foreground">
                    Leave a comment
                  </label>
                  <textarea
                    value={commentDraft}
                    onChange={(event) => {
                      setCommentDraft(event.target.value);
                      if (commentError) {
                        setCommentError(null);
                      }
                    }}
                    placeholder={isAuthenticated ? "Add your thoughts about this post..." : "Login to join the discussion."}
                    disabled={!isAuthenticated || isSubmittingComment}
                    className="min-h-32 w-full resize-y bg-background px-4 py-3 font-sans text-sm text-foreground placeholder:text-muted-foreground/70 disabled:cursor-not-allowed disabled:opacity-60 comic-border"
                  />
                  {commentError ? <p className="font-sans text-sm text-red-500">{commentError}</p> : null}
                  {!isAuthenticated ? (
                    <p className="font-sans text-sm text-muted-foreground">
                      You need to sign in before posting a comment.
                    </p>
                  ) : null}
                  <button
                    type="submit"
                    disabled={!isAuthenticated || isSubmittingComment}
                    className="inline-flex items-center gap-2 bg-accent px-5 py-3 font-bangers text-xl text-accent-foreground disabled:cursor-not-allowed disabled:opacity-60 comic-border"
                  >
                    <Send size={16} />
                    {isSubmittingComment ? "Posting..." : "Post comment"}
                  </button>
                </form>

                <div className="mt-8 space-y-4">
                  {comments.length ? (
                    comments.map((comment) => <CommentCard key={comment.id} comment={comment} />)
                  ) : (
                    <div className="bg-background p-5 font-sans text-sm text-muted-foreground comic-border">
                      No comments yet. Be the first reader to start the discussion.
                    </div>
                  )}
                </div>
              </section>
            </div>

            <aside className="self-start space-y-6">
              <div className="bg-card p-6 comic-border-accent">
                <p className="font-oswald text-xs uppercase tracking-[0.35em] text-muted-foreground">Story notes</p>
                <div className="mt-4 space-y-4 font-sans text-sm text-muted-foreground">
                  <p>This issue was published on {formatDate(post.publishedAt ?? post.createdAt)}.</p>
                  <p>The current route is driven by the post slug, so links from the homepage now open the full article view.</p>
                </div>
              </div>

              <div className="bg-card p-6 comic-border">
                <p className="font-oswald text-xs uppercase tracking-[0.35em] text-muted-foreground">Author route</p>
                <p className="mt-3 font-sans text-sm leading-7 text-muted-foreground">
                  Clicking the author or any commenter now opens a dedicated dynamic profile page for that user.
                </p>
                <Link
                  href={`/users/${post.author.username}`}
                  className="mt-4 inline-flex items-center gap-2 bg-primary px-4 py-2 font-bangers text-xl text-primary-foreground comic-border-secondary"
                >
                  View profile
                </Link>
              </div>
            </aside>
          </div>
        </section>
      </main>
    </div>
  );
}
