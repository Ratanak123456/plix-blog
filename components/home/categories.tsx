"use client";

import { motion } from "framer-motion";
import { ArrowRight, Code2, Cpu, Film, ShieldCheck, Smartphone } from "lucide-react";

const CATEGORIES = [
  {
    icon: Cpu,
    name: "AI & Algorithms",
    desc: "The ghosts in the machine.",
    href: "#ai",
  },
  {
    icon: Code2,
    name: "Code & Creativity",
    desc: "Building the digital frontier.",
    href: "#code",
  },
  {
    icon: Smartphone,
    name: "Gadgets & Gear",
    desc: "Hardware that hits different.",
    href: "#gadgets",
  },
  {
    icon: Film,
    name: "Entertainment",
    desc: "Pixels, polygons & pop culture.",
    href: "#entertainment",
  },
  {
    icon: ShieldCheck,
    name: "Cybersecurity",
    desc: "Guarding the mainframe.",
    href: "#cybersecurity",
  },
];

export function Categories() {
  return (
    <section
      id="ai"
      className="relative my-10 border-y-4 border-secondary bg-muted/30 py-14"
    >
      <div className="pointer-events-none absolute inset-0 opacity-15 halftone-bg" />
      <div className="relative z-10 container mx-auto px-4">
        <h2 className="mb-10 text-center font-bangers text-4xl drop-shadow-[2px_2px_0px_hsl(var(--primary))]">
          CHOOSE YOUR ADVENTURE
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-5">
          {CATEGORIES.map((category, index) => {
            const Icon = category.icon;

            return (
              <motion.a
                href={category.href}
                key={category.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative flex flex-col items-center overflow-hidden bg-card p-6 text-center transition-all duration-300 hover:scale-105 hover:border-accent hover:shadow-coral comic-border group"
              >
                <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-10 halftone-bg" />
                <Icon
                  size={44}
                  className="mb-4 text-primary transition-colors group-hover:text-accent"
                />
                <h3 className="mb-2 font-bangers text-2xl">
                  {category.name}
                </h3>
                <p className="mb-4 font-sans text-sm text-muted-foreground">
                  {category.desc}
                </p>
                <span className="flex items-center gap-1 font-oswald text-sm text-accent transition-all group-hover:gap-2">
                  Explore <ArrowRight size={14} />
                </span>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
