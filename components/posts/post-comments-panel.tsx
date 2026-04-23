"use client";

import { FormEvent, useState } from "react";
import { MessageCircle, Send, Trash2 } from "lucide-react";
import { skipToken } from "@reduxjs/toolkit/query";
import { 
  useCreateCommentMutation, 
  useGetPostCommentsQuery,
  useDeleteCommentMutation
} from "@/lib/services/auth-api";
import { useAppSelector } from "@/lib/store";
import { CommentCard } from "./comment-card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  const [deleteComment, { isLoading: isDeletingComment }] = useDeleteCommentMutation();
  
  const [commentDraft, setCommentDraft] = useState("");
  const [commentError, setCommentError] = useState<string | null>(null);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);

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

  async function handleDeleteConfirm() {
    if (!commentToDelete) return;

    try {
      await deleteComment({ commentId: commentToDelete, postId }).unwrap();
      setCommentToDelete(null);
    } catch {
      alert("Unable to delete the comment right now.");
    }
  }

  return (
    <section className="bg-card p-6 comic-border-accent">
      <AlertDialog open={!!commentToDelete} onOpenChange={(open) => !open && setCommentToDelete(null)}>
        <AlertDialogContent className="comic-border-secondary">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-bangers text-3xl text-primary uppercase">Retract Comment?</AlertDialogTitle>
            <AlertDialogDescription className="font-oswald text-lg uppercase tracking-wide">
              This action will permanently erase your thoughts from this discussion thread. Are you sure?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel className="font-bangers text-xl comic-border-secondary">Keep it</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground font-bangers text-xl hover:bg-destructive/90 comic-border"
              disabled={isDeletingComment}
            >
              <Trash2 className="mr-2 h-5 w-5" />
              {isDeletingComment ? "Erasing..." : "Delete Permanently"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
            <CommentCard 
              key={comment.id} 
              comment={comment} 
              postId={postId}
              onDelete={setCommentToDelete}
              replaceProfileNavigation={replaceProfileNavigation} 
            />
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
