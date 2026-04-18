"use client";

import { type BlogComment } from "@/lib/types";
import { formatDateTime } from "@/lib/utils/format";
import { UserProfileLink } from "./user-profile-link";

export function CommentCard({ 
  comment, 
  replaceProfileNavigation = false 
}: { 
  comment: BlogComment; 
  replaceProfileNavigation?: boolean 
}) {
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
