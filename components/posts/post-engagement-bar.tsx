"use client";

import { useRouter } from "next/navigation";
import { Heart, MessageCircle, Send, Bookmark } from "lucide-react";
import { useState } from "react";
import {
  useGetPostLikeStatusQuery,
  useTogglePostLikeMutation,
  useGetPostBookmarkStatusQuery,
  useTogglePostBookmarkMutation,
} from "@/lib/services/auth-api";
import { useAppSelector } from "@/lib/store";
import { navigateWithFallback } from "@/lib/utils/client-navigation";

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
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // Like Logic
  const { data: likedStatus } = useGetPostLikeStatusQuery(postId, {
    skip: !isAuthenticated,
  });
  const [toggleLike, { isLoading: likePending }] = useTogglePostLikeMutation();
  const [likedOverride, setLikedOverride] = useState<boolean | null>(null);
  const [likeCountOverride, setLikeCountOverride] = useState<number | null>(
    null,
  );

  // Bookmark/Save Logic
  const { data: bookmarkedStatus } = useGetPostBookmarkStatusQuery(postId, {
    skip: !isAuthenticated,
  });
  const [toggleBookmark, { isLoading: bookmarkPending }] =
    useTogglePostBookmarkMutation();
  const [bookmarkedOverride, setBookmarkedOverride] = useState<boolean | null>(
    null,
  );

  const liked =
    likedOverride ?? (isAuthenticated ? (likedStatus ?? initialLiked) : false);
  const likeCount = likeCountOverride ?? initialLikeCount;
  const bookmarked =
    bookmarkedOverride ??
    (isAuthenticated ? (bookmarkedStatus ?? initialBookmarked) : false);

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

  const likesHref = `/posts/${slug}/likes`;
  const commentsHref = `/posts/${slug}/comments`;
  const shareHref = `/posts/${slug}/share`;

  return (
    <section className="bg-card border-4 border-foreground shadow-[8px_8px_0px_0px_hsl(var(--foreground))] relative p-5">
      {/* Inner dashed border */}
      <div className="absolute inset-2 border-2 border-dashed border-muted-border pointer-events-none" />

      {/* Top Stats Row */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b-4 border-foreground pb-4 mb-4">
        <button
          type="button"
          onClick={() => navigateWithFallback(router, likesHref)}
          className="inline-flex items-center gap-2 bg-primary border-2 border-foreground px-3 py-1.5 font-oswald text-xs uppercase tracking-[0.28em] text-white shadow-[2px_2px_0px_0px_hsl(var(--foreground))] transition-all hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_hsl(var(--foreground))]"
        >
          <Heart size={14} className="fill-white" strokeWidth={3} />
          <span className="font-bangers text-sm tracking-wide">
            {likeCount}
          </span>
          <span className="opacity-80">like{likeCount === 1 ? "" : "s"}</span>
        </button>

        <button
          type="button"
          onClick={() => navigateWithFallback(router, commentsHref)}
          className="inline-flex items-center gap-2 bg-secondary border-2 border-foreground px-3 py-1.5 font-oswald text-xs uppercase tracking-[0.28em] text-white shadow-[2px_2px_0px_0px_hsl(var(--foreground))] transition-all hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_hsl(var(--foreground))]"
        >
          <MessageCircle size={14} strokeWidth={3} />
          <span className="font-bangers text-sm tracking-wide">
            {commentCount}
          </span>
          <span className="opacity-80">
            comment{commentCount === 1 ? "" : "s"}
          </span>
        </button>

        {/* Decorative element */}
        <div className="hidden sm:flex items-center gap-2">
          <div className="h-[2px] w-8 bg-foreground" />
          <div className="w-2 h-2 bg-accent border-2 border-foreground rotate-45" />
          <div className="h-[2px] w-8 bg-foreground" />
        </div>
      </div>

      {/* Action Buttons Grid */}
      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-2">
        {/* Like Button */}
        <button
          type="button"
          onClick={handleLike}
          disabled={!isAuthenticated || likePending}
          className={`group relative flex flex-col items-center justify-center gap-2 border-3 border-foreground py-4 px-3 font-bangers text-lg tracking-wide transition-all shadow-[4px_4px_0px_0px_hsl(var(--foreground))] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_hsl(var(--foreground))] active:translate-y-0 active:shadow-[2px_2px_0px_0px_hsl(var(--foreground))] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 ${
            liked
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-foreground hover:bg-primary hover:text-primary-foreground"
          }`}
          title={isAuthenticated ? "Like this post" : "Login to like posts"}
        >
          <div
            className={`p-2 border-2 border-foreground ${liked ? "bg-white/20" : "bg-card group-hover:bg-white/20"}`}
          >
            <Heart
              size={20}
              className={liked ? "fill-white" : "group-hover:fill-white"}
              strokeWidth={2.5}
            />
          </div>
          <span className="hidden xs:inline">Like</span>
          {liked && (
            <div className="absolute -top-2 -right-2 bg-yellow-400 border-2 border-foreground px-1.5 py-0.5 font-bangers text-[10px] text-black shadow-[2px_2px_0px_0px_hsl(var(--foreground))] rotate-12">
              POW!
            </div>
          )}
        </button>

        {/* Comment Button */}
        <button
          type="button"
          onClick={() => navigateWithFallback(router, commentsHref)}
          className="group relative flex flex-col items-center justify-center gap-2 bg-muted border-3 border-foreground py-4 px-3 font-bangers text-lg text-foreground tracking-wide transition-all shadow-[4px_4px_0px_0px_hsl(var(--foreground))] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_hsl(var(--foreground))] hover:bg-secondary hover:text-white active:translate-y-0 active:shadow-[2px_2px_0px_0px_hsl(var(--foreground))]"
        >
          <div className="p-2 border-2 border-foreground bg-card group-hover:bg-white/20">
            <MessageCircle size={20} strokeWidth={2.5} />
          </div>
          <span className="hidden xs:inline">Comment</span>
        </button>

        {/* Bookmark Button */}
        <button
          type="button"
          onClick={handleBookmark}
          disabled={!isAuthenticated || bookmarkPending}
          className={`group relative flex flex-col items-center justify-center gap-2 border-3 border-foreground py-4 px-3 font-bangers text-lg tracking-wide transition-all shadow-[4px_4px_0px_0px_hsl(var(--foreground))] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_hsl(var(--foreground))] active:translate-y-0 active:shadow-[2px_2px_0px_0px_hsl(var(--foreground))] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 ${
            bookmarked
              ? "bg-accent text-accent-foreground"
              : "bg-muted text-foreground hover:bg-accent hover:text-accent-foreground"
          }`}
          title={isAuthenticated ? "Save this post" : "Login to save posts"}
        >
          <div
            className={`p-2 border-2 border-foreground ${bookmarked ? "bg-white/20" : "bg-card group-hover:bg-white/20"}`}
          >
            <Bookmark
              size={20}
              className={bookmarked ? "fill-white" : "group-hover:fill-white"}
              strokeWidth={2.5}
            />
          </div>
          <span className="hidden xs:inline">
            {bookmarked ? "Saved" : "Save"}
          </span>
          {bookmarked && (
            <div className="absolute -top-2 -right-2 bg-yellow-400 border-2 border-foreground px-1.5 py-0.5 font-bangers text-[10px] text-black shadow-[2px_2px_0px_0px_hsl(var(--foreground))] rotate-12">
              BAM!
            </div>
          )}
        </button>

        {/* Share Button */}
        <button
          type="button"
          onClick={() => navigateWithFallback(router, shareHref)}
          className="group relative flex flex-col items-center justify-center gap-2 bg-muted border-3 border-foreground py-4 px-3 font-bangers text-lg text-foreground tracking-wide transition-all shadow-[4px_4px_0px_0px_hsl(var(--foreground))] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_hsl(var(--foreground))] hover:bg-primary hover:text-white active:translate-y-0 active:shadow-[2px_2px_0px_0px_hsl(var(--foreground))]"
        >
          <div className="p-2 border-2 border-foreground bg-card group-hover:bg-white/20">
            <Send size={20} strokeWidth={2.5} />
          </div>
          <span className="hidden xs:inline">Share</span>
        </button>
      </div>

      {/* Bottom decorative bar */}
      <div className="relative z-10 mt-4 pt-4 border-t-2 border-dashed border-muted-border flex items-center justify-center gap-2">
        <div className="h-[2px] w-6 bg-foreground" />
        <div className="w-1.5 h-1.5 bg-accent border border-foreground rotate-45" />
        <div className="h-[2px] w-6 bg-foreground" />
      </div>
    </section>
  );
}
