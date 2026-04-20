"use client";

import Link from "next/link";
import { ArrowLeft, Eye, Heart, MessageCircle } from "lucide-react";
import { PostEngagementBar } from "@/components/posts/post-engagement-bar";
import { formatDate, getReadTime } from "@/lib/utils/format";
import { UserProfileLink } from "./user-profile-link";
import { useGetPostBySlugQuery } from "@/lib/services/auth-api";

export function PostDetailView({ slug }: { slug: string }) {
  const { data: post, isLoading, isError } = useGetPostBySlugQuery(slug);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <main className="container mx-auto px-4 py-10 md:py-14">
          <div className="h-8 w-36 animate-pulse bg-card comic-border-secondary" />
          <div className="mt-8 h-16 max-w-4xl animate-pulse bg-card comic-border" />
          <div className="mt-4 h-6 max-w-2xl animate-pulse bg-card comic-border-secondary" />
          <div className="mt-8 aspect-[16/7] w-full animate-pulse bg-card comic-border-accent" />
          <div className="mt-8 grid gap-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="h-6 animate-pulse bg-card comic-border-secondary" />
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <main className="container mx-auto px-4 py-16">
            <div className="mx-auto max-w-3xl bg-card p-6 text-center comic-border-secondary sm:p-8">
            <p className="font-oswald text-xs uppercase tracking-[0.35em] text-muted-foreground">404 issue</p>
              <h1 className="mt-3 font-bangers text-4xl text-primary sm:text-5xl md:text-6xl">Post not found</h1>
            <p className="mt-4 font-sans text-base text-muted-foreground">
              This story arc could not be loaded from the current post feed.
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
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <main>
        <section className="relative overflow-hidden border-b-4 border-primary bg-muted/40">
          <div className="pointer-events-none absolute inset-0 opacity-20 halftone-bg" />
          <div className="relative container mx-auto px-4 py-10 md:py-14">
            <Link
              href="/#blog"
              className="inline-flex items-center gap-2 bg-card px-4 py-2 font-oswald text-xs uppercase tracking-[0.28em] text-primary comic-border-secondary"
            >
              <ArrowLeft size={14} />
              Back to issues
            </Link>

            <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
              <div>
                <div className="flex flex-wrap items-center gap-3 font-oswald text-xs uppercase tracking-[0.28em] text-muted-foreground">
                  <span className="bg-accent px-3 py-1 text-accent-foreground comic-border">
                    {post.category?.name ?? "Latest"}
                  </span>
                  <span>{formatDate(post.publishedAt ?? post.createdAt)}</span>
                  <span>{getReadTime(post.content)}</span>
                </div>
                <h1 className="mt-5 max-w-5xl font-bangers text-4xl leading-none text-foreground drop-shadow-[3px_3px_0px_hsl(var(--primary))] sm:text-5xl md:text-7xl">
                  {post.title}
                </h1>
                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <div>
                    <p className="mb-2 font-oswald text-xs uppercase tracking-[0.3em] text-muted-foreground">Written by</p>
                    <UserProfileLink user={post.author} />
                  </div>
                </div>
              </div>

              <aside className="self-start bg-card p-5 sm:p-6 comic-border-secondary">
                <p className="font-oswald text-xs uppercase tracking-[0.35em] text-muted-foreground">Panel stats</p>
                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  <div className="bg-background p-4 comic-border">
                    <div className="flex items-center gap-2 font-oswald text-xs uppercase tracking-wider text-muted-foreground">
                      <Eye size={14} />
                      Views
                    </div>
                    <p className="mt-2 font-bangers text-3xl text-primary">{post.viewCount}</p>
                  </div>
                  <div className="bg-background p-4 comic-border-accent">
                    <div className="flex items-center gap-2 font-oswald text-xs uppercase tracking-wider text-muted-foreground">
                      <Heart size={14} />
                      Likes
                    </div>
                    <p className="mt-2 font-bangers text-3xl text-primary">{post.likeCount}</p>
                  </div>
                  <div className="bg-background p-4 comic-border">
                    <div className="flex items-center gap-2 font-oswald text-xs uppercase tracking-wider text-muted-foreground">
                      <MessageCircle size={14} />
                      Comments
                    </div>
                    <p className="mt-2 font-bangers text-3xl text-primary">{post.commentCount}</p>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-10 md:py-12">
          <div className="mx-auto max-w-5xl">
            <div className="space-y-8">
              <article className="overflow-hidden bg-card comic-border">
                <div className="relative aspect-[16/7] overflow-hidden bg-linear-to-br from-orange-800 via-primary/50 to-amber-300">
                  <div className="absolute inset-0 opacity-25 halftone-bg" />
                  {post.thumbnailUrl ? (
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${post.thumbnailUrl})` }}
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-linear-to-t from-background/70 via-transparent to-transparent" />
                </div>
                <div className="max-w-none p-6 md:p-10">
                  <div
                    className="post-content font-sans text-base leading-8 text-foreground"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />
                </div>
              </article>
              <PostEngagementBar
                postId={post.id}
                slug={post.slug}
                initialLikeCount={post.likeCount}
                commentCount={post.commentCount}
                initialLiked={post.likedByCurrentUser}
                initialBookmarked={post.bookmarkedByCurrentUser}
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
