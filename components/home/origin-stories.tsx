"use client";

import { motion } from "framer-motion";

const SIDE_STORIES = [
  {
    title: "How 5G Was Built on a Lie",
    tag: "Exposé",
    time: "8 MIN",
    color: "from-rose-900 to-red-600",
    author: "Ari Sol",
    date: "MAR 28",
  },
  {
    title: "The Secret Life of Server Farms",
    tag: "Infrastructure",
    time: "5 MIN",
    color: "from-blue-900 to-indigo-600",
    author: "Mina Hart",
    date: "MAR 25",
  },
  {
    title: "When Crypto Met The Mob",
    tag: "Investigation",
    time: "15 MIN",
    color: "from-purple-900 to-fuchsia-600",
    author: "Jules Mercer",
    date: "MAR 22",
  },
];

export function OriginStories() {
  return (
    <section className="container mx-auto px-4 py-10">
      <div className="mb-6 flex items-center gap-4">
        <h2 className="whitespace-nowrap font-bangers text-4xl text-primary md:text-5xl">
          ORIGIN STORIES
        </h2>
        <div className="h-1 flex-1 bg-secondary" />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <motion.article
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="group cursor-pointer lg:col-span-2"
        >
          <div className="flex h-full flex-col overflow-hidden bg-muted transition-colors hover:border-primary comic-border-secondary">
            <div className="relative aspect-video w-full overflow-hidden bg-gradient-to-br from-cyan-900 to-emerald-800 md:aspect-[21/9]">
              <div className="absolute inset-0 opacity-30 halftone-bg" />
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-900 to-emerald-800 transition-transform duration-500 group-hover:scale-105" />
            </div>
            <div className="relative z-10 -mt-10 flex flex-1 flex-col justify-end border-t-4 border-secondary bg-card p-6 transition-colors group-hover:border-primary md:p-8">
              <div className="mb-3 flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary font-bangers text-xs text-white">
                    MH
                  </div>
                  <span className="font-oswald text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    BY Mina Hart • MAR 29, 2026
                  </span>
                </div>
                <div className="flex gap-3">
                  <span className="bg-secondary px-3 py-1 font-oswald text-sm font-bold uppercase text-background comic-border-accent">
                    Deep Dive
                  </span>
                  <span className="py-1 font-oswald text-sm text-muted-foreground uppercase">
                    12 MIN READ
                  </span>
                </div>
              </div>
              <h3 className="mb-4 font-bangers text-4xl transition-colors group-hover:text-accent md:text-5xl">
                The Man Who Taught Machines to Dream
              </h3>
              <p className="line-clamp-3 font-sans text-lg text-muted-foreground">
                Before neural networks were mainstream, one rogue engineer
                decided to feed a supercomputer nothing but classic comic
                books. The results were terrifyingly beautiful.
              </p>
            </div>
          </div>
        </motion.article>

        <div className="flex flex-col gap-5">
          {SIDE_STORIES.map((post, index) => (
            <motion.article
              key={post.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex gap-4 bg-card p-4 transition-all hover:-translate-y-1 hover:border-primary comic-border-secondary group cursor-pointer"
            >
              <div
                className={`h-24 w-24 shrink-0 bg-gradient-to-br ${post.color} comic-border-accent`}
              />
              <div className="flex flex-col justify-center">
                <div className="mb-1 flex gap-2 font-oswald text-xs uppercase">
                  <span className="text-accent">{post.tag}</span>
                  <span className="text-muted-foreground">
                    • {post.time} • {post.date}
                  </span>
                </div>
                <h4 className="mb-1 font-bangers text-2xl leading-tight transition-colors group-hover:text-primary">
                  {post.title}
                </h4>
                <div className="font-oswald text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  BY {post.author}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
