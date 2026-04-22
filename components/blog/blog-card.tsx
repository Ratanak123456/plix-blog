"use client";

import { motion } from "framer-motion";
import { BookOpen, Clock, Trash2, MessageCircle, Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "@/lib/types";
import { PostActions } from "@/components/home/post-actions";
import { useAppSelector } from "@/lib/store";
import { getRenderableImageUrl } from "@/lib/utils/image-url";

interface BlogCardProps {
  post: BlogPost;
  index?: number;
  onDelete?: (id: string) => void;
  showStatus?: boolean;
}

function stripHtml(value: string) {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function formatPublishedDate(dateString: string | null) {
  const source = dateString ? new Date(dateString) : new Date();
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(source);
}

function estimateReadMinutes(content: string) {
  const words = stripHtml(content).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function BlogCard({ post, index = 0, onDelete, showStatus = false }: BlogCardProps) {
  const { user: currentUser } = useAppSelector((state) => state.auth);
  const isAuthor = currentUser?.id === post.author.id;
  const thumbnailUrl = getRenderableImageUrl(post.thumbnailUrl);

  return (
    <motion.article
      initial={{ opacity: 0, y: 40, rotate: index % 2 === 0 ? -1 : 1 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true }}
      transition={{
        delay: index * 0.1,
        type: "spring",
        stiffness: 150,
        damping: 15,
      }}
      className="flex cursor-pointer flex-col group relative"
    >
      <Link href={`/posts/${post.slug}`} className="block">
        {/* Comic Panel Frame */}
        <div className="relative mb-5 aspect-[3/2] w-full overflow-hidden bg-card border-4 border-foreground shadow-[6px_6px_0px_0px_hsl(var(--accent))] transition-all duration-300 group-hover:shadow-[10px_10px_0px_0px_hsl(var(--primary))] group-hover:translate-x-[-2px] group-hover:translate-y-[-2px]">
          {/* Inner dashed border */}
          <div className="absolute inset-2 border-2 border-dashed border-gray-200 pointer-events-none z-10" />

          {thumbnailUrl ? (
            <>
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                style={{ backgroundImage: `url("${thumbnailUrl}")` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            </>
          ) : (
            <div className="absolute inset-0 bg-muted">
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, black 1.5px, transparent 1.5px)",
                  backgroundSize: "12px 12px",
                }}
              />
            </div>
          )}

          {/* Category Badge - Comic Style */}
          {post.category && (
            <div className="absolute top-4 left-4 z-20 rotate-[-3deg] transition-transform duration-200 group-hover:rotate-0">
              <div className="bg-primary border-3 border-foreground px-3 py-1 font-bangers text-sm text-foreground shadow-[3px_3px_0px_0px_hsl(var(--foreground))]">
                {post.category.name}
              </div>
            </div>
          )}

          {/* Status Badge */}
          {showStatus && (
            <div className="absolute top-4 right-12 z-20 rotate-[3deg] transition-transform duration-200 group-hover:rotate-0">
              <div className={`${post.status === "PUBLISHED" ? "bg-emerald-500" : "bg-amber-500"} border-3 border-foreground px-3 py-1 font-bangers text-sm text-white shadow-[3px_3px_0px_0px_hsl(var(--foreground))]`}>
                {post.status}
              </div>
            </div>
          )}

          {/* Corner accent */}
          <div className="absolute bottom-0 right-0 w-12 h-12 bg-primary border-l-4 border-t-4 border-foreground z-10 flex items-center justify-center">
            <BookOpen size={20} className="text-white" strokeWidth={2.5} />
          </div>
        </div>
      </Link>

      {/* Meta Row */}
      <div className="mb-3 flex items-center justify-between font-oswald text-xs font-bold uppercase">
        <div className="flex items-center gap-2 bg-primary px-2 py-1 text-white border-2 border-foreground shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <Clock size={12} strokeWidth={2.5} />{" "}
          {estimateReadMinutes(post.content)} MIN READ
        </div>
        <div className="text-gray-500 font-oswald text-xs uppercase tracking-wider border-b-2 border-gray-300 pb-0.5">
          {formatPublishedDate(post.publishedAt || post.createdAt)}
        </div>
      </div>

      {/* Title */}
      <Link href={`/posts/${post.slug}`}>
        <h3
          className="mb-4 font-bangers text-2xl leading-tight text-foreground transition-all duration-200 group-hover:text-primary group-hover:translate-x-1 line-clamp-2 min-h-[3.5rem]"
          style={{
            textShadow: "2px 2px 0px rgba(0,0,0,0.05)",
          }}
        >
          {post.title}
        </h3>
      </Link>

      {/* Stats Row */}
      <div className="mb-4 flex items-center gap-4 font-oswald text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <MessageCircle size={14} className="text-primary" />
          <span>{post.commentCount || 0} Comments</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Eye size={14} className="text-accent" />
          <span>{post.viewCount || 0} Views</span>
        </div>
      </div>

      {/* Author & Actions Bar */}
      <div className="mt-auto flex items-center gap-3 border-t-4 border-foreground pt-4 -mx-2 -mb-2 px-2 pb-2">
        <Link
          href={`/users/${post.author.username}`}
          className="group/author flex items-center gap-3 flex-1"
        >
          <div
            className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden border-3 border-foreground bg-accent shadow-[3px_3px_0px_0px_hsl(var(--foreground))] transition-transform group-hover/author:scale-110 group-hover/author:rotate-3"
            style={{ clipPath: "polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)" }}
          >
            {post.author.profileImage ? (
              <Image
                src={post.author.profileImage}
                alt={post.author.fullName}
                fill
                className="object-cover"
              />
            ) : (
              <span className="font-bangers text-sm text-white drop-shadow-md">
                {post.author.fullName.charAt(0)}
              </span>
            )}
          </div>
          <div className="font-oswald text-xs font-bold uppercase tracking-wider text-gray-600 transition-colors group-hover/author:text-primary">
            BY{" "}
            <span className="text-foreground font-bangers text-sm tracking-wide">
              {post.author.fullName}
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <PostActions
            postId={post.id}
            initialLikeCount={post.likeCount}
            initialBookmarkCount={post.bookmarkCount}
            initialLiked={post.likedByCurrentUser}
            initialBookmarked={post.bookmarkedByCurrentUser}
            compact
          />
          {onDelete && isAuthor && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete(post.id);
              }}
              className="inline-flex h-9 w-9 items-center justify-center bg-red-500 text-white border-3 border-foreground shadow-[3px_3px_0px_0px_hsl(var(--foreground))] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:bg-red-600"
              title="Delete this blog"
            >
              <Trash2 size={14} strokeWidth={2.5} />
            </button>
          )}
        </div>
      </div>

      {/* Issue Number Badge */}
      <div className="absolute -top-3 -right-3 bg-accent border-3 border-foreground px-2 py-1 font-bangers text-xs text-white shadow-[3px_3px_0px_0px_hsl(var(--foreground))] rotate-12 z-20">
        #{String(index + 1).padStart(3, "0")}
      </div>
    </motion.article>
  );
}
