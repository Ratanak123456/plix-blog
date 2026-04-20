"use client";

import Link from "next/link";
import { Heart, MessageCircle, Send, Bookmark } from "lucide-react";
import { useState } from "react";
import { 
  useGetPostLikeStatusQuery, 
  useTogglePostLikeMutation,
  useGetPostBookmarkStatusQuery,
  useTogglePostBookmarkMutation
} from "@/lib/services/auth-api";
import { useAppSelector } from "@/lib/store";

type PostEngagementBarProps = {
  postId: string;
  slug: string;
  initialLikeCount: number;
  commentCount: number;
  initialLiked?: boolean;
  initialBookmarked?: boolean;
};

export function PostEngagementBar({
  postId,
  slug,
  initialLikeCount,
  commentCount,
  initialLiked = false,
  initialBookmarked = false,
}: PostEngagementBarProps) {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  
  // Like Logic
  const { data: likedStatus } = useGetPostLikeStatusQuery(postId, { skip: !isAuthenticated });
  const [toggleLike, { isLoading: likePending }] = useTogglePostLikeMutation();
  const [likedOverride, setLikedOverride] = useState<boolean | null>(null);
  const [likeCountOverride, setLikeCountOverride] = useState<number | null>(null);

  // Bookmark/Save Logic
  const { data: bookmarkedStatus } = useGetPostBookmarkStatusQuery(postId, { skip: !isAuthenticated });
  const [toggleBookmark, { isLoading: bookmarkPending }] = useTogglePostBookmarkMutation();
  const [bookmarkedOverride, setBookmarkedOverride] = useState<boolean | null>(null);

  const liked = likedOverride ?? (isAuthenticated ? (likedStatus ?? initialLiked) : false);
  const likeCount = likeCountOverride ?? initialLikeCount;
  const bookmarked = bookmarkedOverride ?? (isAuthenticated ? (bookmarkedStatus ?? initialBookmarked) : false);

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

  async function handleBookmark() {
    if (!isAuthenticated || bookmarkPending) {
      return;
    }

    const nextBookmarked = !bookmarked;
    setBookmarkedOverride(nextBookmarked);

    try {
      const response = await toggleBookmark(postId).unwrap();
      setBookmarkedOverride(response.bookmarked);
    } catch {
      setBookmarkedOverride(null);
    }
  }

  const actionClassName =
    "flex flex-1 items-center justify-center gap-2 px-2 py-3 font-oswald text-[10px] uppercase tracking-wider transition-colors sm:text-xs sm:tracking-[0.2em]";

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

      <div className="mt-4 grid grid-cols-2 overflow-hidden divide-y-2 divide-dashed divide-primary/30 bg-background sm:grid-cols-4 sm:divide-x-2 sm:divide-y-0 comic-border">
        <button
          type="button"
          onClick={handleLike}
          disabled={!isAuthenticated || likePending}
          className={`${actionClassName} ${liked ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"} disabled:cursor-not-allowed disabled:opacity-60`}
          title={isAuthenticated ? "Like this post" : "Login to like posts"}
        >
          <Heart size={16} className={liked ? "fill-current" : ""} />
          <span className="hidden xs:inline">Like</span>
        </button>
        <Link href={`/posts/${slug}/comments`} scroll={false} className={`${actionClassName} text-muted-foreground hover:bg-muted`}>
          <MessageCircle size={16} />
          <span className="hidden xs:inline">Comment</span>
        </Link>
        <button
          type="button"
          onClick={handleBookmark}
          disabled={!isAuthenticated || bookmarkPending}
          className={`${actionClassName} ${bookmarked ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-muted"} disabled:cursor-not-allowed disabled:opacity-60`}
          title={isAuthenticated ? "Save this post" : "Login to save posts"}
        >
          <Bookmark size={16} className={bookmarked ? "fill-current" : ""} />
          <span className="hidden xs:inline">{bookmarked ? "Saved" : "Save"}</span>
        </button>
        <Link href={`/posts/${slug}/share`} scroll={false} className={`${actionClassName} text-muted-foreground hover:bg-muted`}>
          <Send size={16} />
          <span className="hidden xs:inline">Share</span>
        </Link>
      </div>
    </section>
  );
}
