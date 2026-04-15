"use client";

import Link from "next/link";
import { Heart, MessageCircle, Send } from "lucide-react";
import { useState } from "react";
import { useGetPostLikeStatusQuery, useTogglePostLikeMutation } from "@/lib/services/auth-api";
import { useAppSelector } from "@/lib/store";

type PostEngagementBarProps = {
  postId: string;
  slug: string;
  initialLikeCount: number;
  commentCount: number;
  initialLiked?: boolean;
};

export function PostEngagementBar({
  postId,
  slug,
  initialLikeCount,
  commentCount,
  initialLiked = false,
}: PostEngagementBarProps) {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { data: likedStatus } = useGetPostLikeStatusQuery(postId, { skip: !isAuthenticated });
  const [toggleLike, { isLoading: likePending }] = useTogglePostLikeMutation();
  const [likedOverride, setLikedOverride] = useState<boolean | null>(null);
  const [likeCountOverride, setLikeCountOverride] = useState<number | null>(null);

  const liked = likedOverride ?? (isAuthenticated ? (likedStatus ?? initialLiked) : false);
  const likeCount = likeCountOverride ?? initialLikeCount;

  async function handleLike() {
    if (!isAuthenticated || likePending) {
      return;
    }

    const nextLiked = !liked;
    setLikedOverride(nextLiked);
    setLikeCountOverride(Math.max(0, likeCount + (nextLiked ? 1 : -1)));

    try {
      const response = await toggleLike(postId).unwrap();
      setLikedOverride(response.liked);
      setLikeCountOverride(response.likeCount);
    } catch {
      setLikedOverride(null);
      setLikeCountOverride(null);
    }
  }

  const actionClassName =
    "flex flex-1 items-center justify-center gap-2 px-4 py-3 font-oswald text-xs uppercase tracking-[0.28em] transition-colors";

  return (
    <section className="bg-card p-5 comic-border-secondary">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-dashed border-primary/30 pb-4">
        <Link
          href={`/posts/${slug}/likes`}
          scroll={false}
          className="inline-flex items-center gap-2 font-oswald text-xs uppercase tracking-[0.28em] text-muted-foreground transition-colors hover:text-primary"
        >
          <Heart size={14} className="text-primary" />
          {likeCount} like{likeCount === 1 ? "" : "s"}
        </Link>
        <Link
          href={`/posts/${slug}/comments`}
          scroll={false}
          className="inline-flex items-center gap-2 font-oswald text-xs uppercase tracking-[0.28em] text-muted-foreground transition-colors hover:text-primary"
        >
          <MessageCircle size={14} className="text-primary" />
          {commentCount} comment{commentCount === 1 ? "" : "s"}
        </Link>
      </div>

      <div className="mt-4 grid grid-cols-3 divide-x-2 divide-dashed divide-primary/30 overflow-hidden bg-background comic-border">
        <button
          type="button"
          onClick={handleLike}
          disabled={!isAuthenticated || likePending}
          className={`${actionClassName} ${liked ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"} disabled:cursor-not-allowed disabled:opacity-60`}
          title={isAuthenticated ? "Like this post" : "Login to like posts"}
        >
          <Heart size={18} className={liked ? "fill-current" : ""} />
          Like
        </button>
        <Link href={`/posts/${slug}/comments`} scroll={false} className={`${actionClassName} text-muted-foreground hover:bg-muted`}>
          <MessageCircle size={18} />
          Comment
        </Link>
        <Link href={`/posts/${slug}/share`} scroll={false} className={`${actionClassName} text-muted-foreground hover:bg-muted`}>
          <Send size={18} />
          Share
        </Link>
      </div>
    </section>
  );
}
