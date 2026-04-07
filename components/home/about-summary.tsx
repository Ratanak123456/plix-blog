"use client";

import { motion } from "framer-motion";
import { ArrowRight, Users } from "lucide-react";
import Link from "next/link";

export function AboutSummary() {
  return (
    <section className="border-y-4 border-secondary bg-muted/20 py-14">
      <div className="container mx-auto px-4 flex flex-col gap-10 lg:flex-row lg:items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex-1 space-y-6"
        >
          <div className="inline-block bg-accent px-4 py-1 font-oswald text-xs font-bold uppercase tracking-[0.2em] text-background comic-border-secondary shadow-sm">
            The Origin Story
          </div>
          <h2 className="font-bangers text-5xl text-primary md:text-6xl drop-shadow-lg">
            WHO WE ARE
          </h2>
          <div className="space-y-4 font-sans text-lg text-muted-foreground">
            <p>
              PlixBlog isn&apos;t just another tech site. We are a collective of developers, 
              designers, and storytellers who believe that technology is the most 
              exciting narrative of our time.
            </p>
            <p>
              We cover the digital frontier through a unique comic-inspired lens, 
              turning complex technical deep-dives into engaging visual experiences. 
              From the first line of code to the final deployment, we track the arcs 
              that shape our world.
            </p>
          </div>
          <div className="pt-4">
            <Link
              href="/about"
              className="group inline-flex items-center gap-2 font-bangers text-2xl text-accent transition-all hover:text-primary"
            >
              MEET THE HEROES <ArrowRight size={22} className="transition-transform group-hover:translate-x-2" />
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative flex-1"
        >
          <div className="relative z-10 aspect-video overflow-hidden bg-card p-8 text-center comic-border shadow-2xl">
            <div className="flex h-full flex-col items-center justify-center gap-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Users size={40} />
              </div>
              <p className="font-bangers text-3xl leading-tight">
                &quot;Tech journalism with a soul. Every story has a face, and 
                every face has a mission.&quot;
              </p>
              <div className="h-1 w-20 bg-accent rounded-full" />
            </div>
          </div>
          {/* Decorative background shape */}
          <div className="absolute inset-0 -z-10 translate-x-4 translate-y-4 bg-secondary opacity-20 comic-border" />
        </motion.div>
      </div>
    </section>
  );
}
