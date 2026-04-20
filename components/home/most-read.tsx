"use client";

import { motion } from "framer-motion";
import { ArrowRight, Clock, Eye, TrendingUp, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useGetMostViewedPostsQuery } from "@/lib/services/auth-api";

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

export function MostRead() {
  const { data: posts = [], isLoading } = useGetMostViewedPostsQuery({ page: 0, size: 1 });
  const post = posts[0];

  if (isLoading) {
    return (
      <section className="container mx-auto px-4 py-10">
        <div className="flex h-64 items-center justify-center bg-card comic-border">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  if (!post) {
    return (
      <section className="container mx-auto px-4 py-10">
        <div className="mb-6 flex items-center gap-4">
          <TrendingUp size={28} className="shrink-0 text-accent" />
          <h2 className="font-bangers text-3xl text-primary sm:text-4xl md:text-5xl">
            TODAY&apos;S MOST READ
          </h2>
          <div className="h-1 flex-1 bg-secondary" />
        </div>
        <div className="flex min-h-[300px] flex-col items-center justify-center bg-card p-6 text-center comic-border halftone-bg sm:p-12">
          <div className="mb-4 text-6xl">📚</div>
          <h3 className="mb-2 font-bangers text-3xl text-primary">No Reader Activity Yet!</h3>
          <p className="max-w-md font-oswald text-base text-muted-foreground sm:text-xl">
            Be the first to break the charts! Check out our latest issues and start reading.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-10">
      <div className="mb-6 flex items-center gap-4">
        <TrendingUp size={28} className="shrink-0 text-accent" />
        <h2 className="font-bangers text-3xl text-primary sm:text-4xl md:text-5xl">
          TODAY&apos;S MOST READ
        </h2>
        <div className="h-1 flex-1 bg-secondary" />
      </div>
      <motion.article
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="group"
      >
        <div className="flex flex-col overflow-hidden bg-card transition-colors md:flex-row comic-border">
          <Link href={`/posts/${post.slug}`} className="relative aspect-video min-h-60 overflow-hidden bg-gradient-to-br from-violet-900 via-purple-700 to-accent/70 md:w-2/5 md:aspect-auto">
            {post.thumbnailUrl ? (
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                style={{ backgroundImage: `url(${post.thumbnailUrl})` }}
              />
            ) : (
              <div className="absolute inset-0 halftone-bg opacity-30" />
            )}
            <div className="absolute inset-0 bg-linear-to-t from-background/60 via-transparent to-transparent" />
            {!post.thumbnailUrl && (
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{
                    duration: 4,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                  className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-primary/60 md:h-36 md:w-36"
                >
                  <Eye size={40} className="text-primary/80" />
                </motion.div>
              </div>
            )}
            <div className="absolute left-3 top-3 bg-accent px-3 py-1 font-bangers text-base text-background comic-border-secondary sm:left-4 sm:top-4 sm:text-lg">
              #1 TODAY
            </div>
          </Link>
          <div className="flex flex-1 flex-col justify-center p-6 md:p-10">
            <div className="mb-4 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link href={`/users/${post.author.username}`} className="group/author flex items-center gap-3">
                <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-primary bg-accent shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-transform group-hover/author:scale-110">
                  {post.author.profileImage ? (
                    <Image
                      src={post.author.profileImage}
                      alt={post.author.fullName}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <span className="font-bangers text-sm text-background uppercase">
                      {post.author.fullName.charAt(0)}
                    </span>
                  )}
                </div>
                <div>
                  <div className="font-bangers text-lg leading-tight transition-colors group-hover/author:text-primary">{post.author.fullName}</div>
                  <div className="font-oswald text-xs uppercase tracking-wider text-muted-foreground">
                    {formatPublishedDate(post.publishedAt || post.createdAt)}
                  </div>
                </div>
              </Link>
              <div className="h-8 w-px bg-border hidden sm:block" />
              <div className="flex flex-wrap gap-3">
                {post.category && (
                  <span className="bg-secondary px-3 py-1 font-oswald text-sm uppercase text-background comic-border-accent">
                    {post.category.name}
                  </span>
                )}
                <span className="flex items-center gap-1 py-1 font-oswald text-sm text-muted-foreground">
                  <Clock size={14} /> {estimateReadMinutes(post.content)} MIN READ
                </span>
                <span className="flex items-center gap-1 py-1 font-oswald text-sm text-accent">
                  <Eye size={14} /> {(post.viewCount || 0).toLocaleString()} views
                </span>
              </div>
            </div>
            <Link href={`/posts/${post.slug}`}>
              <h3 className="mb-4 font-bangers text-3xl leading-tight transition-colors hover:text-accent sm:text-4xl md:text-6xl line-clamp-2">
                {post.title}
              </h3>
            </Link>
            <p className="mb-6 max-w-2xl font-sans text-base text-muted-foreground sm:text-lg line-clamp-3">
              {stripHtml(post.content).slice(0, 180)}...
            </p>
            <Link href={`/posts/${post.slug}`} className="inline-flex items-center gap-2 font-bangers text-xl text-accent transition-colors hover:text-primary">
              CONTINUE READING <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </motion.article>
    </section>
  );
}
