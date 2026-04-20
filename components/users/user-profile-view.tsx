"use client";

import Link from "next/link";
import { ArrowLeft, CalendarDays, FileText } from "lucide-react";
import {
  useGetPublicProfileQuery,
  useGetUserPostsQuery,
} from "@/lib/services/auth-api";
import { BlogCard } from "@/components/blog/blog-card";

function formatDate(input: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(input));
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "PB";
}

export function UserProfileView({ username }: { username: string }) {
  const { data: user, isLoading: isUserLoading, isError: isUserError } = useGetPublicProfileQuery(username);
  const { data: posts = [], isLoading: arePostsLoading } = useGetUserPostsQuery({ 
    username, 
    size: 12 
  });

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
          <p className="font-oswald text-xs uppercase tracking-[0.35em] text-muted-foreground">404 profile</p>
          <h1 className="mt-3 font-bangers text-4xl text-primary sm:text-5xl md:text-6xl">User not found</h1>
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
    <main className="min-h-screen bg-background text-foreground">
      <section className="relative overflow-hidden border-b-4 border-primary bg-muted/40">
        <div
          className="absolute inset-0 bg-linear-to-br from-primary/40 via-orange-500/30 to-amber-300/30"
          style={
            user.coverImage
              ? {
                  backgroundImage: `linear-gradient(to bottom right, rgba(0,0,0,0.2), rgba(0,0,0,0.05)), url(${user.coverImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }
              : undefined
          }
        />
        <div className="pointer-events-none absolute inset-0 opacity-20 halftone-bg" />
        <div className="relative container mx-auto px-4 py-10 md:py-14">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-card px-4 py-2 font-oswald text-xs uppercase tracking-[0.28em] text-primary comic-border-secondary"
          >
            <ArrowLeft size={14} />
            Back to home
          </Link>

          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem]">
            <div className="bg-card p-6 md:p-8 comic-border">
              <div className="flex flex-wrap items-start gap-5">
                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-primary font-bangers text-4xl text-primary-foreground">
                  {user.profileImage ? (
                    <div
                      className="h-full w-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${user.profileImage})` }}
                    />
                  ) : (
                    getInitials(user.fullName)
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-oswald text-xs uppercase tracking-[0.35em] text-muted-foreground">User profile</p>
                  <h1 className="mt-2 font-bangers text-4xl leading-none text-primary sm:text-5xl md:text-6xl">{user.fullName}</h1>
                  <p className="mt-2 font-sans text-base text-muted-foreground">@{user.username}</p>
                  <p className="mt-5 max-w-3xl font-sans text-sm leading-7 text-foreground">
                    {user.bio?.trim() || "This user has not added a bio yet."}
                  </p>
                </div>
              </div>
            </div>

            <aside className="bg-card p-6 comic-border-accent">
              <p className="font-oswald text-xs uppercase tracking-[0.35em] text-muted-foreground">Profile facts</p>
              <div className="mt-4 space-y-4">
                <div className="bg-background p-4 comic-border">
                  <div className="flex items-center gap-2 font-oswald text-xs uppercase tracking-wider text-muted-foreground">
                    <CalendarDays size={14} />
                    Joined
                  </div>
                  <p className="mt-2 font-bangers text-2xl text-primary">{formatDate(user.createdAt)}</p>
                </div>
                <div className="bg-background p-4 comic-border-secondary">
                  <div className="flex items-center gap-2 font-oswald text-xs uppercase tracking-wider text-muted-foreground">
                    <FileText size={14} />
                    Published posts
                  </div>
                  <p className="mt-2 font-bangers text-2xl text-primary">{posts.length}</p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10 md:py-12">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-oswald text-xs uppercase tracking-[0.35em] text-muted-foreground">Latest from @{user.username}</p>
            <h2 className="mt-2 font-bangers text-3xl text-primary sm:text-4xl">Published stories</h2>
          </div>
        </div>

        {arePostsLoading ? (
          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-56 animate-pulse bg-card comic-border" />
            ))}
          </div>
        ) : posts.length ? (
          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {posts
              .filter((post) => post.status === "PUBLISHED")
              .map((post, index) => (
                <BlogCard key={post.id} post={post} index={index} />
              ))}
          </div>
        ) : (
          <div className="mt-6 bg-card p-6 font-sans text-sm text-muted-foreground comic-border">
            This user does not have any published posts yet.
          </div>
        )}
      </section>
    </main>
  );
}
