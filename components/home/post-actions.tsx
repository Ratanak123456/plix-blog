"use client";

import { Bookmark, Heart } from "lucide-react";
import { useEffect, useState } from "react";
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
  initialBookmarkCount,
  initialLiked = false,
  initialBookmarked = false,
  compact = false,
}: PostActionsProps) {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { data: likedStatus } = useGetPostLikeStatusQuery(postId, { skip: !isAuthenticated });
  const { data: bookmarkedStatus } = useGetPostBookmarkStatusQuery(postId, { skip: !isAuthenticated });
  const [toggleLike, { isLoading: likePending }] = useTogglePostLikeMutation();
  const [toggleBookmark, { isLoading: bookmarkPending }] = useTogglePostBookmarkMutation();

  const [liked, setLiked] = useState(initialLiked);
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [bookmarkCount, setBookmarkCount] = useState(initialBookmarkCount);

  useEffect(() => {
    setLikeCount(initialLikeCount);
    setBookmarkCount(initialBookmarkCount);
  }, [initialLikeCount, initialBookmarkCount]);

  useEffect(() => {
    setLiked(isAuthenticated ? (likedStatus ?? initialLiked) : false);
  }, [initialLiked, isAuthenticated, likedStatus]);

  useEffect(() => {
    setBookmarked(isAuthenticated ? (bookmarkedStatus ?? initialBookmarked) : false);
  }, [bookmarkedStatus, initialBookmarked, isAuthenticated]);

  async function handleLike(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    if (!isAuthenticated || likePending) {
      return;
    }

    const nextLiked = !liked;
    setLiked(nextLiked);
    setLikeCount((count) => Math.max(0, count + (nextLiked ? 1 : -1)));

    try {
      const response = await toggleLike(postId).unwrap();
      setLiked(response.liked);
      setLikeCount(response.likeCount);
    } catch {
      setLiked(liked);
      setLikeCount(initialLikeCount);
    }
  }

  async function handleBookmark(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    if (!isAuthenticated || bookmarkPending) {
      return;
    }

    const nextBookmarked = !bookmarked;
    setBookmarked(nextBookmarked);
    setBookmarkCount((count) => Math.max(0, count + (nextBookmarked ? 1 : -1)));

    try {
      const response = await toggleBookmark(postId).unwrap();
      setBookmarked(response.bookmarked);
      setBookmarkCount(response.bookmarkCount);
    } catch {
      setBookmarked(bookmarked);
      setBookmarkCount(initialBookmarkCount);
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
        {bookmarkCount}
      </button>
    </div>
  );
}
