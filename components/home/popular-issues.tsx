"use client";

import { BlogCard } from "./blog-card";

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
          <BlogCard key={post.title} {...post} index={index} />
        ))}
      </div>
    </section>
  );
}
