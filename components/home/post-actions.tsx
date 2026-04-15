"use client";

import { Bookmark, Heart } from "lucide-react";
import { useState } from "react";
import {
  useGetPostBookmarkStatusQuery,
  useGetPostLikeStatusQuery,
  useTogglePostBookmarkMutation,
  useTogglePostLikeMutation,
} from "@/lib/services/auth-api";
import { useAppSelector } from "@/lib/store";

type PostActionsProps = {
  postId: string;
  initialLikeCount: number;
  initialBookmarkCount: number;
  initialLiked?: boolean;
  initialBookmarked?: boolean;
  compact?: boolean;
};

export function PostActions({
  postId,
  initialLikeCount,
  initialBookmarkCount: _initialBookmarkCount,
  initialLiked = false,
  initialBookmarked = false,
  compact = false,
}: PostActionsProps) {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { data: likedStatus } = useGetPostLikeStatusQuery(postId, { skip: !isAuthenticated });
  const { data: bookmarkedStatus } = useGetPostBookmarkStatusQuery(postId, { skip: !isAuthenticated });
  const [toggleLike, { isLoading: likePending }] = useTogglePostLikeMutation();
  const [toggleBookmark, { isLoading: bookmarkPending }] = useTogglePostBookmarkMutation();

  const [likedOverride, setLikedOverride] = useState<boolean | null>(null);
  const [bookmarkedOverride, setBookmarkedOverride] = useState<boolean | null>(null);
  const [likeCountOverride, setLikeCountOverride] = useState<number | null>(null);

  const liked = likedOverride ?? (isAuthenticated ? (likedStatus ?? initialLiked) : false);
  const bookmarked = bookmarkedOverride ?? (isAuthenticated ? (bookmarkedStatus ?? initialBookmarked) : false);
  const likeCount = likeCountOverride ?? initialLikeCount;

  async function handleLike(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
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

  async function handleBookmark(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
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

  const buttonClass = compact
    ? "flex items-center gap-1 px-2 py-1 font-oswald text-[10px] uppercase tracking-wider comic-border"
    : "flex items-center gap-2 px-3 py-2 font-oswald text-xs uppercase tracking-wider comic-border";

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={handleLike}
        disabled={!isAuthenticated || likePending}
        className={`${buttonClass} ${liked ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground"} disabled:cursor-not-allowed disabled:opacity-60`}
        aria-label="Like post"
        title={isAuthenticated ? "Like this post" : "Login to like posts"}
      >
        <Heart size={compact ? 13 : 15} className={liked ? "fill-current" : ""} />
        {likeCount}
      </button>
      <button
        type="button"
        onClick={handleBookmark}
        disabled={!isAuthenticated || bookmarkPending}
        className={`${buttonClass} ${bookmarked ? "bg-accent text-accent-foreground" : "bg-background text-muted-foreground"} disabled:cursor-not-allowed disabled:opacity-60`}
        aria-label="Save post"
        title={isAuthenticated ? "Save this post" : "Login to save posts"}
      >
        <Bookmark size={compact ? 13 : 15} className={bookmarked ? "fill-current" : ""} />
        Save
      </button>
    </div>
  );
}
