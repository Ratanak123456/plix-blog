"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, MessageSquare } from "lucide-react";

// Pre-calculate SVG line coordinates to avoid hydration mismatch
const SPEED_LINES_TOP = Array.from({ length: 18 }).map((_, i) => {
  const angle = (i / 18) * 360;
  const rad = (angle * Math.PI) / 180;
  return {
    x2: 100 + Math.cos(rad) * 160,
    y2: 100 + Math.sin(rad) * 160,
    strokeWidth: i % 3 === 0 ? "2" : "0.8",
  };
});

const SPEED_LINES_BOTTOM = Array.from({ length: 14 }).map((_, i) => {
  const angle = (i / 14) * 360;
  const rad = (angle * Math.PI) / 180;
  return {
    x2: 100 + Math.cos(rad) * 140,
    y2: 100 + Math.sin(rad) * 140,
    strokeWidth: i % 2 === 0 ? "1.5" : "0.6",
  };
});

const FAQS = [
  {
    q: "What makes PlixBlog different from other tech blogs?",
    a: "We treat every story like it deserves a graphic novel. Ink borders, halftone panels, and origin-story framing — tech journalism with a soul.",
  },
  {
    q: "How often is new content published?",
    a: "Daily issues drop every morning. Long-form origin stories land twice a week. You'll never run out of panels to read.",
  },
  {
    q: "Can I contribute an article or tip?",
    a: "Absolutely. Use the Feedback form below or email us at tips@plixblog.com. We credit every contributor.",
  },
  {
    q: "Is PlixBlog free to read?",
    a: "The daily strip is always free. Premium long-form origin stories are available through a subscription — coming soon.",
  },
];

export function FAQ() {
const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <section className="relative overflow-hidden px-4 py-12 md:py-16">

      {/* ── Layer 1: Halftone dot field ── */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, currentColor 1.5px, transparent 1.5px)",
          backgroundSize: "22px 22px",
        }}
      />

      {/* ── Layer 2: Diagonal hatch stripes ── */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, currentColor 0px, currentColor 1px, transparent 1px, transparent 12px)",
        }}
      />

      {/* ── Layer 3: Speed lines — top-left ── */}
      <svg
        className="absolute -top-10 -left-10 w-72 h-72 opacity-10 pointer-events-none"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        {SPEED_LINES_TOP.map((line, i) => (
            <line
              key={i}
              x1="100"
              y1="100"
              x2={line.x2}
              y2={line.y2}
              stroke="currentColor"
              strokeWidth={line.strokeWidth}
              strokeLinecap="round"
            />
          ))}
      </svg>

      {/* ── Layer 4: Speed lines — bottom-right ── */}
      <svg
        className="absolute -bottom-10 -right-10 w-64 h-64 opacity-10 pointer-events-none rotate-180"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        {SPEED_LINES_BOTTOM.map((line, i) => (
            <line
              key={i}
              x1="100"
              y1="100"
              x2={line.x2}
              y2={line.y2}
              stroke="currentColor"
              strokeWidth={line.strokeWidth}
              strokeLinecap="round"
            />
          ))}
      </svg>

      {/* ── Layer 5: Starburst — top-right ── */}
      <svg
        className="absolute top-8 right-6 w-20 h-20 text-accent opacity-25 pointer-events-none animate-spin"
        style={{ animationDuration: "20s" }}
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <polygon
          points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35"
          fill="currentColor"
        />
      </svg>

      {/* ── Layer 6: Starburst — bottom-left ── */}
      <svg
        className="absolute bottom-10 left-4 w-14 h-14 text-primary opacity-20 pointer-events-none animate-spin"
        style={{ animationDuration: "30s", animationDirection: "reverse" }}
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <polygon
          points="50,2 58,38 95,38 66,60 76,96 50,75 24,96 34,60 5,38 42,38"
          fill="currentColor"
        />
      </svg>

      {/* ── Layer 7: Floating "POW!" ── */}
      <div className="absolute top-16 left-[5%] pointer-events-none select-none opacity-[0.07] -rotate-[15deg]">
        <div className="relative">
          <svg
            className="absolute inset-0 w-full h-full -z-10"
            viewBox="0 0 120 60"
            xmlns="http://www.w3.org/2000/svg"
          >
            <polygon
              points="0,30 10,10 30,5 20,25 60,0 50,25 90,5 80,28 120,20 105,35 120,50 90,45 100,60 70,48 80,60 60,45 50,60 40,45 20,60 30,45 0,55"
              fill="currentColor"
            />
          </svg>
          <span className="font-bangers text-4xl text-foreground tracking-widest">
            POW!
          </span>
        </div>
      </div>

      {/* ── Layer 8: Floating "ZAP!" ── */}
      <div className="absolute bottom-24 right-[6%] pointer-events-none select-none opacity-[0.07] rotate-[12deg]">
        <div className="relative">
          <svg
            className="absolute inset-0 w-full h-full -z-10"
            viewBox="0 0 100 55"
            xmlns="http://www.w3.org/2000/svg"
          >
            <polygon
              points="0,28 8,8 28,2 18,22 55,0 45,24 85,4 75,26 100,18 95,32 100,48 78,44 88,55 62,46 72,55 50,44 38,55 30,44 10,58 22,42 0,48"
              fill="currentColor"
            />
          </svg>
          <span className="font-bangers text-3xl text-foreground tracking-widest">
            ZAP!
          </span>
        </div>
      </div>

      {/* ── Layer 9: Corner ink brackets ── */}
      <div className="absolute top-4 left-4 w-10 h-10 border-l-4 border-t-4 border-foreground/10 pointer-events-none" />
      <div className="absolute top-4 right-4 w-10 h-10 border-r-4 border-t-4 border-foreground/10 pointer-events-none" />
      <div className="absolute bottom-4 left-4 w-10 h-10 border-l-4 border-b-4 border-foreground/10 pointer-events-none" />
      <div className="absolute bottom-4 right-4 w-10 h-10 border-r-4 border-b-4 border-foreground/10 pointer-events-none" />

      {/* ══════════════════════════════════════════
          Content
      ══════════════════════════════════════════ */}
      <div className="container mx-auto max-w-3xl px-4 py-14 relative z-10">

        {/* Header */}
        <div className="mb-12 text-center relative">
          <span className="inline-block bg-accent px-5 py-1.5 font-oswald text-xs font-bold uppercase tracking-[0.3em] text-background comic-border-secondary shadow-md transform -rotate-1 hover:rotate-0 transition-transform">
            Common Questions
          </span>
          <h2 className="mt-5 font-bangers text-5xl text-primary md:text-7xl drop-shadow-lg tracking-wide leading-none">
            FREQUENTLY ASKED
          </h2>
          <div className="relative flex items-center justify-center mt-4 gap-2">
            <div className="h-[3px] w-16 bg-accent rounded-full" />
            <div className="w-3 h-3 bg-accent rotate-45 shrink-0" />
            <div className="h-[3px] w-16 bg-accent rounded-full" />
          </div>
        </div>

        {/* Accordion */}
        <div className="flex flex-col gap-4">
          {FAQS.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <motion.div
                key={faq.q}
                initial={{ opacity: 0, x: index % 2 === 0 ? -24 : 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: index * 0.07,
                  type: "spring",
                  stiffness: 200,
                  damping: 22,
                }}
              >
                {/* Question button */}
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className={`
                    relative flex w-full items-center gap-4 px-5 py-4 text-left
                    border-3 comic-border transition-all duration-200 group overflow-hidden
                    ${
                      isOpen
                        ? "bg-primary border-primary shadow-[4px_4px_0px_0px] shadow-accent"
                        : "bg-card border-foreground shadow-[3px_3px_0px_0px] shadow-foreground/20 hover:shadow-[4px_4px_0px_0px] hover:shadow-primary hover:border-primary hover:-translate-y-0.5"
                    }
                  `}
                >
                  {/* Halftone overlay when open */}
                  {isOpen && (
                    <div
                      className="absolute inset-0 opacity-10 pointer-events-none"
                      style={{
                        backgroundImage:
                          "radial-gradient(circle, currentColor 1px, transparent 1px)",
                        backgroundSize: "10px 10px",
                        color: "white",
                      }}
                    />
                  )}

                  {/* Number badge */}
                  <div
                    className={`
                      shrink-0 w-9 h-9 flex items-center justify-center font-bangers text-lg
                      border-2 rounded-full transition-all duration-200 relative z-10
                      ${
                        isOpen
                          ? "bg-white text-primary border-white"
                          : "bg-accent/10 text-accent border-accent group-hover:bg-accent group-hover:text-background"
                      }
                    `}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  {/* Question text */}
                  <span
                    className={`
                      flex-1 font-bangers text-xl tracking-[0.05em] md:text-2xl
                      transition-colors duration-200 relative z-10
                      ${
                        isOpen
                          ? "text-white drop-shadow-sm"
                          : "text-foreground group-hover:text-primary"
                      }
                    `}
                  >
                    {faq.q}
                  </span>

                  {/* Chevron */}
                  <span
                    className={`
                      shrink-0 w-8 h-8 flex items-center justify-center
                      border-2 transition-all duration-300 relative z-10
                      ${
                        isOpen
                          ? "bg-white text-primary border-white rotate-180"
                          : "bg-background text-foreground border-foreground/30 group-hover:border-primary group-hover:text-primary group-hover:scale-110"
                      }
                    `}
                  >
                    <ChevronDown size={18} />
                  </span>
                </button>

                {/* Answer panel */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="border-3 border-t-0 border-primary comic-border-bottom bg-card px-5 pt-1 pb-5">
                        {/* Connector tick */}
                        <div className="flex gap-1 items-center mb-3 mt-3">
                          <div className="w-2 h-2 bg-primary rotate-45" />
                          <div className="h-[2px] flex-1 bg-primary/20" />
                        </div>

                        {/* Answer */}
                        <div className="relative pl-4 border-l-4 border-accent">
                          <MessageSquare
                            size={14}
                            className="absolute -left-[11px] top-0 text-accent bg-card"
                          />
                          <p className="font-sans text-base leading-relaxed text-foreground/90">
                            {faq.a}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}