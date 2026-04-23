"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BarChart3,
  CalendarDays,
  Clock,
  Edit3,
  Eye,
  Heart,
  MessageCircle,
} from "lucide-react";
import { PostEngagementBar } from "@/components/posts/post-engagement-bar";
import { getRenderableImageUrl } from "@/lib/utils/image-url";
import { formatDate, getReadTime } from "@/lib/utils/format";
import { UserProfileLink } from "./user-profile-link";
import { useGetPostBySlugQuery } from "@/lib/services/auth-api";
import { useAppSelector } from "@/lib/store";

export function PostDetailView({ slug }: { slug: string }) {
  const { user: currentUser } = useAppSelector((state) => state.auth);
  const { data: post, isLoading, isError } = useGetPostBySlugQuery(slug);
  const thumbnailUrl = getRenderableImageUrl(post?.thumbnailUrl);

  if (isLoading) {
    return (
      <div className="min-h-screen ">
        <main className="container mx-auto px-4 py-10 md:py-14">
          <div className="h-8 w-36 animate-pulse bg-card border-3 border-foreground shadow-[3px_3px_0px_0px_hsl(var(--foreground))]" />
          <div className="mt-8 h-16 max-w-4xl animate-pulse bg-card border-4 border-foreground shadow-[6px_6px_0px_0px_hsl(var(--foreground))]" />
          <div className="mt-4 h-6 max-w-2xl animate-pulse bg-card border-3 border-foreground shadow-[4px_4px_0px_0px_hsl(var(--foreground))]" />
          <div className="mt-8 aspect-16/7 w-full animate-pulse bg-card border-4 border-foreground shadow-[8px_8px_0px_0px_hsl(var(--foreground))]" />
          <div className="mt-8 grid gap-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="h-6 animate-pulse bg-card border-3 border-foreground shadow-[3px_3px_0px_0px_hsl(var(--foreground))]"
              />
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="min-h-screen ">
        <main className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="mx-auto max-w-3xl bg-card border-4 border-foreground p-8 text-center shadow-[10px_10px_0px_0px_hsl(var(--foreground))] relative"
          >
            {/* Inner dashed border */}
            <div className="absolute inset-3 border-2 border-dashed border-muted-border pointer-events-none" />

            {/* Error badge */}
            <div className="absolute -top-4 -right-4 bg-red-500 border-3 border-foreground px-4 py-2 font-bangers text-xl text-white shadow-[3px_3px_0px_0px_hsl(var(--foreground))] rotate-12">
              404!
            </div>

            <p className="font-oswald text-xs uppercase tracking-[0.35em] text-muted-foreground font-bold">
              Missing Issue
            </p>
            <h1
              className="mt-4 font-bangers text-5xl text-foreground sm:text-6xl md:text-7xl tracking-wide"
              style={{ textShadow: "3px 3px 0px rgba(0,0,0,0.1)" }}
            >
              Post Not Found
            </h1>
            <p
              className="mt-4 font-sans text-base text-muted-foreground"
              style={{
                fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif',
              }}
            >
              This story arc could not be loaded from the current post feed.
            </p>
            <Link
              href="/"
              className="mt-8 inline-flex items-center gap-3 bg-accent border-3 border-foreground px-6 py-3 font-bangers text-xl text-white shadow-[4px_4px_0px_0px_hsl(var(--foreground))] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_hsl(var(--foreground))] hover:bg-primary"
            >
              <ArrowLeft size={18} strokeWidth={3} />
              Back to Home
            </Link>
          </motion.div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden ">
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b-8 border-foreground">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-linear-to-br from-primary/30 via-secondary/20 to-accent/10" />

          {/* Halftone overlay */}
          <div
            className="absolute inset-0 opacity-[0.08] dark:opacity-[0.05] pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle, currentColor 1.5px, transparent 1.5px)",
              backgroundSize: "20px 20px",
            }}
          />

          {/* Action Lines */}
          <svg
            className="absolute top-0 left-0 w-40 h-full opacity-[0.1] dark:opacity-[0.2] pointer-events-none"
            viewBox="0 0 100 400"
            preserveAspectRatio="none"
          >
            <path
              d="M80 0 L20 200 L85 400"
              stroke="currentColor"
              strokeWidth="3"
              fill="none"
              strokeDasharray="12 6"
            />
            <path
              d="M60 50 L10 200 L70 350"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeDasharray="8 8"
            />
          </svg>
          <svg
            className="absolute top-0 right-0 w-40 h-full opacity-[0.1] dark:opacity-[0.2] pointer-events-none rotate-180"
            viewBox="0 0 100 400"
            preserveAspectRatio="none"
          >
            <path
              d="M80 0 L20 200 L85 400"
              stroke="currentColor"
              strokeWidth="3"
              fill="none"
              strokeDasharray="12 6"
            />
          </svg>

          <div className="relative container mx-auto px-4 py-10 md:py-14">
            {/* Back Button */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <Link
                href="/#blog"
                className="inline-flex items-center gap-2 bg-card border-3 border-foreground px-4 py-2 font-oswald text-xs uppercase tracking-[0.28em] text-foreground shadow-[3px_3px_0px_0px_hsl(var(--foreground))] transition-all hover:-translate-y-1 hover:shadow-[5px_5px_0px_0px_hsl(var(--foreground))]"
              >
                <ArrowLeft size={14} strokeWidth={3} />
                Back to Issues
              </Link>
            </motion.div>

            <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_24rem]">
              {/* Main Content */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 100 }}
              >
                {/* Meta Row */}
                <div className="flex flex-wrap items-center gap-3 font-oswald text-xs uppercase tracking-[0.28em] text-muted-foreground mb-4">
                  <span className="bg-accent border-2 border-foreground px-3 py-1 text-white shadow-[2px_2px_0px_0px_hsl(var(--foreground))] font-bold">
                    {post.category?.name ?? "Latest"}
                  </span>
                  <span className="flex items-center gap-1">
                    <CalendarDays size={12} strokeWidth={3} />
                    {formatDate(post.publishedAt ?? post.createdAt)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} strokeWidth={3} />
                    {getReadTime(post.content)}
                  </span>
                </div>

                {/* Title */}
                <h1
                  className="mt-5 max-w-5xl font-bangers text-5xl leading-none text-foreground sm:text-6xl md:text-7xl lg:text-8xl tracking-wide"
                  style={{ textShadow: "4px 4px 0px rgba(0,0,0,0.1)" }}
                >
                  {post.title}
                </h1>

                {/* Author Row */}
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-3 bg-card border-3 border-foreground px-4 py-3 shadow-[4px_4px_0px_0px_hsl(var(--foreground))]">
                    <p className="font-oswald text-xs uppercase tracking-[0.3em] text-muted-foreground font-bold">
                      Written by
                    </p>
                    <UserProfileLink user={post.author} />
                  </div>

                  {currentUser?.id === post.author.id && (
                    <Link
                      href={`/write/${post.slug}`}
                      className="flex items-center gap-2 bg-primary border-3 border-foreground px-5 py-3 font-bangers text-lg text-white shadow-[4px_4px_0px_0px_hsl(var(--foreground))] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_hsl(var(--foreground))] hover:bg-secondary"
                    >
                      <Edit3 size={18} strokeWidth={3} /> EDIT ISSUE
                    </Link>
                  )}
                </div>
              </motion.div>

              {/* Stats Sidebar */}
              <motion.aside
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
                className="self-start bg-card border-4 border-foreground p-5 sm:p-6 shadow-[8px_8px_0px_0px_hsl(var(--foreground))] relative"
              >
                {/* Inner dashed border */}
                <div className="absolute inset-2 border-2 border-dashed border-muted-border pointer-events-none" />

                {/* Corner accent */}
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-secondary border-3 border-foreground shadow-[2px_2px_0px_0px_hsl(var(--foreground))]" />

                <div className="flex items-center gap-2 mb-5 relative z-10">
                  <div className="bg-primary border-2 border-foreground p-1.5 shadow-[2px_2px_0px_0px_hsl(var(--foreground))]">
                    <BarChart3
                      size={14}
                      className="text-white"
                      strokeWidth={3}
                    />
                  </div>
                  <p className="font-oswald text-xs uppercase tracking-[0.35em] text-muted-foreground font-bold">
                    Panel Stats
                  </p>
                </div>

                <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-1 relative z-10">
                  {/* Views */}
                  <div className="border-3 border-foreground p-4 shadow-[4px_4px_0px_0px_hsl(var(--foreground))] relative group hover:-translate-y-1 transition-transform bg-card">
                    <div className="absolute -top-2 -right-2 bg-primary border-2 border-foreground px-2 py-0.5 font-bangers text-xs text-white shadow-[2px_2px_0px_0px_hsl(var(--foreground))] opacity-0 group-hover:opacity-100 transition-opacity">
                      VIEWS!
                    </div>
                    <div className="flex items-center gap-2 font-oswald text-xs uppercase tracking-wider text-muted-foreground mb-2">
                      <Eye size={14} className="text-primary" strokeWidth={3} />
                      Views
                    </div>
                    <p className="font-bangers text-3xl text-foreground tracking-wide">
                      {post.viewCount?.toLocaleString() ?? 0}
                    </p>
                  </div>

                  {/* Likes */}
                  <div className="border-3 border-foreground p-4 shadow-[4px_4px_0px_0px_hsl(var(--foreground))] relative group hover:-translate-y-1 transition-transform bg-card">
                    <div className="absolute -top-2 -right-2 bg-accent border-2 border-foreground px-2 py-0.5 font-bangers text-xs text-white shadow-[2px_2px_0px_0px_hsl(var(--foreground))] opacity-0 group-hover:opacity-100 transition-opacity">
                      LIKES!
                    </div>
                    <div className="flex items-center gap-2 font-oswald text-xs uppercase tracking-wider text-muted-foreground mb-2">
                      <Heart
                        size={14}
                        className="text-accent"
                        strokeWidth={3}
                      />
                      Likes
                    </div>
                    <p className="font-bangers text-3xl text-foreground tracking-wide">
                      {post.likeCount?.toLocaleString() ?? 0}
                    </p>
                  </div>

                  {/* Comments */}
                  <div className="border-3 border-foreground p-4 shadow-[4px_4px_0px_0px_hsl(var(--foreground))] relative group hover:-translate-y-1 transition-transform bg-card">
                    <div className="absolute -top-2 -right-2 bg-secondary border-2 border-foreground px-2 py-0.5 font-bangers text-xs text-white shadow-[2px_2px_0px_0px_hsl(var(--foreground))] opacity-0 group-hover:opacity-100 transition-opacity">
                      CHAT!
                    </div>
                    <div className="flex items-center gap-2 font-oswald text-xs uppercase tracking-wider text-muted-foreground mb-2">
                      <MessageCircle
                        size={14}
                        className="text-secondary"
                        strokeWidth={3}
                      />
                      Comments
                    </div>
                    <p className="font-bangers text-3xl text-foreground tracking-wide">
                      {post.commentCount?.toLocaleString() ?? 0}
                    </p>
                  </div>
                </div>
              </motion.aside>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="container mx-auto px-4 py-10 md:py-12">
          <div className="mx-auto max-w-5xl">
            <div className="space-y-8">
              {/* Article Card */}
              <motion.article
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 100, delay: 0.3 }}
                className="overflow-hidden bg-card border-4 border-foreground shadow-[10px_10px_0px_0px_hsl(var(--foreground))] relative"
              >
                {/* Inner dashed border */}
                <div className="absolute inset-3 border-2 border-dashed border-muted-border pointer-events-none z-10" />

                {/* Thumbnail */}
                <div className="relative aspect-16/7 overflow-hidden bg-linear-to-br from-primary/40 via-secondary/30 to-accent/20 border-b-4 border-foreground">
                  <div
                    className="absolute inset-0 opacity-20 pointer-events-none"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle, currentColor 1.5px, transparent 1.5px)",
                      backgroundSize: "8px 8px",
                    }}
                  />
                  {thumbnailUrl ? (
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url("${thumbnailUrl}")` }}
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

                  {/* Floating category badge on image */}
                  {post.category && (
                    <div className="absolute bottom-4 left-4 z-20">
                      <div className="bg-primary border-3 border-foreground px-4 py-2 font-bangers text-lg text-white shadow-[3px_3px_0px_0px_hsl(var(--foreground))] -rotate-2">
                        {post.category.name}
                      </div>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="max-w-none p-6 md:p-10 relative z-10">
                  <div
                    className="post-content font-sans text-base leading-8 text-foreground"
                    style={{
                      fontFamily:
                        '"Comic Sans MS", "Chalkboard SE", sans-serif',
                    }}
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />
                </div>

                {/* Bottom decorative bar */}
                <div className="border-t-4 border-foreground p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-primary border-2 border-foreground rotate-45" />
                    <span className="font-oswald text-xs uppercase tracking-widest text-muted-foreground">
                      End of Issue
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-foreground rounded-full" />
                    <div className="w-2 h-2 bg-foreground rounded-full" />
                    <div className="w-2 h-2 bg-foreground rounded-full" />
                  </div>
                </div>
              </motion.article>

              {/* Engagement Bar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <PostEngagementBar
                  postId={post.id}
                  slug={post.slug}
                  initialLikeCount={post.likeCount}
                  commentCount={post.commentCount}
                  initialLiked={post.likedByCurrentUser}
                  initialBookmarked={post.bookmarkedByCurrentUser}
                />
              </motion.div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
