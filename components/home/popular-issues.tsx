"use client";

import { motion } from "framer-motion";
import { Clock } from "lucide-react";

const POPULAR_ISSUES = [
  {
    title: "The Death of the Passcode",
    cat: "CYBER",
    time: "4 MIN",
    color: "from-slate-700 to-slate-900",
    author: "Mina Hart",
    date: "APR 05, 2026",
    avatar: "MH",
  },
  {
    title: "Review: The Neural-Link Headset",
    cat: "GADGETS",
    time: "9 MIN",
    color: "from-amber-600 to-orange-900",
    author: "Ari Sol",
    date: "APR 03, 2026",
    avatar: "AS",
  },
  {
    title: "Hollywood's AI Writer Strike",
    cat: "ENTERTAIN",
    time: "7 MIN",
    color: "from-pink-800 to-rose-600",
    author: "Jules Mercer",
    date: "APR 01, 2026",
    avatar: "JM",
  },
  {
    title: "Open Source vs Big Tech: Round 2",
    cat: "CODE",
    time: "6 MIN",
    color: "from-teal-800 to-cyan-600",
    author: "Mina Hart",
    date: "MAR 30, 2026",
    avatar: "MH",
  },
];

export function PopularIssues() {
  return (
    <section id="blog" className="container mx-auto px-4 py-10 ">
      <div className="mb-8 flex items-center gap-4">
        <h2 className="whitespace-nowrap font-bangers text-4xl text-primary md:text-5xl">
          POPULAR ISSUES
        </h2>
        <div className="h-1 flex-1 bg-secondary" />
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {POPULAR_ISSUES.map((post, index) => (
          <motion.article
            key={post.title}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="flex cursor-pointer flex-col group"
          >
            <div
              className={`relative mb-4 aspect-[3/2] w-full overflow-hidden bg-gradient-to-br ${post.color} comic-border`}
            >
              <div className="absolute inset-0 opacity-20 halftone-bg" />
              <div className="absolute top-3 left-3 rotate-[-2deg] bg-accent px-2 py-0.5 font-bangers text-sm text-background transition-transform group-hover:rotate-0 comic-border-secondary">
                {post.cat}
              </div>
            </div>
            <div className="mb-2 flex items-center justify-between font-oswald text-xs font-bold uppercase text-primary">
              <div className="flex items-center gap-2">
                <Clock size={12} /> {post.time} READ
              </div>
              <div className="text-muted-foreground">{post.date}</div>
            </div>
            <h3 className="mb-4 font-bangers text-2xl leading-tight transition-colors group-hover:text-accent">
              {post.title}
            </h3>
            <div className="mt-auto flex items-center gap-3 border-t border-border pt-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary font-bangers text-xs text-white">
                {post.avatar}
              </div>
              <div className="font-oswald text-xs font-bold uppercase tracking-wider text-muted-foreground">
                BY {post.author}
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
