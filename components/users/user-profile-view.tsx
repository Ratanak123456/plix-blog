"use client";

import Link from "next/link";
import { ArrowLeft, CalendarDays, FileText, Star, Heart, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import {
  useGetPublicProfileQuery,
  useGetUserPostsQuery,
} from "@/lib/services/auth-api";
import { BlogCard } from "@/components/blog/blog-card";
import { getRenderableImageUrl } from "@/lib/utils/image-url";
import { useAppSelector } from "@/lib/store";
import { formatDate, getInitials } from "./profile-utils";

export function UserProfileView({ username }: { username: string }) {
  const { user: currentUser } = useAppSelector((state) => state.auth);
  const {
    data: user,
    isLoading: isUserLoading,
    isError: isUserError,
  } = useGetPublicProfileQuery(username);
  const { data: posts = [], isLoading: arePostsLoading } = useGetUserPostsQuery(
    {
      username,
      size: 12,
    },
  );
  const coverImageUrl = getRenderableImageUrl(user?.coverImage);
  const profileImageUrl = getRenderableImageUrl(user?.profileImage);

  if (isUserLoading) {
    return (
      <main className="container mx-auto px-4 py-12">
        <div className="h-10 w-40 animate-pulse bg-card comic-border-secondary" />
        <div className="mt-8 h-48 animate-pulse bg-card comic-border" />
      </main>
    );
  }

  if (isUserError || !user) {
    return (
      <main className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-3xl bg-card p-6 text-center comic-border-secondary sm:p-8">
          <p className="font-oswald text-xs uppercase tracking-[0.35em] text-muted-foreground">
            404 profile
          </p>
          <h1 className="mt-3 font-bangers text-4xl text-primary sm:text-5xl md:text-6xl">
            User not found
          </h1>
          <p className="mt-4 font-sans text-base text-muted-foreground">
            This creator profile could not be loaded.
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex items-center gap-2 bg-accent px-6 py-3 font-bangers text-xl text-accent-foreground comic-border"
          >
            <ArrowLeft size={18} />
            Back to home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen text-foreground transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b-8 border-foreground">
        {/* Background gradient or cover image */}
        <div
          className="absolute inset-0 bg-linear-to-br from-primary/40 via-secondary/30 to-accent/20"
          style={
            coverImageUrl
              ? {
                  backgroundImage: `linear-gradient(to bottom right, rgba(0,0,0,0.3), rgba(0,0,0,0.1)), url("${coverImageUrl}")`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }
              : undefined
          }
        />

        {/* Halftone overlay */}
        <div
          className="absolute inset-0 opacity-[0.08] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, currentColor 1.5px, transparent 1.5px)",
            backgroundSize: "20px 20px",
          }}
        />

        {/* Action Lines */}
        <svg
          className="absolute top-0 left-0 w-40 h-full opacity-[0.1] pointer-events-none"
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
          className="absolute top-0 right-0 w-40 h-full opacity-[0.1] pointer-events-none rotate-180"
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

        <div className="relative container mx-auto px-4 py-12 md:py-16">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-card border-3 border-foreground px-4 py-2 font-oswald text-xs uppercase tracking-[0.28em] text-foreground shadow-[3px_3px_0px_0px_hsl(var(--foreground))] transition-all hover:-translate-y-1 hover:shadow-[5px_5px_0px_0px_hsl(var(--foreground))]"
            >
              <ArrowLeft size={14} strokeWidth={3} />
              Back to home
            </Link>
          </motion.div>

          <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
            {/* Main Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 100 }}
              className="bg-card border-4 border-foreground p-6 md:p-8 shadow-[10px_10px_0px_0px_hsl(var(--foreground))] relative"
            >
              {/* Inner dashed border */}
              <div className="absolute inset-3 border-2 border-dashed border-foreground/10 pointer-events-none" />

              {/* Corner accents */}
              <div className="absolute -top-3 -left-3 w-8 h-8 bg-primary border-3 border-foreground shadow-[2px_2px_0px_0px_hsl(var(--foreground))]" />
              <div className="absolute -bottom-3 -right-3 w-8 h-8 bg-accent border-3 border-foreground shadow-[2px_2px_0px_0px_hsl(var(--foreground))]" />

              <div className="relative z-10 flex flex-wrap items-start gap-6">
                {/* Avatar */}
                <div className="relative">
                  <div
                    className="flex h-28 w-28 items-center justify-center overflow-hidden border-4 border-foreground shadow-[4px_4px_0px_0px_hsl(var(--foreground))] bg-primary"
                    style={{
                      clipPath: "polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)",
                    }}
                  >
                    {profileImageUrl ? (
                      <div
                        className="h-full w-full bg-cover bg-center"
                        style={{ backgroundImage: `url("${profileImageUrl}")` }}
                      />
                    ) : (
                      <span className="font-bangers text-5xl text-white drop-shadow-md">
                        {getInitials(user.fullName)}
                      </span>
                    )}
                  </div>
                  {/* Status badge */}
                  <div className="absolute -bottom-2 -right-2 bg-green-500 border-3 border-foreground w-6 h-6 shadow-[2px_2px_0px_0px_hsl(var(--foreground))]" />
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-secondary border-2 border-foreground px-2 py-0.5 font-oswald text-[10px] uppercase tracking-[0.35em] text-white shadow-[2px_2px_0px_0px_hsl(var(--foreground))]">
                      User Profile
                    </span>
                  </div>
                  <h1
                    className="font-bangers text-5xl leading-none text-foreground sm:text-6xl md:text-7xl tracking-wide"
                    style={{ textShadow: "3px 3px 0px hsla(var(--foreground), 0.1)" }}
                  >
                    {user.fullName}
                  </h1>
                  <p className="mt-2 font-bangers text-xl text-primary tracking-wide">
                    @{user.username}
                  </p>

                  {/* Bio */}
                  <div className="mt-5 relative border-3 border-foreground p-4 shadow-[4px_4px_0px_0px_hsl(var(--foreground))]">
                    <div className="absolute -top-3 -left-3 bg-accent border-2 border-foreground px-2 py-0.5 font-bangers text-xs text-white shadow-[2px_2px_0px_0px_hsl(var(--foreground))]">
                      BIO
                    </div>
                    <p
                      className="font-sans text-sm leading-7 text-muted-foreground"
                      style={{
                        fontFamily:
                          '"Comic Sans MS", "Chalkboard SE", sans-serif',
                      }}
                    >
                      {user.bio?.trim() || "This user has not added a bio yet."}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Stats Sidebar */}
            <motion.aside
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
              className="bg-card border-4 border-foreground p-6 shadow-[8px_8px_0px_0px_hsl(var(--foreground))] relative"
            >
              {/* Inner dashed border */}
              <div className="absolute inset-2 border-2 border-dashed border-foreground/10 pointer-events-none" />

              {/* Header */}
              <div className="flex items-center gap-2 mb-5 relative z-10">
                <div className="bg-accent border-2 border-foreground p-1.5 shadow-[2px_2px_0px_0px_hsl(var(--foreground))]">
                  <Star size={14} className="text-white" strokeWidth={3} />
                </div>
                <p className="font-oswald text-xs uppercase tracking-[0.35em] text-muted-foreground font-bold">
                  Profile Facts
                </p>
              </div>

              <div className="space-y-4 relative z-10">
                {/* Joined Date */}
                <div className="border-3 border-foreground p-4 shadow-[4px_4px_0px_0px_hsl(var(--foreground))] relative group hover:-translate-y-1 transition-transform bg-background/50">
                  <div className="absolute -top-2 -right-2 bg-primary border-2 border-foreground px-2 py-0.5 font-bangers text-xs text-white shadow-[2px_2px_0px_0px_hsl(var(--foreground))] opacity-0 group-hover:opacity-100 transition-opacity">
                    MEMBER!
                  </div>
                  <div className="flex items-center gap-2 font-oswald text-xs uppercase tracking-wider text-muted-foreground mb-2">
                    <CalendarDays
                      size={14}
                      className="text-primary"
                      strokeWidth={3}
                    />
                    Joined
                  </div>
                  <p className="font-bangers text-3xl text-foreground tracking-wide">
                    {formatDate(user.createdAt)}
                  </p>
                </div>

                {/* Post Count */}
                <div className="border-3 border-foreground p-4 shadow-[4px_4px_0px_0px_hsl(var(--foreground))] relative group hover:-translate-y-1 transition-transform bg-background/50">
                  <div className="absolute -top-2 -right-2 bg-secondary border-2 border-foreground px-2 py-0.5 font-bangers text-xs text-white shadow-[2px_2px_0px_0px_hsl(var(--foreground))] opacity-0 group-hover:opacity-100 transition-opacity">
                    WRITER!
                  </div>
                  <div className="flex items-center gap-2 font-oswald text-xs uppercase tracking-wider text-muted-foreground mb-2">
                    <FileText
                      size={14}
                      className="text-secondary"
                      strokeWidth={3}
                    />
                    Published posts
                  </div>
                  <p className="font-bangers text-3xl text-foreground tracking-wide">
                    {posts.length}
                  </p>
                </div>

                {/* Additional stat - Likes */}
                <div className="border-3 border-foreground p-4 shadow-[4px_4px_0px_0px_hsl(var(--foreground))] relative group hover:-translate-y-1 transition-transform bg-background/50">
                  <div className="absolute -top-2 -right-2 bg-accent border-2 border-foreground px-2 py-0.5 font-bangers text-xs text-white shadow-[2px_2px_0px_0px_hsl(var(--foreground))] opacity-0 group-hover:opacity-100 transition-opacity">
                    POPULAR!
                  </div>
                  <div className="flex items-center gap-2 font-oswald text-xs uppercase tracking-wider text-muted-foreground mb-2">
                    <Heart size={14} className="text-accent" strokeWidth={3} />
                    Total likes
                  </div>
                  <p className="font-bangers text-3xl text-foreground tracking-wide">
                    {posts.reduce(
                      (acc, post) => acc + (post.likeCount || 0),
                      0,
                    )}
                  </p>
                </div>
              </div>
            </motion.aside>
          </div>
        </div>
      </section>

      {/* Posts Section */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="relative">
              <svg
                className="absolute -inset-4 w-[calc(100%+32px)] h-[calc(100%+32px)] text-yellow-400 -z-10"
                viewBox="0 0 100 100"
              >
                <path
                  d="M50 0 L58 38 L95 30 L65 55 L85 90 L50 68 L15 90 L35 55 L5 30 L42 38Z"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
              <div className="bg-primary border-3 border-foreground px-4 py-2 shadow-[4px_4px_0px_0px_hsl(var(--foreground))]">
                <p className="font-oswald text-xs uppercase tracking-[0.35em] text-white font-bold">
                  Latest from @{user.username}
                </p>
              </div>
            </div>
            <h2
              className="font-bangers text-4xl text-foreground sm:text-5xl tracking-wide"
              style={{ textShadow: "3px 3px 0px hsla(var(--foreground), 0.1)" }}
            >
              Published Stories
            </h2>
          </div>

          {/* Story count badge */}
          <div className="hidden sm:flex items-center gap-2 bg-accent border-3 border-foreground px-4 py-2 shadow-[4px_4px_0px_0px_hsl(var(--foreground))] -rotate-2">
            <BookOpen size={18} className="text-white" strokeWidth={3} />
            <span className="font-bangers text-lg text-white">
              {posts.filter((p) => p.status === "PUBLISHED").length} ISSUES
            </span>
          </div>
        </motion.div>

        {arePostsLoading ? (
          <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-56 bg-card border-4 border-foreground shadow-[6px_6px_0px_0px_hsl(var(--foreground))] animate-pulse relative"
              >
                <div className="absolute inset-2 border-2 border-dashed border-foreground/10" />
              </div>
            ))}
          </div>
        ) : posts.length ? (
          <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {posts
              .filter((post) => post.status === "PUBLISHED")
              .map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{
                    opacity: 0,
                    y: 30,
                    rotate: index % 2 === 0 ? -1 : 1,
                  }}
                  whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 150,
                  }}
                >
                  <BlogCard
                    post={post}
                    index={index}
                    showEditButton={currentUser?.id === post.author.id}
                  />
                </motion.div>
              ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6 bg-card border-4 border-foreground p-8 text-center shadow-[8px_8px_0px_0px_hsl(var(--foreground))] relative"
          >
            <div className="absolute -top-3 -right-3 bg-yellow-400 border-3 border-foreground px-3 py-1 font-bangers text-sm text-black shadow-[2px_2px_0px_0px_hsl(var(--foreground))] rotate-12">
              EMPTY!
            </div>
            <div className="text-6xl mb-4">📭</div>
            <p className="font-bangers text-3xl text-foreground mb-2">
              No Stories Yet!
            </p>
            <p className="font-oswald text-sm uppercase tracking-wider text-muted-foreground">
              This user hasn&apos;t published any issues yet.
            </p>
          </motion.div>
        )}
      </section>
    </main>
  );
}
