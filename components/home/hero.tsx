"use client";

import { motion } from "framer-motion";
import { ArrowRight, Heart, Zap, Star, Skull, Flame } from "lucide-react";
import Link from "next/link";
import { useGetMostLikedPostsQuery } from "@/lib/services/auth-api";
import { getRenderableImageUrl } from "@/lib/utils/image-url";
import {
  stripHtml,
  formatPublishedDate,
  estimateReadMinutes,
} from "@/lib/utils/blog";

// ─── Raw Comic Components ──────────────────────────────────────

function ThickBorder({ children, className = "", color = "foreground" }: { 
  children: React.ReactNode; 
  className?: string;
  color?: string;
}) {
  return (
    <div 
      className={`border-[4px] border-${color} ${className}`}
      style={{ boxShadow: "6px 6px 0px 0px hsl(var(--foreground))" }}
    >
      {children}
    </div>
  );
}

function BenDayDots({ className = "", color = "var(--foreground)", size = 6 }: {
  className?: string;
  color?: string;
  size?: number;
}) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 opacity-[0.12] ${className}`}
      style={{
        backgroundImage: `radial-gradient(circle, ${color} 2px, transparent 2px)`,
        backgroundSize: `${size}px ${size}px`,
      }}
    />
  );
}

function ComicStarburst({ text, className = "", bg = "accent" }: {
  text: string;
  className?: string;
  bg?: string;
}) {
  return (
    <div className={`relative inline-block ${className}`}>
      <svg viewBox="0 0 100 100" className="absolute inset-0 -z-10 h-full w-full">
        {[...Array(16)].map((_, i) => (
          <polygon
            key={i}
            points="50,50 52,0 48,0"
            fill={`hsl(var(--${bg}))`}
            transform={`rotate(${i * 22.5} 50 50)`}
          />
        ))}
      </svg>
      <span className="relative z-10 block px-4 py-2 font-bangers text-lg uppercase">
        {text}
      </span>
    </div>
  );
}

function JaggedEdge({ position = "top", color = "hsl(var(--foreground))" }: {
  position?: "top" | "bottom";
  color?: string;
}) {
  const points = position === "top" 
    ? "0,10 5,0 10,10 15,0 20,10 25,0 30,10 35,0 40,10 45,0 50,10 55,0 60,10 65,0 70,10 75,0 80,10 85,0 90,10 95,0 100,10 100,12 0,12"
    : "0,0 100,0 100,2 95,12 90,2 85,12 80,2 75,12 70,2 65,12 60,2 55,12 50,2 45,12 40,2 35,12 30,2 25,12 20,2 15,12 10,2 5,12 0,2";
  
  return (
    <svg 
      className={`absolute left-0 w-full h-3 ${position === "top" ? "-top-3" : "-bottom-3"}`}
      viewBox="0 0 100 12" 
      preserveAspectRatio="none"
    >
      <polygon points={points} fill={color} />
    </svg>
  );
}

function SoundFX({ text, className = "" }: { text: string; className?: string }) {
  return (
    <div 
      className={`font-bangers text-3xl uppercase leading-none ${className}`}
      style={{
        WebkitTextStroke: "2px hsl(var(--foreground))",
        textShadow: "3px 3px 0px hsl(var(--foreground))",
      }}
    >
      {text}
    </div>
  );
}

// ─── Main Hero ─────────────────────────────────────────────────

export function Hero() {
  const { data: posts = [], isLoading, isError } = useGetMostLikedPostsQuery({
    page: 0,
    size: 1,
  });
  const featuredPost = posts[0];
  const featuredThumbnailUrl = getRenderableImageUrl(featuredPost?.thumbnailUrl);
  const cleanedContent = featuredPost ? stripHtml(featuredPost.content) : "";
  const excerpt = cleanedContent ? cleanedContent.slice(0, 140) : "";
  const needsEllipsis = cleanedContent.length > 140;

  return (
    <section className="relative overflow-hidden bg-background py-6 md:py-10">
      {/* Top Bar — Raw, brutalist */}
      <div className="container mx-auto px-4 mb-6">
        <div className="flex items-center justify-between border-b-[4px] border-foreground pb-3">
          <div className="flex items-center gap-2 font-bangers text-xl uppercase">
            <Skull className="h-5 w-5" />
            <span>Blog Comics</span>
            <span className="text-muted-foreground">#{new Date().getFullYear()}</span>
          </div>
          <div className="hidden sm:flex items-center gap-1 font-oswald text-sm uppercase tracking-widest">
            <span>Vol. 1</span>
            <Flame className="h-4 w-4 text-accent" />
            <span>Issue 1</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Main Panel — Thick brutalist border */}
        <ThickBorder className="relative bg-card">
          <BenDayDots size={8} />
          
          {/* Corner tape effect */}
          <div className="absolute -left-2 -top-2 h-8 w-16 -rotate-45 bg-primary opacity-80 border-2 border-foreground z-20" />
          <div className="absolute -right-2 -bottom-2 h-8 w-16 -rotate-45 bg-accent opacity-80 border-2 border-foreground z-20" />

          <div className="relative z-10 flex flex-col gap-6 p-4 md:p-6 lg:flex-row lg:gap-8">
            
            {/* ─── LEFT: Text Content ─── */}
            <div className="flex-1 space-y-5">
              
              {/* Badge */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
              >
                <ComicStarburst text="Daily Issue" bg="primary" className="text-primary-foreground" />
              </motion.div>

              {isLoading ? (
                <div className="space-y-4">
                  <div className="h-28 bg-primary/20 border-[3px] border-foreground lg:h-36" />
                  <div className="h-20 bg-muted border-[3px] border-foreground" />
                </div>
              ) : isError || !featuredPost ? (
                <div className="space-y-4">
                  <h1 
                    className="font-bangers text-5xl uppercase leading-[0.85] sm:text-6xl lg:text-7xl"
                    style={{ textShadow: "4px 4px 0px hsl(var(--secondary))" }}
                  >
                    Story <span className="text-accent">Offline!</span>
                  </h1>
                  <ThickBorder color="muted" className="max-w-lg bg-background p-4">
                    <p className="font-oswald text-lg">
                      Couldn&apos;t load the top story. Check your connection and try again, true believer!
                    </p>
                  </ThickBorder>
                </div>
              ) : (
                <div className="space-y-5">
                  {/* Title — Big, brutal, stacked shadows */}
                  <motion.h1
                    initial={{ x: -30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="font-bangers line-clamp-3 text-5xl uppercase leading-[0.82] text-foreground sm:text-6xl lg:line-clamp-2 lg:text-[4.5rem] xl:text-[5.5rem]"
                    style={{
                      textShadow: `
                        4px 4px 0px hsl(var(--primary)),
                        8px 8px 0px hsl(var(--accent))
                      `,
                    }}
                  >
                    {featuredPost.title}
                  </motion.h1>

                  {/* Meta — Underline strip style */}
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-wrap items-center gap-x-3 gap-y-1 border-y-[3px] border-foreground py-2 font-oswald text-sm uppercase tracking-wide"
                  >
                    <span className="font-bold">{featuredPost.author.fullName}</span>
                    <span className="text-accent">◆</span>
                    <span className="text-muted-foreground">
                      {formatPublishedDate(featuredPost.publishedAt ?? featuredPost.createdAt)}
                    </span>
                    <span className="text-accent">◆</span>
                    <span>{estimateReadMinutes(featuredPost.content)} min</span>
                    <span className="text-accent">◆</span>
                    <span className="flex items-center gap-1 font-bold text-accent">
                      <Heart className="h-3.5 w-3.5 fill-current" />
                      {featuredPost.likeCount}
                    </span>
                  </motion.div>

                  {/* Excerpt — Speech bubble with jagged edges */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="relative"
                  >
                    <ThickBorder color="background" className="relative bg-background">
                      <JaggedEdge position="top" />
                      <JaggedEdge position="bottom" />
                      <div className="p-4 sm:p-5">
                        <p className="font-oswald text-lg leading-relaxed text-foreground sm:text-xl">
                          <span className="text-4xl text-accent font-bangers">&quot;</span>
                          {excerpt}
                          {needsEllipsis ? "..." : ""}
                          <span className="text-4xl text-accent font-bangers">&quot;</span>
                        </p>
                      </div>
                      {/* Speech tail */}
                      <div 
                        className="absolute -bottom-4 left-8 h-4 w-4 rotate-45 border-r-[3px] border-b-[3px] border-foreground bg-background"
                      />
                    </ThickBorder>
                  </motion.div>

                  {/* CTA — Big, chunky, raw */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="pt-2"
                  >
                    <Link
                      href={`/posts/${featuredPost.slug}`}
                      className="group inline-flex items-center gap-3 bg-accent px-6 py-4 font-bangers text-xl uppercase text-accent-foreground border-[4px] border-foreground transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none active:translate-x-[6px] active:translate-y-[6px]"
                      style={{ boxShadow: "6px 6px 0px 0px hsl(var(--foreground))" }}
                    >
                      <Zap className="h-5 w-5 fill-current" />
                      Read Full Strip
                      <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </motion.div>
                </div>
              )}
            </div>

            {/* ─── RIGHT: Image Panel ─── */}
            <div className="w-full flex-1">
              <ThickBorder color="accent" className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/80 to-accent">
                <BenDayDots size={10} color="#fff" />
                
                {featuredThumbnailUrl ? (
                  <>
                    <div
                      className="aspect-square w-full bg-cover bg-center lg:aspect-[4/3]"
                      style={{ backgroundImage: `url("${featuredThumbnailUrl}")` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
                  </>
                ) : (
                  <div className="flex aspect-square items-center justify-center lg:aspect-[4/3]">
                    <div className="h-24 w-24 animate-pulse rounded-full bg-accent/50 blur-2xl lg:h-40 lg:w-40" />
                  </div>
                )}

                {/* Category badge — tilted, raw */}
                {featuredPost?.category && (
                  <div className="absolute left-4 top-4 z-20 -rotate-3 bg-accent px-4 py-1.5 font-bangers text-base uppercase text-accent-foreground border-[3px] border-foreground">
                    {featuredPost.category.name}
                  </div>
                )}

                {/* Floating sound effects */}
                <SoundFX 
                  text="POW!" 
                  className="absolute right-4 top-8 text-primary rotate-12" 
                />
                <SoundFX 
                  text="BAM!" 
                  className="absolute bottom-16 left-4 text-primary -rotate-6" 
                />

                {/* Inner frame */}
                <div className="pointer-events-none absolute inset-3 border-[2px] border-dashed border-background/40" />
              </ThickBorder>
            </div>
          </div>

          {/* Bottom bar — "To be continued" */}
          <div className="relative z-10 flex items-center justify-between border-t-[4px] border-foreground bg-muted px-4 py-3 md:px-6">
            <span className="font-bangers text-sm uppercase tracking-widest text-muted-foreground">
              To Be Continued...
            </span>
            <div className="flex gap-2">
              <Star className="h-4 w-4 fill-foreground text-foreground" />
              <Star className="h-4 w-4 fill-foreground text-foreground" />
              <Star className="h-4 w-4 text-foreground" />
            </div>
          </div>
        </ThickBorder>
      </div>
    </section>
  );
}
