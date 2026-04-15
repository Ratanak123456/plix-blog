"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { skipToken } from "@reduxjs/toolkit/query";
import { Heart, MessageCircle, Send } from "lucide-react";
import {
  type BlogComment,
  type UserProfile,
  type BlogPost,
  useCreateCommentMutation,
  useGetPostCommentsQuery,
  useGetPostLikesQuery,
} from "@/lib/services/auth-api";
import { useAppSelector } from "@/lib/store";

export function stripHtml(input: string) {
  return input
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function getReadTime(content: string) {
  const wordCount = stripHtml(content).split(" ").filter(Boolean).length;
  return `${Math.max(1, Math.ceil(wordCount / 200))} min read`;
}

export function formatDate(input: string | null) {
  if (!input) {
    return "Unscheduled";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(input));
}

export function formatDateTime(input: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(input));
}

function getAuthorInitials(name: string) {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "PB"
  );
}

type ProfileLinkUser = Pick<UserProfile, "id" | "username" | "fullName"> | BlogPost["author"];

export function UserProfileLink({
  user,
  labelClassName,
  replace = false,
}: {
  user: ProfileLinkUser;
  labelClassName?: string;
  replace?: boolean;
}) {
  return (
    <Link
      href={`/users/${user.username}`}
      replace={replace}
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

export function CommentCard({ comment, replaceProfileNavigation = false }: { comment: BlogComment; replaceProfileNavigation?: boolean }) {
  return (
    <div className="space-y-4">
      <article className="bg-background p-4 comic-border-secondary">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <UserProfileLink user={comment.user} labelClassName="text-xl" replace={replaceProfileNavigation} />
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
            <CommentCard key={reply.id} comment={reply} replaceProfileNavigation={replaceProfileNavigation} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function PostLikesPanel({ postId, replaceProfileNavigation = false }: { postId: string; replaceProfileNavigation?: boolean }) {
  const { data: likes = [] } = useGetPostLikesQuery({ postId });

  return (
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
              <UserProfileLink user={user} labelClassName="text-2xl" replace={replaceProfileNavigation} />
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-6 font-sans text-sm text-muted-foreground">No public likes yet for this post.</p>
      )}
    </section>
  );
}

export function PostCommentsPanel({
  postId,
  replaceProfileNavigation = false,
}: {
  postId: string;
  replaceProfileNavigation?: boolean;
}) {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { data: comments = [] } = useGetPostCommentsQuery(postId ? { postId } : skipToken);
  const [createComment, { isLoading: isSubmittingComment }] = useCreateCommentMutation();
  const [commentDraft, setCommentDraft] = useState("");
  const [commentError, setCommentError] = useState<string | null>(null);

  async function handleCommentSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isAuthenticated || isSubmittingComment) {
      return;
    }

    const trimmed = commentDraft.trim();
    if (!trimmed) {
      setCommentError("Comment content is required.");
      return;
    }

    try {
      await createComment({
        postId,
        content: trimmed,
      }).unwrap();
      setCommentDraft("");
      setCommentError(null);
    } catch {
      setCommentError("Unable to post the comment right now.");
    }
  }

  return (
    <section className="bg-card p-6 comic-border-accent">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-oswald text-xs uppercase tracking-[0.35em] text-muted-foreground">Discussion</p>
          <h2 className="mt-2 font-bangers text-4xl text-primary">Comments</h2>
        </div>
        <div className="flex items-center gap-2 bg-background px-4 py-2 font-oswald text-xs uppercase tracking-[0.28em] text-muted-foreground comic-border">
          <MessageCircle size={14} />
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
          <p className="font-sans text-sm text-muted-foreground">You need to sign in before posting a comment.</p>
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
          comments.map((comment) => (
            <CommentCard key={comment.id} comment={comment} replaceProfileNavigation={replaceProfileNavigation} />
          ))
        ) : (
          <div className="bg-background p-5 font-sans text-sm text-muted-foreground comic-border">
            No comments yet. Be the first reader to start the discussion.
          </div>
        )}
      </div>
    </section>
  );
}
