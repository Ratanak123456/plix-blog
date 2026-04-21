"use client";

import { motion } from "framer-motion";
import { ArrowRight, Code2, Coffee, Cpu, Film, ShieldCheck, Smartphone } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useGetCategoriesQuery } from "@/lib/services/auth-api";

const categoryIcons: Record<string, LucideIcon> = {
  ai: Cpu,
  algorithm: Cpu,
  code: Code2,
  software: Code2,
  gadget: Smartphone,
  mobile: Smartphone,
  entertainment: Film,
  movie: Film,
  cyber: ShieldCheck,
  security: ShieldCheck,
  lifestyle: Coffee,
};

function getCategoryIcon(slug: string, name: string) {
  const key = `${slug} ${name}`.toLowerCase();
  const match = Object.entries(categoryIcons).find(([token]) => key.includes(token));
  return match?.[1] ?? Cpu;
}

export function Categories() {
  const { data: categories = [], isLoading, isError } = useGetCategoriesQuery();

  return (
    <section
      id="choose-your-adventure"
      className="relative my-10 border-y-4 border-secondary bg-muted/30 py-14"
    >
      <div className="pointer-events-none absolute inset-0 opacity-15 halftone-bg" />
      <div className="relative z-10 container mx-auto px-4">
        <h2 
          className="mb-10 text-center font-bangers text-4xl"
          style={{
            textShadow: "2px 2px 0px hsl(var(--primary)), 4px 4px 0px hsl(var(--accent))",
          }}
        >
          CHOOSE YOUR ADVENTURE
        </h2>
        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="h-64 animate-pulse bg-card comic-border" />
            ))}
          </div>
        ) : isError ? (
          <div className="mx-auto max-w-2xl bg-card p-6 text-center comic-border">
            <p className="font-bangers text-2xl text-primary">Categories unavailable</p>
            <p className="mt-2 font-oswald text-sm uppercase tracking-wider text-muted-foreground">
              We couldn&apos;t load the category list from the API.
            </p>
          </div>
        ) : categories.length === 0 ? (
          <div className="mx-auto max-w-2xl bg-card p-6 text-center comic-border">
            <p className="font-bangers text-2xl text-primary">No adventures yet</p>
            <p className="mt-2 font-oswald text-sm uppercase tracking-wider text-muted-foreground">
              Add categories in the backend and they will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-5">
            {categories.map((category, index) => {
              const Icon = getCategoryIcon(category.slug, category.name);

              return (
                <motion.a
                  href={`#${category.slug}`}
                  key={category.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.12 }}
                  className={`group relative flex flex-col items-center overflow-hidden bg-card p-6 text-center transition-all duration-300 hover:scale-105 hover:border-accent hover:shadow-coral comic-border ${
                    index === 0 ? "sm:col-span-2 lg:col-span-1" : ""
                  }`}
                >
                  <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-10 halftone-bg" />
                  <Icon
                    size={44}
                    className="mb-4 text-primary transition-colors group-hover:text-accent"
                  />
                  <h3 className="mb-2 font-bangers text-2xl">{category.name}</h3>
                  <p className="mb-4 font-sans text-sm text-muted-foreground">
                    {category.description || "Explore stories from this category."}
                  </p>
                  <div className="mb-4 font-oswald text-xs uppercase tracking-wider text-primary">
                    {category.postCount} posts
                  </div>
                  <span className="flex items-center gap-1 font-oswald text-sm text-accent transition-all group-hover:gap-2">
                    Explore <ArrowRight size={14} />
                  </span>
                </motion.a>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
