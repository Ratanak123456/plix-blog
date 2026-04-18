"use client";

import { motion } from "framer-motion";
import { ArrowRight, Heart } from "lucide-react";
import Link from "next/link";
import { useGetMostLikedPostsQuery } from "@/lib/services/auth-api";
import { 
  stripHtml, 
  formatIssueNumber, 
  formatPublishedDate, 
  estimateReadMinutes 
} from "@/lib/utils/blog";

export function Hero() {
  const { data: posts = [], isLoading, isError } = useGetMostLikedPostsQuery({ page: 0, size: 1 });
  const featuredPost = posts[0];
  const cleanedContent = featuredPost ? stripHtml(featuredPost.content) : "";
  const excerpt = cleanedContent ? cleanedContent.slice(0, 140) : "";
  const needsEllipsis = cleanedContent.length > 140;

  return (
    <section className="container mx-auto px-4 py-12 md:py-16">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden bg-card p-4 md:p-8 comic-border halftone-bg"
      >
        <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-primary/20 via-transparent to-accent/20" />
        <div className="relative z-10 flex flex-col items-center gap-8 md:flex-row">
          <div className="flex-1 space-y-5">
            <div className="inline-block -rotate-2 bg-primary px-4 py-1 font-bangers text-xl text-background comic-border-secondary">
              {featuredPost ? `DAILY ISSUE #${formatIssueNumber(featuredPost.createdAt)}` : "DAILY ISSUE"}
            </div>
            {isLoading ? (
              <>
                <div className="h-28 max-w-2xl animate-pulse bg-primary/10 comic-border md:h-40" />
                <div className="h-24 max-w-lg animate-pulse bg-background/70 comic-border-secondary" />
              </>
            ) : isError || !featuredPost ? (
              <>
                <h1 className="font-bangers text-5xl leading-none uppercase drop-shadow-[4px_4px_0px_hsl(var(--secondary))] md:text-7xl">
                  Most Liked <br />
                  <span className="text-accent">Story Offline</span>
                </h1>
                <div className="inline-block max-w-lg p-4 font-oswald text-xl text-foreground md:p-5 speech-bubble">
                  We couldn&apos;t load the top story right now. Check the API connection and try again.
                </div>
              </>
            ) : (
              <>
                <h1 className="font-bangers line-clamp-2 text-6xl leading-none uppercase drop-shadow-[4px_4px_0px_hsl(var(--secondary))] md:text-8xl">
                  {featuredPost.title}
                </h1>
                <div className="flex flex-wrap items-center gap-3 font-oswald text-sm uppercase tracking-wider text-muted-foreground">
                  <span>{featuredPost.author.fullName}</span>
                  <span>{formatPublishedDate(featuredPost.publishedAt ?? featuredPost.createdAt)}</span>
                  <span>{estimateReadMinutes(featuredPost.content)} min read</span>
                  <span className="flex items-center gap-1 text-accent">
                    <Heart size={14} /> {featuredPost.likeCount} likes
                  </span>
                </div>
                <div className="inline-block max-w-lg p-4 font-oswald text-xl text-foreground md:p-5 speech-bubble">
                  &quot;{excerpt}
                  {needsEllipsis ? "..." : ""}&quot;
                </div>
                <div className="pt-4">
                  <Link
                    href={`/posts/${featuredPost.slug}`}
                    className="inline-flex items-center gap-3 bg-accent px-8 py-4 font-bangers text-2xl text-background transition-all hover:-translate-y-2 hover:rotate-1 hover:shadow-lg comic-border"
                  >
                    READ THE FULL STRIP <ArrowRight size={22} />
                  </Link>
                </div>
              </>
            )}
          </div>
          <div className="w-full flex-1">
            <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden bg-linear-to-tr from-indigo-900 via-primary/50 to-accent comic-border-accent md:aspect-4/3">
              {featuredPost?.thumbnailUrl ? (
                <>
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${featuredPost.thumbnailUrl})` }}
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-background/60 via-transparent to-transparent" />
                </>
              ) : (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 20,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                  className="flex h-32 w-32 items-center justify-center rounded-lg border-8 border-background/50 md:h-64 md:w-64"
                >
                  <div className="h-16 w-16 rounded-full bg-accent/80 blur-xl md:h-32 md:w-32" />
                </motion.div>
              )}
              {featuredPost?.category && (
                <div className="absolute top-4 left-4 z-20 -rotate-2 bg-accent px-3 py-1 font-bangers text-lg text-background comic-border-secondary">
                  {featuredPost.category.name}
                </div>
              )}
              <div className="pointer-events-none absolute inset-0 z-10 border-16 border-card/20" />
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
