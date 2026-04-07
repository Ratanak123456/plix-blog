"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const REVIEWS = [
  {
    name: "Kira Nakamura",
    handle: "@kira_nx",
    rating: 5,
    text: "PlixBlog is the only tech blog my brain actually retains. The comic format makes complex topics feel like reading X-Men. Addicted.",
    avatar: "KN",
    avatarColor: "from-violet-600 to-indigo-700",
  },
  {
    name: "Darius Osei",
    handle: "@d_osei_dev",
    rating: 5,
    text: "Finally — tech journalism that has style. The halftone headers alone deserve a design award. Keep the issues coming.",
    avatar: "DO",
    avatarColor: "from-emerald-600 to-teal-700",
  },
  {
    name: "Sofia Reyes",
    handle: "@sofiatech",
    rating: 4,
    text: "The Origin Stories section is my Saturday morning ritual. The Crypto Mob piece? Outstanding. I sent it to everyone I know.",
    avatar: "SR",
    avatarColor: "from-rose-600 to-pink-700",
  },
];

export function Reviews() {
  return (
    <section className="border-y-4 border-secondary bg-muted/20 py-14">
      <div className="container mx-auto px-4">
        <div className="mb-10 flex items-center gap-4">
          <h2 className="whitespace-nowrap font-bangers text-4xl text-primary md:text-5xl">
            READER REVIEWS
          </h2>
          <div className="h-1 flex-1 bg-secondary" />
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {REVIEWS.map((review, index) => (
            <motion.div
              key={review.handle}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.12 }}
              className="relative"
            >
              <div className="relative bg-card p-6 comic-border review-bubble">
                <div className="mb-3 flex gap-1">
                  {Array.from({ length: 5 }).map((_, starIndex) => (
                    <Star
                      key={`${review.handle}-${starIndex}`}
                      size={16}
                      className={
                        starIndex < review.rating
                          ? "fill-primary text-primary"
                          : "text-muted-foreground"
                      }
                    />
                  ))}
                </div>
                <p className="mb-4 font-sans text-base italic text-foreground">
                  &quot;{review.text}&quot;
                </p>
                <div className="mt-4 flex items-center gap-3 border-t border-border pt-4">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${review.avatarColor} font-bangers text-sm text-white`}
                  >
                    {review.avatar}
                  </div>
                  <div>
                    <div className="font-bangers text-lg leading-tight">
                      {review.name}
                    </div>
                    <div className="font-oswald text-xs text-accent">
                      {review.handle}
                    </div>
                  </div>
                </div>
              </div>
              <div className="review-tail" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
