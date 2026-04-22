"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { PostActions } from "@/components/home/post-actions";
import { useGetLatestPostsQuery } from "@/lib/services/auth-api";
import { BookOpen, Clock, Calendar } from "lucide-react";
import { getRenderableImageUrl } from "@/lib/utils/image-url";

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
  const leadThumbnailUrl = getRenderableImageUrl(leadPost?.thumbnailUrl);

  return (
    <section className="relative py-16 md:py-24 overflow-hidden border-y-8 border-foreground">
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, black 1.5px, transparent 1.5px)",
          backgroundSize: "20px 20px",
        }}
      />

      {/* ── Action Lines - Left ── */}
      <svg className="absolute top-1/2 left-0 w-32 h-80 -translate-y-1/2 opacity-[0.08] pointer-events-none" viewBox="0 0 100 300">
        <path d="M80 0 L20 150 L85 300" stroke="black" strokeWidth="3" fill="none" strokeDasharray="12 6"/>
        <path d="M60 30 L10 150 L70 270" stroke="black" strokeWidth="2" fill="none" strokeDasharray="8 8"/>
        <path d="M95 60 L30 150 L90 240" stroke="black" strokeWidth="4" fill="none" strokeDasharray="15 5"/>
      </svg>

      {/* ── Action Lines - Right ── */}
      <svg className="absolute top-1/2 right-0 w-32 h-80 -translate-y-1/2 opacity-[0.08] pointer-events-none rotate-180" viewBox="0 0 100 300">
        <path d="M80 0 L20 150 L85 300" stroke="black" strokeWidth="3" fill="none" strokeDasharray="12 6"/>
        <path d="M60 30 L10 150 L70 270" stroke="black" strokeWidth="2" fill="none" strokeDasharray="8 8"/>
      </svg>

      <div className="container relative z-10 mx-auto px-4">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 200 }}
          className="mb-12 flex items-center gap-4"
        >
          <div className="relative">
            <div className="bg-primary border-4 border-foreground px-5 py-2 shadow-[5px_5px_0px_0px_hsl(var(--foreground))] flex items-center gap-3">
              <BookOpen size={28} className="text-white" strokeWidth={3} />
              <h2 className="font-bangers text-4xl text-white tracking-wide md:text-5xl"
                style={{ 
                  textShadow: '3px 3px 0px hsl(var(--accent))',
                  WebkitTextStroke: '1px black'
                }}
              >
                ORIGIN STORIES
              </h2>
            </div>
          </div>
          <div className="h-[4px] flex-1 bg-foreground shadow-[3px_3px_0px_0px_rgba(0,0,0,0.2)]" />
          <div className="hidden sm:flex items-center gap-2 bg-accent border-3 border-foreground px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -rotate-2">
            <span className="font-bangers text-lg text-white">LATEST</span>
          </div>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="h-112 bg-card border-4 border-foreground shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] lg:col-span-2 animate-pulse" />
            <div className="flex flex-col gap-5">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="h-32 bg-card border-4 border-foreground shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] animate-pulse" />
              ))}
            </div>
          </div>
        ) : isError || !leadPost ? (
          <div className="bg-card border-4 border-foreground p-8 text-center shadow-[8px_8px_0px_0px_hsl(var(--foreground))] relative">
            <div className="absolute -top-3 -right-3 bg-red-500 border-3 border-foreground px-3 py-1 font-bangers text-sm text-white shadow-[3px_3px_0px_0px_hsl(var(--foreground))] rotate-12">
              ERROR!
            </div>
            <p className="font-bangers text-3xl text-foreground" style={{ WebkitTextStroke: '1px black' }}>
              Origin stories unavailable
            </p>
            <p className="mt-3 font-oswald text-sm uppercase tracking-wider text-gray-500">
              We couldn&apos;t load the latest published posts from the API.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Lead Post - Featured Comic Panel */}
            <motion.article
              initial={{ opacity: 0, x: -50, rotate: -1 }}
              whileInView={{ opacity: 1, x: 0, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
              className="group lg:col-span-2 relative"
            >
              {/* Issue Badge */}
              <div className="absolute -top-4 -left-2 z-30 bg-primary border-4 border-foreground px-4 py-2 font-bangers text-xl text-foreground shadow-[4px_4px_0px_0px_hsl(var(--foreground))] -rotate-3">
                FEATURED ISSUE
              </div>

              <div className="flex h-full flex-col overflow-hidden bg-card border-4 border-foreground shadow-[10px_10px_0px_0px_hsl(var(--foreground))] transition-all duration-300 group-hover:shadow-[14px_14px_0px_0px_hsl(var(--foreground))]">
                {/* Inner dashed border */}
                <div className="absolute inset-3 border-2 border-dashed border-gray-200 pointer-events-none z-20"/>
                
                <Link href={`/posts/${leadPost.slug}`} className="block cursor-pointer relative">
                  <div className="relative aspect-video w-full overflow-hidden bg-gradient-to-br from-primary/80 to-accent/80 md:aspect-[21/9]">
                    <div className="absolute inset-0 opacity-20" style={{
                      backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
                      backgroundSize: "8px 8px",
                    }}/>
                    {leadThumbnailUrl ? (
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                        style={{ backgroundImage: `url("${leadThumbnailUrl}")` }}
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-accent/80 transition-transform duration-500 group-hover:scale-105" />
                    )}
                    {/* Bottom gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    
                    {/* Floating category badge on image */}
                    {leadPost.category && (
                      <div className="absolute bottom-4 left-4 z-20">
                        <div className="bg-primary border-3 border-foreground px-4 py-1 font-bangers text-lg text-white shadow-[3px_3px_0px_0px_hsl(var(--foreground))] rotate-[-2deg]">
                          {leadPost.category.name}
                        </div>
                      </div>
                    )}
                  </div>
                </Link>

                <div className="relative z-10 flex flex-1 flex-col justify-end bg-card p-6 md:p-8">
                  {/* Meta Row */}
                  <div className="mb-4 flex flex-wrap items-center gap-3">
                    <Link href={`/users/${leadPost.author.username}`} className="group/author flex items-center gap-3">
                      <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden border-3 border-foreground bg-accent shadow-[3px_3px_0px_0px_hsl(var(--foreground))] transition-transform group-hover/author:scale-110 group-hover/author:rotate-3"
                        style={{ clipPath: 'polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)' }}
                      >
                        {leadPost.author.profileImage ? (
                          <Image
                            src={leadPost.author.profileImage}
                            alt={leadPost.author.fullName}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        ) : (
                          <span className="font-bangers text-sm text-white drop-shadow-md">
                            {getAuthorInitials(leadPost.author.fullName)}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bangers text-lg text-foreground tracking-wide">
                          {leadPost.author.fullName}
                        </span>
                        <span className="font-oswald text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1">
                          <Calendar size={12} /> {formatDate(leadPost.publishedAt ?? leadPost.createdAt)}
                        </span>
                      </div>
                    </Link>
                    
                    <div className="ml-auto flex items-center gap-2 bg-foreground px-3 py-1 border-2 border-foreground shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)]">
                      <Clock size={14} className="text-background" />
                      <span className="font-oswald text-sm font-bold uppercase text-background">
                        {getReadTime(leadPost.content)}
                      </span>
                    </div>
                  </div>

                  <Link href={`/posts/${leadPost.slug}`} className="block cursor-pointer">
                    <h3 className="mb-4 font-bangers text-3xl text-foreground transition-colors group-hover:text-primary sm:text-4xl md:text-5xl line-clamp-2 leading-tight"
                      style={{ 
                        textShadow: '2px 2px 0px rgba(0,0,0,0.05)',
                      }}
                    >
                      {leadPost.title}
                    </h3>
                  </Link>

                  {/* Excerpt */}
                  <p className="mb-6 font-sans text-base text-muted-foreground line-clamp-2"
                    style={{ fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif' }}
                  >
                    {getExcerpt(leadPost.content)}
                  </p>

                  <div className="flex items-center justify-between border-t-4 border-foreground pt-4 -mx-6 -mb-6 px-6 pb-6 md:-mx-8 md:-mb-8 md:px-8 md:pb-8">
                    <PostActions
                      postId={leadPost.id}
                      initialLikeCount={leadPost.likeCount}
                      initialBookmarkCount={leadPost.bookmarkCount}
                      initialLiked={leadPost.likedByCurrentUser}
                      initialBookmarked={leadPost.bookmarkedByCurrentUser}
                    />
                    <Link href={`/posts/${leadPost.slug}`} className="bg-accent border-3 border-foreground px-4 py-2 font-bangers text-lg text-white shadow-[3px_3px_0px_0px_hsl(var(--foreground))] rotate-2 group-hover:rotate-0 transition-transform">
                      READ MORE →
                    </Link>
                  </div>
                </div>
              </div>
            </motion.article>

            {/* Side Posts - Comic Stack */}
            <div className="flex flex-col gap-5">
              {sidePosts.map((post, index) => {
                const thumbnailUrl = getRenderableImageUrl(post.thumbnailUrl);

                return (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 30, rotate: index % 2 === 0 ? 1 : -1 }}
                  whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.12, type: "spring", stiffness: 150, damping: 15 }}
                  className="group relative"
                >
                  {/* Issue Number Badge */}
                  <div className={`absolute -top-2 ${index % 2 === 0 ? '-right-2' : '-left-2'} z-20 bg-primary border-3 border-foreground px-2 py-1 font-bangers text-xs text-foreground shadow-[2px_2px_0px_0px_hsl(var(--foreground))] ${index % 2 === 0 ? 'rotate-6' : '-rotate-6'}`}>
                    #{String(index + 2).padStart(3, '0')}
                  </div>

                  <div className="bg-card border-4 border-foreground p-4 shadow-[6px_6px_0px_0px_hsl(var(--foreground))] transition-all duration-300 group-hover:shadow-[8px_8px_0px_0px_hsl(var(--foreground))] group-hover:translate-x-[-2px] group-hover:translate-y-[-2px]">
                    <div className="flex flex-row items-center gap-4">
                      <div className="flex flex-1 flex-col justify-center order-1">
                        {/* Category & Meta */}
                        <div className="mb-3 flex flex-wrap gap-2 items-center">
                          <span className="bg-primary border-2 border-foreground px-2 py-0.5 font-bangers text-xs text-foreground shadow-[2px_2px_0px_0px_hsl(var(--foreground))]">
                            {post.category?.name ?? "Latest"}
                          </span>
                          <span className="font-oswald text-xs font-bold uppercase text-gray-500 flex items-center gap-1">
                            <Clock size={10} /> {getReadTime(post.content)}
                          </span>
                        </div>

                        {/* Author */}
                        <Link href={`/users/${post.author.username}`} className="mb-3 group/author flex items-center gap-2">
                          <div className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden border-2 border-foreground bg-accent shadow-[2px_2px_0px_0px_hsl(var(--foreground))] transition-transform group-hover/author:scale-110"
                            style={{ clipPath: 'polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)' }}
                          >
                            {post.author.profileImage ? (
                              <Image
                                src={post.author.profileImage}
                                alt={post.author.fullName}
                                fill
                                sizes="32px"
                                className="object-cover"
                              />
                            ) : (
                              <span className="font-bangers text-[10px] text-white">
                                {getAuthorInitials(post.author.fullName)}
                              </span>
                            )}
                          </div>
                          <div className="font-oswald text-[10px] font-bold uppercase tracking-widest text-gray-500 transition-colors group-hover/author:text-primary">
                            BY {post.author.fullName}
                          </div>
                        </Link>

                        {/* Title */}
                        <Link href={`/posts/${post.slug}`}>
                          <h4 className="mb-2 font-bangers text-xl leading-tight text-foreground transition-colors group-hover:text-primary line-clamp-2 xs:text-2xl">
                            {post.title}
                          </h4>
                        </Link>

                        {/* Date */}
                        <div className="font-oswald text-[10px] uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-1">
                          <Calendar size={10} /> {formatDate(post.publishedAt ?? post.createdAt)}
                        </div>

                        <PostActions
                          postId={post.id}
                          initialLikeCount={post.likeCount}
                          initialBookmarkCount={post.bookmarkCount}
                          initialLiked={post.likedByCurrentUser}
                          initialBookmarked={post.bookmarkedByCurrentUser}
                          compact
                        />
                      </div>

                      {/* Thumbnail */}
                      <Link href={`/posts/${post.slug}`} className="h-28 w-28 shrink-0 overflow-hidden border-3 border-foreground shadow-[4px_4px_0px_0px_hsl(var(--foreground))] order-2 sm:h-32 sm:w-32 transition-transform group-hover:scale-105">
                        {thumbnailUrl ? (
                          <div
                            className="h-full w-full bg-cover bg-center"
                            style={{ backgroundImage: `url("${thumbnailUrl}")` }}
                          />
                        ) : (
                          <div className="h-full w-full bg-gradient-to-br from-orange-700 to-amber-500 flex items-center justify-center">
                            <span className="font-bangers text-2xl text-white/50">?</span>
                          </div>
                        )}
                      </Link>
                    </div>
                  </div>
                </motion.article>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
