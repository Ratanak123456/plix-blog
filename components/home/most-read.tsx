"use client";

import { motion } from "framer-motion";
import { ArrowRight, Clock, Eye, TrendingUp, Loader2, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useGetMostViewedPostsQuery } from "@/lib/services/auth-api";
import { getRenderableImageUrl } from "@/lib/utils/image-url";

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
  const thumbnailUrl = getRenderableImageUrl(post?.thumbnailUrl);

  if (isLoading) {
    return (
      <section className="relative bg-card py-16 md:py-24 overflow-hidden border-y-8 border-foreground/10">
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, currentColor 1.5px, transparent 1.5px)",
            backgroundSize: "20px 20px",
          }}
        />
        <div className="container relative z-10 mx-auto px-4">
          <div className="flex h-64 items-center justify-center bg-background border-4 border-foreground shadow-[8px_8px_0px_0px_hsl(var(--foreground))]">
            <div className="relative">
              <Loader2 className="h-10 w-10 animate-spin text-primary relative z-10" strokeWidth={3} />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!post) {
    return (
      <section className="relative py-16 md:py-24 overflow-hidden border-y-8 border-foreground">
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, black 1.5px, transparent 1.5px)",
            backgroundSize: "20px 20px",
          }}
        />
        <div className="container relative z-10 mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10 flex items-center gap-4"
          >
            <div className="relative">
              <svg className="absolute -inset-6 w-[calc(100%+48px)] h-[calc(100%+48px)] text-primary -z-10" viewBox="0 0 100 100">
                <path d="M50 0 L58 38 L95 30 L65 55 L85 90 L50 68 L15 90 L35 55 L5 30 L42 38Z" fill="currentColor" stroke="black" strokeWidth="2"/>
              </svg>
              <div className="bg-accent border-4 border-foreground px-5 py-2 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] flex items-center gap-3">
                <TrendingUp size={28} className="text-white" strokeWidth={3} />
                <h2 className="font-bangers text-4xl text-white tracking-wide md:text-5xl"
                  style={{ 
                    textShadow: '3px 3px 0px rgba(0,0,0,0.3)',
                    WebkitTextStroke: '1px black'
                  }}
                >
                  TODAY&lsquo;S MOST READ
                </h2>
              </div>
            </div>
            <div className="h-1 flex-1 bg-black shadow-[3px_3px_0px_0px_rgba(0,0,0,0.2)]" />
          </motion.div>
          
          <div className="flex min-h-[300px] flex-col items-center justify-center bg-card border-4 border-foreground p-8 text-center shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] relative">
            <div className="absolute -top-4 -right-4 bg-primary border-4 border-foreground px-4 py-2 font-bangers text-xl text-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rotate-12">
              EMPTY!
            </div>
            <div className="mb-6 text-7xl animate-bounce">📚</div>
            <h3 className="mb-3 font-bangers text-4xl text-foreground" style={{ WebkitTextStroke: '1px black' }}>
              No Reader Activity Yet!
            </h3>
            <p className="max-w-md font-oswald text-base text-gray-500 sm:text-xl uppercase tracking-wider">
              Be the first to break the charts! Check out our latest issues and start reading.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-16 md:py-24 overflow-hidden border-y-8 border-foreground/10">
      {/* ── Halftone Background ── */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, currentColor 1.5px, transparent 1.5px)",
          backgroundSize: "20px 20px",
        }}
      />

      {/* ── Floating Sound Effects ── */}
      <div className="absolute top-20 left-[8%] bg-primary border-3 border-foreground px-3 py-1 font-bangers text-sm text-foreground shadow-[3px_3px_0px_0px_hsl(var(--foreground))] -rotate-12 pointer-events-none hidden lg:block">
        WOW!
      </div>
      <div className="absolute bottom-24 right-[10%] bg-primary border-3 border-foreground px-3 py-1 font-bangers text-sm text-white shadow-[3px_3px_0px_0px_hsl(var(--foreground))] rotate-12 pointer-events-none hidden lg:block">
        #1 HIT!
      </div>

      <div className="container relative z-10 mx-auto px-4">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 200 }}
          className="mb-10 flex items-center gap-4"
        >
          <div className="relative">
            <div className="bg-accent border-4 border-foreground px-5 py-2 shadow-[5px_5px_0px_0px_hsl(var(--foreground))] flex items-center gap-3">
              <TrendingUp size={28} className="text-white" strokeWidth={3} />
              <h2 className="font-bangers text-4xl text-white tracking-wide md:text-5xl"
                style={{ 
                  textShadow: '3px 3px 0px hsl(var(--primary))',
                  WebkitTextStroke: '1px black'
                }}
              >
                TODAY&lsquo;S MOST READ
              </h2>
            </div>
          </div>
          <div className="h-1 flex-1 bg-foreground/10 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.05)]" />
          <div className="hidden sm:flex items-center gap-2 bg-primary border-3 border-foreground px-4 py-2 shadow-[4px_4px_0px_0px_hsl(var(--foreground))] -rotate-2">
            <Star size={18} className="text-white fill-white" />
            <span className="font-bangers text-lg text-white">TOP CHART</span>
          </div>
        </motion.div>

        <motion.article
          initial={{ opacity: 0, y: 40, rotate: -1 }}
          whileInView={{ opacity: 1, y: 0, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
          className="group relative"
        >
          {/* Crown Badge */}
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-30">
            <svg className="w-20 h-12 text-primary drop-shadow-[3px_3px_0px_rgba(0,0,0,1)]" viewBox="0 0 80 50">
              <path d="M40 5 L50 20 L65 15 L55 35 L70 40 L40 48 L10 40 L25 35 L15 15 L30 20Z" fill="currentColor" stroke="black" strokeWidth="2"/>
              <text x="40" y="32" textAnchor="middle" className="font-bangers text-[14px] fill-black" style={{ fontFamily: 'Bangers' }}>#1</text>
            </svg>
          </div>

          <div className="flex flex-col overflow-hidden bg-card border-4 border-foreground shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 group-hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] md:flex-row">
            {/* Inner dashed border */}
            <div className="absolute inset-3 border-2 border-dashed border-gray-200 pointer-events-none z-20 hidden md:block"/>
            
            {/* Image Side */}
            <Link href={`/posts/${post.slug}`} className="relative aspect-video min-h-60 overflow-hidden bg-linear-to-br from-violet-900 via-purple-700 to-pink-600 md:w-2/5 md:aspect-auto border-b-4 md:border-b-0 md:border-r-4 border-foreground">
              {thumbnailUrl ? (
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url("${thumbnailUrl}")` }}
                />
              ) : (
                <div className="absolute inset-0 bg-linear-to-br from-violet-900 via-purple-700 to-pink-600">
                  <div className="absolute inset-0 opacity-30" style={{
                    backgroundImage: "radial-gradient(circle, white 1.5px, transparent 1.5px)",
                    backgroundSize: "10px 10px",
                  }}/>
                </div>
              )}
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />
              
              {!post.thumbnailUrl && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{ scale: [1, 1.08, 1] }}
                    transition={{
                      duration: 4,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                    className="flex h-24 w-24 items-center justify-center border-4 border-white/60 md:h-36 md:w-36 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]"
                    style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
                  >
                    <Eye size={40} className="text-white" strokeWidth={2.5} />
                  </motion.div>
                </div>
              )}

              {/* Views Badge on Image */}
              <div className="absolute bottom-4 left-4 z-20 bg-black border-3 border-white px-4 py-2 font-bangers text-lg text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,0.5)] flex items-center gap-2">
                <Eye size={18} className="text-primary" />
                {(post.viewCount || 0).toLocaleString()} VIEWS
              </div>

              {/* Sound Effect */}
              <div className="absolute top-4 right-4 bg-primary border-3 border-foreground px-3 py-1 font-bangers text-sm text-foreground shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] rotate-12 z-20">
                HOT!
              </div>
            </Link>

            {/* Content Side */}
            <div className="flex flex-1 flex-col justify-center p-6 md:p-10 relative">
              {/* Corner accent */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-primary border-l-4 border-b-4 border-foreground hidden md:block"/>
              
              {/* Author Row */}
              <div className="mb-5 flex flex-wrap items-center gap-x-6 gap-y-3">
                <Link href={`/users/${post.author.username}`} className="group/author flex items-center gap-3">
                  <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden border-3 border-foreground bg-accent shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform group-hover/author:scale-110 group-hover/author:rotate-3"
                    style={{ clipPath: 'polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)' }}
                  >
                    {(() => {
                      const profileImageUrl = getRenderableImageUrl(post.author.profileImage);
                      return profileImageUrl ? (
                        <Image
                          src={profileImageUrl}
                          alt={post.author.fullName}
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      ) : (
                        <span className="font-bangers text-lg text-white drop-shadow-md">
                          {post.author.fullName.charAt(0)}
                        </span>
                      );
                    })()}
                  </div>
                  <div>
                    <div className="font-bangers text-xl leading-tight text-foreground transition-colors group-hover/author:text-primary tracking-wide">
                      {post.author.fullName}
                    </div>
                    <div className="font-oswald text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1">
                      <Clock size={12} /> {formatPublishedDate(post.publishedAt || post.createdAt)}
                    </div>
                  </div>
                </Link>
                
                <div className="h-10 w-px bg-black hidden sm:block"/>
                
                <div className="flex flex-wrap gap-3">
                  {post.category && (
                    <span className="bg-primary border-3 border-foreground px-4 py-1 font-bangers text-sm text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                      {post.category.name}
                    </span>
                  )}
                  <span className="flex items-center gap-2 bg-muted border-2 border-foreground px-3 py-1 font-oswald text-sm font-bold uppercase text-foreground shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)]">
                    <Clock size={14} strokeWidth={2.5} /> {estimateReadMinutes(post.content)} MIN
                  </span>
                </div>
              </div>

              {/* Title */}
              <Link href={`/posts/${post.slug}`}>
                <h3 className="mb-5 font-bangers text-3xl leading-tight text-foreground transition-colors group-hover:text-primary sm:text-4xl md:text-5xl lg:text-6xl line-clamp-2"
                  style={{ 
                    textShadow: '3px 3px 0px rgba(0,0,0,0.05)',
                    WebkitTextStroke: '1px black'
                  }}
                >
                  {post.title}
                </h3>
              </Link>

              {/* Excerpt */}
              <p className="mb-8 max-w-2xl font-sans text-base text-gray-600 sm:text-lg line-clamp-3"
                style={{ fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif' }}
              >
                {stripHtml(post.content).slice(0, 180)}...
              </p>

              {/* CTA Button */}
              <Link href={`/posts/${post.slug}`} className="group/link inline-flex items-center gap-3 bg-accent border-4 border-foreground px-8 py-4 font-bangers text-xl text-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-primary w-fit">
                CONTINUE READING 
                <ArrowRight size={22} strokeWidth={3} className="transition-transform group-hover/link:translate-x-2" />
              </Link>
            </div>
          </div>
        </motion.article>
      </div>
    </section>
  );
}
