"use client";

import { Trash2 } from "lucide-react";
import { type BlogComment } from "@/lib/types";
import { formatDateTime } from "@/lib/utils/format";
import { UserProfileLink } from "./user-profile-link";
import { useAppSelector } from "@/lib/store";

export function CommentCard({ 
  comment, 
  postId,
  onDelete,
  replaceProfileNavigation = false 
}: { 
  comment: BlogComment; 
  postId: string;
  onDelete: (id: string) => void;
  replaceProfileNavigation?: boolean 
}) {
  const { user } = useAppSelector((state) => state.auth);
  const isAuthor = user?.id === comment.user.id;

  return (
    <div className="space-y-4">
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
                onClick={() => onDelete(comment.id)}
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
              onDelete={onDelete}
              replaceProfileNavigation={replaceProfileNavigation} 
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
