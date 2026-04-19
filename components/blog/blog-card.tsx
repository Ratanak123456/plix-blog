"use client";

import { motion } from "framer-motion";
import { Clock, Eye, MessageCircle, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "@/lib/types";
import { PostActions } from "@/components/home/post-actions";
import { useAppSelector } from "@/lib/store";

interface BlogCardProps {
  post: BlogPost;
  index?: number;
  onDelete?: (id: string) => void;
}

function stripHtml(value: string) {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
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

export function BlogCard({ post, index = 0, onDelete }: BlogCardProps) {
  const { user: currentUser } = useAppSelector((state) => state.auth);
  const isAuthor = currentUser?.id === post.author.id;

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="flex flex-col group"
    >
      <Link href={`/posts/${post.slug}`} className="block">
        <div className="relative mb-4 aspect-[3/2] w-full overflow-hidden bg-gradient-to-br from-indigo-900 via-primary/50 to-accent comic-border">
          {post.thumbnailUrl ? (
            <>
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                style={{ backgroundImage: `url(${post.thumbnailUrl})` }}
              />
              <div className="absolute inset-0 bg-linear-to-t from-background/60 via-transparent to-transparent" />
            </>
          ) : (
            <div className="absolute inset-0 halftone-bg" />
          )}
          {post.category && (
            <div className="absolute top-3 left-3 rotate-[-2deg] bg-accent px-2 py-0.5 font-bangers text-sm text-background transition-transform group-hover:rotate-0 comic-border-secondary">
              {post.category.name}
            </div>
          )}
        </div>
      </Link>
      
      <div className="mb-2 flex items-center justify-between font-oswald text-xs font-bold uppercase text-primary">
        <div className="flex items-center gap-2">
          <Clock size={12} /> {estimateReadMinutes(post.content)} MIN READ
        </div>
        <div className="text-muted-foreground">{formatPublishedDate(post.publishedAt || post.createdAt)}</div>
      </div>
      
      <Link href={`/posts/${post.slug}`}>
        <h3 className="mb-4 font-bangers text-2xl leading-tight transition-colors group-hover:text-accent line-clamp-2 min-h-[3.5rem]">
          {post.title}
        </h3>
      </Link>
      
      <div className="mt-auto flex flex-col gap-4 border-t border-border pt-4">
        <Link href={`/users/${post.author.username}`} className="group/author flex items-center gap-3">
          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-primary bg-accent shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-transform group-hover/author:scale-110">
            {post.author.profileImage ? (
              <Image
                src={post.author.profileImage}
                alt={post.author.fullName}
                fill
                className="object-cover"
              />
            ) : (
              <span className="font-bangers text-sm text-background">
                {post.author.fullName.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div className="font-oswald text-[11px] font-bold uppercase tracking-wider text-muted-foreground transition-colors group-hover/author:text-primary">
            BY {post.author.fullName}
          </div>
        </Link>
        
        <div className="flex items-center justify-between">
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
                className="inline-flex h-8 w-8 items-center justify-center bg-destructive/10 text-destructive transition-all hover:bg-destructive hover:text-destructive-foreground comic-border"
                title="Delete this blog"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-3 font-oswald text-[10px] text-muted-foreground uppercase tracking-tighter">
            <span className="flex items-center gap-1">
              <MessageCircle size={12} className="text-primary" /> {post.commentCount}
            </span>
            <span className="flex items-center gap-1">
              <Eye size={12} className="text-secondary" /> {post.viewCount}
            </span>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
