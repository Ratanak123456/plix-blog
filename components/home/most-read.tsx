"use client";

import { motion } from "framer-motion";
import { ArrowRight, Clock, Eye, TrendingUp } from "lucide-react";

export function MostRead() {
  return (
    <section className="container mx-auto px-4 py-10">
      <div className="mb-6 flex items-center gap-4">
        <TrendingUp size={28} className="shrink-0 text-accent" />
        <h2 className="whitespace-nowrap font-bangers text-4xl text-primary md:text-5xl">
          TODAY&apos;S MOST READ
        </h2>
        <div className="h-1 flex-1 bg-secondary" />
      </div>
      <motion.article
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="group cursor-pointer"
      >
        <div className="flex flex-col overflow-hidden bg-card transition-colors hover:border-accent md:flex-row comic-border">
          <div className="relative aspect-video min-h-[240px] overflow-hidden bg-gradient-to-br from-violet-900 via-purple-700 to-accent/70 md:w-2/5 md:aspect-auto">
            <div className="absolute inset-0 opacity-30 halftone-bg" />
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{ scale: [1, 1.08, 1] }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
                className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-primary/60 md:h-36 md:w-36"
              >
                <Eye size={40} className="text-primary/80" />
              </motion.div>
            </div>
            <div className="absolute top-4 left-4 bg-accent px-3 py-1 font-bangers text-lg text-background comic-border-secondary">
              #1 TODAY
            </div>
          </div>
          <div className="flex flex-1 flex-col justify-center p-6 md:p-10">
            <div className="mb-4 flex flex-wrap items-center gap-x-6 gap-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent font-bangers text-sm text-background">
                  JM
                </div>
                <div>
                  <div className="font-bangers text-lg leading-tight">Jules Mercer</div>
                  <div className="font-oswald text-xs uppercase tracking-wider text-muted-foreground">APR 07, 2026</div>
                </div>
              </div>
              <div className="h-8 w-px bg-border hidden sm:block" />
              <div className="flex flex-wrap gap-3">
                <span className="bg-secondary px-3 py-1 font-oswald text-sm uppercase text-background comic-border-accent">
                  Exclusive
                </span>
                <span className="flex items-center gap-1 py-1 font-oswald text-sm text-muted-foreground">
                  <Clock size={14} /> 11 MIN READ
                </span>
                <span className="flex items-center gap-1 py-1 font-oswald text-sm text-accent">
                  <Eye size={14} /> 48.2k views
                </span>
              </div>
            </div>
            <h3 className="mb-4 font-bangers text-4xl leading-tight transition-colors group-hover:text-accent md:text-6xl">
              The Algorithm That Broke Democracy
            </h3>
            <p className="mb-6 max-w-2xl font-sans text-lg text-muted-foreground">
              A whistleblower inside a major social platform reveals how a
              single recommendation model rewired political discourse across
              40 countries — and why it was never shut down.
            </p>
            <a
              href="#"
              className="inline-flex items-center gap-2 font-bangers text-xl text-accent transition-colors hover:text-primary"
            >
              CONTINUE READING <ArrowRight size={20} />
            </a>
          </div>
        </div>
      </motion.article>
    </section>
  );
}
