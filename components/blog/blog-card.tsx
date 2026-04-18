"use client";

import { motion } from "framer-motion";
import { Clock, Eye, Heart, MessageCircle } from "lucide-react";
import Link from "next/link";
import type { BlogPost } from "@/lib/types";

interface BlogCardProps {
  post: BlogPost;
  index?: number;
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

export function BlogCard({ post, index = 0 }: BlogCardProps) {
  const excerpt = post.content ? stripHtml(post.content).slice(0, 120) : "";
  const needsEllipsis = post.content && stripHtml(post.content).length > 120;

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
        <h3 className="mb-2 font-bangers text-2xl leading-tight transition-colors group-hover:text-accent line-clamp-2">
          {post.title}
        </h3>
      </Link>
      
      <p className="mb-4 font-oswald text-sm text-muted-foreground line-clamp-2">
        {excerpt}{needsEllipsis ? "..." : ""}
      </p>
      
      <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary font-bangers text-xs text-white">
            {post.author.fullName.charAt(0).toUpperCase()}
          </div>
          <div className="font-oswald text-xs font-bold uppercase tracking-wider text-muted-foreground">
            BY {post.author.fullName}
          </div>
        </div>
        
        <div className="flex items-center gap-3 font-oswald text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Heart size={14} className="text-accent" /> {post.likeCount}
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle size={14} className="text-primary" /> {post.commentCount}
          </span>
          <span className="flex items-center gap-1">
            <Eye size={14} className="text-secondary" /> {post.viewCount}
          </span>
        </div>
      </div>
    </motion.article>
  );
}
