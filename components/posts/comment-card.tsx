"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { type BlogComment } from "@/lib/types";
import { formatDateTime } from "@/lib/utils/format";
import { UserProfileLink } from "./user-profile-link";
import { useAppSelector } from "@/lib/store";
import { useDeleteCommentMutation } from "@/lib/services/auth-api";
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

export function CommentCard({ 
  comment, 
  postId,
  replaceProfileNavigation = false 
}: { 
  comment: BlogComment; 
  postId: string;
  replaceProfileNavigation?: boolean 
}) {
  const { user } = useAppSelector((state) => state.auth);
  const [deleteComment, { isLoading: isDeleting }] = useDeleteCommentMutation();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isAuthor = user?.id === comment.user.id;

  async function handleDelete() {
    try {
      await deleteComment({ commentId: comment.id, postId }).unwrap();
    } catch {
      alert("Unable to delete the comment right now.");
    } finally {
      setShowDeleteConfirm(false);
    }
  }

  return (
    <div className="space-y-4">
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
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
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground font-bangers text-xl hover:bg-destructive/90 comic-border"
            >
              {isDeleting ? "Erasing..." : "Delete Permanently"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <article className="bg-background p-4 comic-border-secondary">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <UserProfileLink user={comment.user} labelClassName="text-xl" replace={replaceProfileNavigation} />
          <div className="flex items-start gap-4 text-right">
            <div>
              <p className="font-oswald text-[10px] uppercase tracking-[0.28em] text-muted-foreground">Commented</p>
              <p className="font-sans text-xs text-muted-foreground">{formatDateTime(comment.createdAt)}</p>
            </div>
            {isAuthor && (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={isDeleting}
                className="mt-1 text-muted-foreground transition-colors hover:text-destructive disabled:opacity-50"
                title="Delete your comment"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        </div>
        <p className="mt-4 whitespace-pre-wrap font-sans text-sm leading-7 text-foreground">{comment.content}</p>
      </article>

      {comment.replies.length ? (
        <div className="ml-4 space-y-4 border-l-4 border-accent pl-4 md:ml-8 md:pl-6">
          {comment.replies.map((reply) => (
            <CommentCard 
              key={reply.id} 
              comment={reply} 
              postId={postId}
              replaceProfileNavigation={replaceProfileNavigation} 
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
