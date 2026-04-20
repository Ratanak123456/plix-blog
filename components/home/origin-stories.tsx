"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { PostActions } from "@/components/home/post-actions";
import { useGetLatestPostsQuery } from "@/lib/services/auth-api";

function stripHtml(input: string) {
  return input
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getExcerpt(input: string, maxLength = 180) {
  const plain = stripHtml(input);
  if (plain.length <= maxLength) {
    return plain;
  }

  return `${plain.slice(0, maxLength).trimEnd()}...`;
}

function getReadTime(content: string) {
  const wordCount = stripHtml(content).split(" ").filter(Boolean).length;
  return `${Math.max(1, Math.ceil(wordCount / 200))} MIN READ`;
}

function formatDate(input: string | null) {
  if (!input) {
    return "UNSCHEDULED";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(input)).toUpperCase();
}

function getAuthorInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "PB";
}

export function OriginStories() {
  const { data: posts = [], isLoading, isError } = useGetLatestPostsQuery({ size: 4 });
  const [leadPost, ...sidePosts] = posts;

  return (
    <section className="container mx-auto px-4 py-10">
      <div className="mb-6 flex items-center gap-4">
        <h2 className="font-bangers text-3xl text-primary sm:text-4xl md:text-5xl">
          ORIGIN STORIES
        </h2>
        <div className="h-1 flex-1 bg-secondary" />
      </div>
      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="h-112 animate-pulse bg-card comic-border-secondary lg:col-span-2" />
          <div className="flex flex-col gap-5">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-32 animate-pulse bg-card comic-border-secondary" />
            ))}
          </div>
        </div>
      ) : isError || !leadPost ? (
        <div className="bg-card p-6 text-center comic-border-secondary">
          <p className="font-bangers text-2xl text-primary">Origin stories unavailable</p>
          <p className="mt-2 font-oswald text-sm uppercase tracking-wider text-muted-foreground">
            We couldn&apos;t load the latest published posts from the API.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <motion.article
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="group lg:col-span-2"
          >
            <div className="flex h-full flex-col overflow-hidden bg-muted transition-colors hover:border-primary comic-border-secondary">
              <Link href={`/posts/${leadPost.slug}`} className="block cursor-pointer">
                <div className="relative aspect-video w-full overflow-hidden bg-linear-to-br from-cyan-900 to-emerald-800 md:aspect-21/9">
                  <div className="absolute inset-0 opacity-30 halftone-bg" />
                  {leadPost.thumbnailUrl ? (
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                      style={{ backgroundImage: `url(${leadPost.thumbnailUrl})` }}
                    />
                  ) : (
                    <div className="absolute inset-0 bg-linear-to-br from-cyan-900 to-emerald-800 transition-transform duration-500 group-hover:scale-105" />
                  )}
                </div>
              </Link>
              <div className="relative z-10 -mt-10 flex flex-1 flex-col justify-end border-t-4 border-secondary bg-card p-6 transition-colors group-hover:border-primary md:p-8">
                <div className="mb-3 flex flex-wrap items-center gap-4">
                  <Link href={`/users/${leadPost.author.username}`} className="group/author flex items-center gap-2">
                    <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-primary bg-accent shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-transform group-hover/author:scale-110">
                      {leadPost.author.profileImage ? (
                        <Image
                          src={leadPost.author.profileImage}
                          alt={leadPost.author.fullName}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <span className="font-bangers text-[10px] text-background uppercase">
                          {getAuthorInitials(leadPost.author.fullName)}
                        </span>
                      )}
                    </div>
                    <span className="font-oswald text-xs font-bold uppercase tracking-wider text-muted-foreground transition-colors group-hover/author:text-primary">
                      BY {leadPost.author.fullName} • {formatDate(leadPost.publishedAt ?? leadPost.createdAt)}
                    </span>
                  </Link>
                  <div className="flex gap-3">
                    <span className="bg-secondary px-3 py-1 font-oswald text-sm font-bold uppercase text-background comic-border-accent">
                      {leadPost.category?.name ?? "Latest"}
                    </span>
                    <span className="py-1 font-oswald text-sm text-muted-foreground uppercase">
                      {getReadTime(leadPost.content)}
                    </span>
                  </div>
                </div>
                <Link href={`/posts/${leadPost.slug}`} className="block cursor-pointer">
                  <h3 className="mb-4 font-bangers text-3xl transition-colors group-hover:text-accent sm:text-4xl md:text-5xl line-clamp-2">
                    {leadPost.title}
                  </h3>
                  <p className="line-clamp-3 font-sans text-base text-muted-foreground sm:text-lg">
                    {getExcerpt(leadPost.content)}
                  </p>
                </Link>
                <div className="mt-5">
                  <PostActions
                    postId={leadPost.id}
                    initialLikeCount={leadPost.likeCount}
                    initialBookmarkCount={leadPost.bookmarkCount}
                    initialLiked={leadPost.likedByCurrentUser}
                    initialBookmarked={leadPost.bookmarkedByCurrentUser}
                  />
                </div>
              </div>
            </div>
          </motion.article>

          <div className="flex flex-col gap-5">
            {sidePosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="bg-card p-4 transition-all hover:-translate-y-1 hover:border-primary comic-border-secondary">
                  <div className="flex flex-col gap-4 sm:flex-row">
                    <Link href={`/posts/${post.slug}`} className="h-24 w-24 shrink-0 overflow-hidden bg-linear-to-br from-orange-700 to-amber-500 comic-border-accent">
                      {post.thumbnailUrl ? (
                        <div
                          className="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                          style={{ backgroundImage: `url(${post.thumbnailUrl})` }}
                        />
                      ) : null}
                    </Link>
                    <div className="flex flex-1 flex-col justify-center">
                      <div className="mb-1 flex gap-2 font-oswald text-xs uppercase">
                        <span className="text-accent">{post.category?.name ?? "Latest"}</span>
                        <span className="text-muted-foreground">
                          • {getReadTime(post.content)} • {formatDate(post.publishedAt ?? post.createdAt)}
                        </span>
                      </div>
                      <Link href={`/posts/${post.slug}`}>
                        <h4 className="mb-1 font-bangers text-2xl leading-tight transition-colors group-hover:text-primary line-clamp-2">
                          {post.title}
                        </h4>
                      </Link>
                      <Link href={`/users/${post.author.username}`} className="group/author flex items-center gap-2">
                        <div className="relative flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded-full border border-primary bg-accent shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-transform group-hover/author:scale-110">
                          {post.author.profileImage ? (
                            <Image
                              src={post.author.profileImage}
                              alt={post.author.fullName}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <span className="font-bangers text-[8px] text-background uppercase">
                              {getAuthorInitials(post.author.fullName)}
                            </span>
                          )}
                        </div>
                        <div className="font-oswald text-[10px] font-bold uppercase tracking-widest text-muted-foreground transition-colors group-hover/author:text-primary">
                          BY {post.author.fullName}
                        </div>
                      </Link>
                    </div>
                  </div>
                  <div className="mt-3 sm:ml-28">
                    <PostActions
                      postId={post.id}
                      initialLikeCount={post.likeCount}
                      initialBookmarkCount={post.bookmarkCount}
                      initialLiked={post.likedByCurrentUser}
                      initialBookmarked={post.bookmarkedByCurrentUser}
                      compact
                    />
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
