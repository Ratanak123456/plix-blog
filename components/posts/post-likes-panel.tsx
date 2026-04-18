"use client";

import { Heart } from "lucide-react";
import { useGetPostLikesQuery } from "@/lib/services/auth-api";
import { UserProfileLink } from "./user-profile-link";

export function PostLikesPanel({ 
  postId, 
  replaceProfileNavigation = false 
}: { 
  postId: string; 
  replaceProfileNavigation?: boolean 
}) {
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
