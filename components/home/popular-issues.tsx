"use client";

import { useGetMostLikedPostsQuery } from "@/lib/services/auth-api";
import { BlogCard } from "@/components/blog/blog-card";
import { Loader2, Zap, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export function PopularIssues() {
  const { data: posts = [], isLoading } = useGetMostLikedPostsQuery({ page: 0, size: 4 });

  if (isLoading) {
    return (
      <section className="relative py-16 border-y-4 border-foreground">
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, black 1.5px, transparent 1.5px)",
            backgroundSize: "20px 20px",
          }}
        />
        <div className="flex h-48 items-center justify-center relative z-10">
          <div className="relative">
            <Loader2 className="h-12 w-12 animate-spin text-primary relative z-10" strokeWidth={3} />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-16 md:py-24 overflow-hidden border-y-8 border-foreground">
      {/* ── Halftone Background ── */}
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

      {/* ── Floating Sound Effects ── */}
      <div className="absolute top-12 left-[10%] bg-primary border-3 border-foreground px-3 py-1 font-bangers text-sm text-foreground shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] -rotate-12 pointer-events-none hidden lg:block">
        POW!
      </div>
      <div className="absolute bottom-16 right-[15%] bg-accent border-3 border-foreground px-3 py-1 font-bangers text-sm text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] rotate-12 pointer-events-none hidden lg:block">
        ZAP!
      </div>

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
            <div className="bg-primary border-4 border-foreground px-4 py-2 shadow-[5px_5px_0px_0px_hsl(var(--foreground))] flex items-center gap-3">
              <TrendingUp size={28} className="text-white" strokeWidth={3} />
              <h2 className="font-bangers text-4xl text-white tracking-wide md:text-5xl"
                style={{ 
                  textShadow: '3px 3px 0px hsl(var(--accent))',
                  WebkitTextStroke: '1px black'
                }}
              >
                POPULAR ISSUES
              </h2>
            </div>
          </div>
          <div className="h-[4px] flex-1 bg-black shadow-[3px_3px_0px_0px_rgba(0,0,0,0.2)]" />
          <div className="hidden sm:flex items-center gap-2 bg-accent border-3 border-foreground px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -rotate-2">
            <Zap size={18} className="text-white fill-white" />
            <span className="font-bangers text-lg text-white">TOP PICKS</span>
          </div>
        </motion.div>
        
        {/* Grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30, rotate: index % 2 === 0 ? -2 : 2 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.12, type: "spring", stiffness: 150, damping: 15 }}
            >
              <BlogCard post={post} index={index} />
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-14 flex justify-center"
        >
          <Link href="/blog" className="group relative cursor-pointer">
            <div className="bg-card border-4 border-foreground px-8 py-4 font-bangers text-2xl text-foreground shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rotate-1 group-hover:rotate-0 transition-all duration-200 flex items-center gap-3 hover:bg-primary hover:text-white">
              <span>VIEW ALL ISSUES</span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}