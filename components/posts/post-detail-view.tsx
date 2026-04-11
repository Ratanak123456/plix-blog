"use client";

import Link from "next/link";
import { ArrowLeft, Bookmark, Eye, Heart, MessageCircle } from "lucide-react";
import { PostActions } from "@/components/home/post-actions";
import { useGetPostBySlugQuery } from "@/lib/services/auth-api";

function stripHtml(input: string) {
  return input
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getReadTime(content: string) {
  const wordCount = stripHtml(content).split(" ").filter(Boolean).length;
  return `${Math.max(1, Math.ceil(wordCount / 200))} min read`;
}

function formatDate(input: string | null) {
  if (!input) {
    return "Unscheduled";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(input));
}

function getAuthorInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "PB";
}

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
          <div className="mx-auto max-w-3xl bg-card p-8 text-center comic-border-secondary">
            <p className="font-oswald text-xs uppercase tracking-[0.35em] text-muted-foreground">404 issue</p>
            <h1 className="mt-3 font-bangers text-5xl text-primary md:text-6xl">Post not found</h1>
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
                <h1 className="mt-5 max-w-5xl font-bangers text-5xl leading-none text-foreground drop-shadow-[3px_3px_0px_hsl(var(--primary))] md:text-7xl">
                  {post.title}
                </h1>
                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary font-bangers text-lg text-primary-foreground">
                    {getAuthorInitials(post.author.fullName)}
                  </div>
                  <div>
                    <p className="font-oswald text-xs uppercase tracking-[0.3em] text-muted-foreground">Written by</p>
                    <p className="font-bangers text-3xl text-primary">{post.author.fullName}</p>
                    <p className="font-sans text-sm text-muted-foreground">@{post.author.username}</p>
                  </div>
                </div>
              </div>

              <aside className="self-start bg-card p-6 comic-border-secondary">
                <p className="font-oswald text-xs uppercase tracking-[0.35em] text-muted-foreground">Panel stats</p>
                <div className="mt-4 grid grid-cols-2 gap-3">
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
                  <div className="bg-background p-4 comic-border-secondary">
                    <div className="flex items-center gap-2 font-oswald text-xs uppercase tracking-wider text-muted-foreground">
                      <Bookmark size={14} />
                      Saves
                    </div>
                    <p className="mt-2 font-bangers text-3xl text-primary">{post.bookmarkCount}</p>
                  </div>
                  <div className="bg-background p-4 comic-border">
                    <div className="flex items-center gap-2 font-oswald text-xs uppercase tracking-wider text-muted-foreground">
                      <MessageCircle size={14} />
                      Comments
                    </div>
                    <p className="mt-2 font-bangers text-3xl text-primary">{post.commentCount}</p>
                  </div>
                </div>
                <div className="mt-5">
                  <PostActions
                    postId={post.id}
                    initialLikeCount={post.likeCount}
                    initialBookmarkCount={post.bookmarkCount}
                    initialLiked={post.likedByCurrentUser}
                    initialBookmarked={post.bookmarkedByCurrentUser}
                  />
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-10 md:py-12">
          <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_18rem]">
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
              <div className="prose prose-neutral max-w-none p-6 md:p-10 dark:prose-invert">
                <div
                  className="post-content font-sans text-base leading-8 text-foreground"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </div>
            </article>

            <aside className="self-start bg-card p-6 comic-border-accent">
              <p className="font-oswald text-xs uppercase tracking-[0.35em] text-muted-foreground">Story notes</p>
              <div className="mt-4 space-y-4 font-sans text-sm text-muted-foreground">
                <p>This issue was published on {formatDate(post.publishedAt ?? post.createdAt)}.</p>
                <p>The current route is driven by the post slug, so links from the homepage now open the full article view.</p>
              </div>
            </aside>
          </div>
        </section>
      </main>
    </div>
  );
}
