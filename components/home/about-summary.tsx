"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { AboutCard } from "./about-card";

export function AboutSummary() {
  return (
    <section className="relative border-y-8 border-foreground/10 dark:border-primary/30 py-16 md:py-24 overflow-hidden bg-background transition-colors duration-300">
      {/* ── Halftone Background ── */}
      <div
        className="absolute inset-0 opacity-[0.06] dark:opacity-[0.1] pointer-events-none text-foreground"
        style={{
          backgroundImage: "radial-gradient(circle, currentColor 1.5px, transparent 1.5px)",
          backgroundSize: "22px 22px",
        }}
      />

      <div className="container relative z-10 mx-auto px-4 flex flex-col gap-12 lg:flex-row lg:items-center">
        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -50, rotate: -2 }}
          whileInView={{ opacity: 1, x: 0, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
          className="flex-1 space-y-8"
        >
          {/* Origin Story Badge */}
          <div className="relative inline-block">
            <svg
              className="absolute -inset-4 w-[calc(100%+32px)] h-[calc(100%+32px)] text-primary dark:text-primary -z-10"
              viewBox="0 0 100 100"
            >
              <path
                d="M50 0 L58 38 L95 30 L65 55 L85 90 L50 68 L15 90 L35 55 L5 30 L42 38Z"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
            <span className="relative inline-block bg-accent px-5 py-2 font-oswald text-xs font-bold uppercase tracking-[0.25em] text-white border-3 border-foreground shadow-[3px_3px_0px_0px_hsl(var(--foreground))]">
              The Origin Story
            </span>
          </div>

          {/* Title with Comic Effects */}
          <div className="relative">
            <h2
              className="font-bangers text-5xl text-foreground sm:text-6xl md:text-7xl tracking-wide relative inline-block"
              style={{
                textShadow: "5px 5px 0px hsl(var(--primary)), 10px 10px 0px hsl(var(--accent))",
                WebkitTextStroke: "2px hsl(var(--foreground))",
                lineHeight: 1.1,
              }}
            >
              WHO WE ARE
            </h2>
            {/* Underline burst */}
            <svg
              className="absolute -bottom-4 left-0 w-full h-6 text-primary opacity-80"
              viewBox="0 0 200 20"
              preserveAspectRatio="none"
            >
              <path
                d="M0 10 L20 2 L40 10 L60 2 L80 10 L100 2 L120 10 L140 2 L160 10 L180 2 L200 10"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
              />
            </svg>
          </div>

          {/* Comic Panel Text Box */}
          <div className="relative bg-card border-4 border-foreground dark:border-primary p-6 sm:p-8 shadow-[8px_8px_0px_0px_hsl(var(--foreground))] dark:shadow-[8px_8px_0px_0px_var(--color-primary)]">
            {/* Inner dashed border */}
            <div className="absolute inset-2 border-2 border-dashed border-foreground/10 pointer-events-none" />

            <div
              className="space-y-5 font-sans text-base text-muted-foreground sm:text-lg relative z-10"
              style={{ fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif' }}
            >
              <p className="relative pl-6">
                <span className="absolute left-0 top-0 font-bangers text-3xl text-primary opacity-40 leading-none">
                  &quot;
                </span>
                PlixBlog isn&apos;t just another tech site. We are a collective of developers, designers, and
                storytellers who believe that technology is the most exciting narrative of our time.
              </p>
              <p className="relative pl-6">
                <span className="absolute left-0 top-0 font-bangers text-3xl text-primary opacity-40 leading-none">
                  &quot;
                </span>
                We cover the digital frontier through a unique comic-inspired lens, turning complex technical
                deep-dives into engaging visual experiences. From the first line of code to the final deployment, we
                track the arcs that shape our world.
              </p>
            </div>

            {/* Comic corner accents */}
            <div className="absolute -top-3 -left-3 w-6 h-6 bg-primary border-3 border-foreground" />
            <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-accent border-3 border-foreground" />
          </div>

          {/* CTA Button - Comic Style */}
          <div className="pt-2">
            <Link
              href="/about"
              className="group inline-flex items-center gap-3 bg-primary px-8 py-4 font-bangers text-xl text-white border-4 border-foreground shadow-[6px_6px_0px_0px_hsl(var(--accent))] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[4px_4px_0px_0px_hsl(var(--foreground))] hover:bg-foreground hover:text-background sm:text-2xl"
            >
              MEET THE HEROES
              <ArrowRight size={24} strokeWidth={3} className="transition-transform group-hover:translate-x-3" />
            </Link>
          </div>
        </motion.div>

        {/* About Card - Wrapped in Comic Frame */}
        <motion.div
          initial={{ opacity: 0, x: 50, rotate: 3 }}
          whileInView={{ opacity: 1, x: 0, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2, type: "spring", stiffness: 100 }}
          className="relative flex-1 w-full max-w-2xl mx-auto"
        >
          {/* Decorative frame around AboutCard */}
          <div className="relative bg-card border-4 border-foreground dark:border-primary p-3 shadow-[10px_10px_0px_0px_hsl(var(--foreground))] dark:shadow-[10px_10px_0px_0px_var(--color-primary)] rotate-1 hover:rotate-0 transition-transform duration-300">
            <div className="border-2 border-dashed border-foreground/10 p-2">
              <AboutCard />
            </div>

            {/* Comic caption */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-primary dark:bg-primary border-3 border-foreground px-4 py-1 font-bangers text-sm text-foreground shadow-[3px_3px_0px_0px_hsl(var(--foreground))] whitespace-nowrap">
              THE TEAM!
            </div>
          </div>

          {/* Floating sound effect */}
          <div className="absolute -top-4 -right-4 bg-accent border-3 border-foreground px-3 py-1 font-bangers text-lg text-white shadow-[3px_3px_0px_0px_hsl(var(--foreground))] rotate-12 z-20">
            POW!
          </div>
        </motion.div>
      </div>
    </section>
  );
}
