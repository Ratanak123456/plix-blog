"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="container mx-auto px-4 py-12 md:py-16">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden bg-card p-4 md:p-8 comic-border halftone-bg"
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20" />
        <div className="relative z-10 flex flex-col items-center gap-8 md:flex-row">
          <div className="flex-1 space-y-5">
            <div className="inline-block -rotate-2 bg-primary px-4 py-1 font-bangers text-xl text-background comic-border-secondary">
              DAILY ISSUE #402
            </div>
            <h1 className="font-bangers text-6xl leading-none uppercase drop-shadow-[4px_4px_0px_hsl(var(--secondary))] md:text-8xl">
              The Silicon <br />
              <span className="text-accent">Awakening</span>
            </h1>
            <div className="inline-block max-w-lg p-4 font-oswald text-xl text-foreground md:p-5 speech-bubble">
              &quot;AI chips are eating the world — and we&apos;ve got the
              full origin story inside.&quot;
            </div>
            <div className="pt-4">
              <a
                href="#"
                className="inline-flex items-center gap-3 bg-accent px-8 py-4 font-bangers text-2xl text-background transition-all hover:-translate-y-2 hover:rotate-1 hover:shadow-lg comic-border"
              >
                READ THE FULL STRIP <ArrowRight size={22} />
              </a>
            </div>
          </div>
          <div className="w-full flex-1">
            <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden bg-gradient-to-tr from-indigo-900 via-primary/50 to-accent comic-border-accent md:aspect-[4/3]">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 20,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
                className="flex h-32 w-32 items-center justify-center rounded-lg border-[8px] border-background/50 md:h-64 md:w-64"
              >
                <div className="h-16 w-16 rounded-full bg-accent/80 blur-xl md:h-32 md:w-32" />
              </motion.div>
              <div className="pointer-events-none absolute inset-0 z-10 border-[16px] border-card/20" />
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
