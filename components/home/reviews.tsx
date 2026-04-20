"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import Image from "next/image";

const REVIEWS = [
  {
    name: "Saren Ratanak",
    rating: 5,
    text: "PlixBlog is the only tech blog my brain actually retains. The comic format makes complex topics feel like reading X-Men. Addicted.",
    image: "/about/leader.jpg",
    color: "bg-primary",
  },
  {
    name: "Khann Kanhchana",
    rating: 5,
    text: "Finally — tech journalism that has style. The halftone headers alone deserve a design award. Keep the issues coming.",
    image: "", // Fallback
    color: "bg-accent",
  },
  {
    name: "Man Tolfary",
    rating: 4,
    text: "The Origin Stories section is my Saturday morning ritual. The Crypto Mob piece? Outstanding. I sent it to everyone I know.",
    image: "/about/member2.jpg",
    color: "bg-secondary",
  },
];

export function Reviews() {
  return (
    <section className="border-y-4 border-secondary bg-muted/20 py-14">
      <div className="container mx-auto px-4">
        <div className="mb-10 flex items-center gap-4">
          <h2 className="font-bangers text-3xl text-primary sm:text-4xl md:text-5xl">
            READER REVIEWS
          </h2>
          <div className="h-1 flex-1 bg-secondary" />
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {REVIEWS.map((review, index) => (
            <motion.div
              key={review.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.12 }}
              className="relative"
            >
              <div className="relative bg-card p-6 comic-border review-bubble h-full flex flex-col">
                <div className="mb-3 flex gap-1">
                  {Array.from({ length: 5 }).map((_, starIndex) => (
                    <Star
                      key={`${review.name}-${starIndex}`}
                      size={16}
                      className={
                        starIndex < review.rating
                          ? "fill-primary text-primary"
                          : "text-muted-foreground"
                      }
                    />
                  ))}
                </div>
                <p className="mb-4 font-sans text-base italic text-foreground flex-1">
                  &quot;{review.text}&quot;
                </p>
                <div className="mt-4 flex items-center gap-3 border-t border-border pt-4">
                  <div
                    className={`relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-primary ${review.color} shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`}
                  >
                    {review.image ? (
                      <Image
                        src={review.image}
                        alt={review.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <span className="font-bangers text-lg text-white">
                        {review.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="font-bangers text-xl leading-tight">
                      {review.name}
                    </div>
                    <div className="font-oswald text-xs uppercase tracking-widest text-muted-foreground">
                      Verified Reader
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
