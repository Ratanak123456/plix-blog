"use client";

import { motion } from "framer-motion";
import { Clock } from "lucide-react";

interface BlogCardProps {
  title: string;
  category?: string;
  cat?: string;
  time: string;
  color: string;
  author: string;
  date: string;
  avatar: string;
  index?: number;
}

export function BlogCard({
  title,
  category,
  cat,
  time,
  color,
  author,
  date,
  avatar,
  index = 0,
}: BlogCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="flex cursor-pointer flex-col group"
    >
      <div
        className={`relative mb-4 aspect-[3/2] w-full overflow-hidden bg-gradient-to-br ${color} comic-border`}
      >
        <div className="absolute inset-0 opacity-20 halftone-bg" />
        <div className="absolute top-3 left-3 rotate-[-2deg] bg-accent px-2 py-0.5 font-bangers text-sm text-background transition-transform group-hover:rotate-0 comic-border-secondary">
          {category || cat}
        </div>
      </div>
      <div className="mb-2 flex items-center justify-between font-oswald text-xs font-bold uppercase text-primary">
        <div className="flex items-center gap-2">
          <Clock size={12} /> {time} READ
        </div>
        <div className="text-muted-foreground">{date}</div>
      </div>
      <h3 className="mb-4 font-bangers text-2xl leading-tight transition-colors group-hover:text-accent">
        {title}
      </h3>
      <div className="mt-auto flex items-center gap-3 border-t border-border pt-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary font-bangers text-xs text-white">
          {avatar}
        </div>
        <div className="font-oswald text-xs font-bold uppercase tracking-wider text-muted-foreground">
          BY {author}
        </div>
      </div>
    </motion.article>
  );
}