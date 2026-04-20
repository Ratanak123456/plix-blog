"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { AboutCard } from "./about-card";

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
          <h2 className="font-bangers text-4xl text-primary sm:text-5xl md:text-6xl drop-shadow-lg">
            WHO WE ARE
          </h2>
          <div className="space-y-4 font-sans text-base text-muted-foreground sm:text-lg">
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
              className="group inline-flex items-center gap-2 font-bangers text-xl text-accent transition-all hover:text-primary sm:text-2xl"
            >
              MEET THE HEROES <ArrowRight size={22} className="transition-transform group-hover:translate-x-2" />
            </Link>
          </div>
        </motion.div>

        <AboutCard />
      </div>
    </section>
  );
}
