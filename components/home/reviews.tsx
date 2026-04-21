"use client";

import { motion } from "framer-motion";
import { Zap } from "lucide-react";
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
    <section className="relative border-y-8 border-foreground py-16 overflow-hidden">
      {/* Halftone Background Pattern */}
      <div
        className="absolute inset-0 opacity-[0.08] pointer-events-none dark:opacity-[0.15]"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
          backgroundSize: "16px 16px",
        }}
      />

      {/* Action Lines - Left Side */}
      <svg
        className="absolute left-0 top-1/2 -translate-y-1/2 w-32 h-96 opacity-20 pointer-events-none"
        viewBox="0 0 100 300"
      >
        <path
          d="M80 0 L20 150 L85 300"
          className="stroke-foreground"
          strokeWidth="3"
          fill="none"
          strokeDasharray="8 4"
        />
        <path
          d="M60 20 L10 150 L65 280"
          className="stroke-foreground"
          strokeWidth="2"
          fill="none"
          strokeDasharray="6 6"
        />
        <path
          d="M95 40 L30 150 L90 260"
          className="stroke-foreground"
          strokeWidth="4"
          fill="none"
          strokeDasharray="10 5"
        />
      </svg>

      {/* Action Lines - Right Side */}
      <svg
        className="absolute right-0 top-1/2 -translate-y-1/2 w-32 h-96 opacity-20 pointer-events-none rotate-180"
        viewBox="0 0 100 300"
      >
        <path
          d="M80 0 L20 150 L85 300"
          className="stroke-foreground"
          strokeWidth="3"
          fill="none"
          strokeDasharray="8 4"
        />
        <path
          d="M60 20 L10 150 L65 280"
          className="stroke-foreground"
          strokeWidth="2"
          fill="none"
          strokeDasharray="6 6"
        />
      </svg>

      <div className="container relative z-10 mx-auto px-4">
        {/* Comic Title with Starburst */}
        <div className="mb-14 flex items-center justify-center gap-6">
          <div
            className="h-1 flex-1 bg-foreground"
            style={{ boxShadow: "4px 4px 0px 0px rgba(0,0,0,0.2)" }}
          />

          <div className="relative">

            <h2
              className="font-bangers text-4xl text-foreground sm:text-5xl md:text-6xl tracking-wide px-4 py-2 relative"
              style={{
                textShadow: "3px 3px 0px hsl(var(--primary)), 6px 6px 0px hsl(var(--accent))",
                WebkitTextStroke: "1px currentColor",
              }}
            >
              READER REVIEWS
            </h2>
          </div>

          <div
            className="h-1 flex-1 bg-foreground"
            style={{ boxShadow: "4px 4px 0px 0px rgba(0,0,0,0.2)" }}
          />
        </div>

        {/* Comic Grid Layout */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {REVIEWS.map((review, index) => (
            <motion.div
              key={review.name}
              initial={{
                opacity: 0,
                scale: 0.8,
                rotate: index % 2 === 0 ? -2 : 2,
              }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: index * 0.15,
                type: "spring",
                stiffness: 200,
                damping: 15,
              }}
              className={`relative ${index === 0 ? "md:col-span-2 lg:col-span-1" : ""}`}
            >
              {/* Comic Panel Container */}
              <div
                className="relative bg-card p-1 h-full shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_hsl(var(--primary)/0.5)]"
                style={{
                  border: "3px solid currentColor",
                }}
              >
                {/* Panel Inner Border */}
                <div className="border-2 border-dashed border-border p-4 h-full flex flex-col">
                  {/* Rating Stars - Comic Style */}
                  <div className="mb-4 flex gap-1 items-center">
                    <span className="font-bangers text-sm text-muted-foreground mr-2">
                      RATING:
                    </span>
                    {Array.from({ length: 5 }).map((_, starIndex) => (
                      <svg
                        key={`${review.name}-${starIndex}`}
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        className={
                          starIndex < review.rating
                            ? "text-primary"
                            : "text-muted"
                        }
                      >
                        <path
                          d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                          fill="currentColor"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                      </svg>
                    ))}
                  </div>

                  {/* Quote with Comic Quotation Marks */}
                  <div className="relative flex-1 mb-4">
                    <span className="absolute -top-4 -left-2 font-bangers text-6xl text-primary opacity-30 leading-none">
                      &quot;
                    </span>
                    <p
                      className="font-sans text-base leading-relaxed text-foreground relative z-10 pl-4"
                      style={{
                        fontFamily:
                          '"Comic Sans MS", "Chalkboard SE", sans-serif',
                      }}
                    >
                      {review.text}
                    </p>
                    <span className="absolute -bottom-8 -right-2 font-bangers text-6xl text-primary opacity-30 leading-none rotate-180">
                      &quot;
                    </span>
                  </div>

                  {/* Reader Info - Comic Strip Style */}
                  <div className="mt-auto flex items-center gap-4 border-t-4 border-foreground pt-4 bg-muted/30 -mx-4 -mb-4 px-4 pb-4">
                    <div
                      className={`relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden border-4 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] dark:shadow-[4px_4px_0px_0px_hsl(var(--primary)/0.2)] ${review.color}`}
                      style={{ transform: "rotate(-3deg)" }}
                    >
                      {review.image ? (
                        <Image
                          src={review.image}
                          alt={review.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <span className="font-bangers text-xl text-white drop-shadow-md">
                          {review.name.charAt(0)}
                        </span>
                      )}
                    </div>

                    <div className="flex-1">
                      <div
                        className="font-bangers text-2xl leading-tight text-foreground tracking-wide"
                        style={{ textShadow: "2px 2px 0px rgba(0,0,0,0.1)" }}
                      >
                        {review.name}
                      </div>
                      <div className="inline-flex items-center gap-1 bg-primary px-3 py-1 font-oswald text-xs font-bold uppercase tracking-widest text-primary-foreground border-2 border-foreground shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_hsl(var(--primary)/0.5)] -rotate-1 mt-1">
                        <Zap size={12} className="fill-primary-foreground" />
                        Verified Reader
                      </div>
                    </div>
                  </div>
                </div>

                {/* Comic Sound Effect Badge */}
                <div className="absolute -top-3 -right-3 bg-primary border-3 border-foreground px-3 py-1 font-bangers text-sm text-foreground shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_hsl(var(--primary)/0.5)] rotate-12 z-20">
                  {index === 0 ? "WOW!" : index === 1 ? "POW!" : "BAM!"}
                </div>
              </div>

              {/* Speech Bubble Tail - Redesigned as Comic Pointer */}
              <div className="absolute -bottom-6 left-8 z-10">
                <svg width="50" height="35" viewBox="0 0 50 35" fill="none">
                  <path
                    d="M5 5 L25 5 L15 30 L20 5 L45 5"
                    className="fill-card stroke-foreground"
                    strokeWidth="3"
                    strokeLinejoin="round"
                  />
                  {/* Cover the border seam */}
                  <rect
                    x="6"
                    y="2"
                    width="38"
                    height="6"
                    className="fill-card"
                  />
                </svg>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Comic Element */}
        <div className="mt-16 flex justify-center">
          <div className="bg-primary border-4 border-foreground px-8 py-3 font-bangers text-2xl text-primary-foreground shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rotate-1 hover:rotate-0 transition-transform cursor-pointer">
            JOIN THE CONVERSATION!
          </div>
        </div>
      </div>
    </section>
  );
}
