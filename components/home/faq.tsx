"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, MessageSquare } from "lucide-react";

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
    <section className="relative overflow-hidden px-4 py-12 md:py-16 bg-muted/5">

      {/* ── Subtle Background elements ── */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, currentColor 1.5px, transparent 1.5px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* ── Minimalist Speed lines ── */}
      <div className="absolute top-0 left-0 w-32 h-32 opacity-[0.05] pointer-events-none">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <line x1="0" y1="0" x2="100" y2="100" stroke="currentColor" strokeWidth="2" />
          <line x1="0" y1="20" x2="80" y2="100" stroke="currentColor" strokeWidth="1" />
          <line x1="20" y1="0" x2="100" y2="80" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>

      <div className="absolute bottom-0 right-0 w-32 h-32 opacity-[0.05] pointer-events-none rotate-180">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <line x1="0" y1="0" x2="100" y2="100" stroke="currentColor" strokeWidth="2" />
          <line x1="0" y1="20" x2="80" y2="100" stroke="currentColor" strokeWidth="1" />
          <line x1="20" y1="0" x2="100" y2="80" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>

      {/* ══════════════════════════════════════════
          Content
      ══════════════════════════════════════════ */}
      <div className="container mx-auto max-w-3xl px-4 py-10 relative z-10">

        {/* Header */}
        <div className="mb-12 text-center relative">
          <span className="inline-block bg-primary px-4 py-1 font-oswald text-xs font-bold uppercase tracking-[0.2em] text-background comic-border-secondary shadow-sm">
            Support Center
          </span>
          <h2 className="mt-4 font-bangers text-5xl text-primary md:text-6xl tracking-wide">
            FREQUENTLY ASKED
          </h2>
          <div className="flex items-center justify-center mt-4 gap-2 opacity-30">
            <div className="h-[2px] w-12 bg-primary" />
            <div className="w-2 h-2 bg-primary rotate-45" />
            <div className="h-[2px] w-12 bg-primary" />
          </div>
        </div>

        {/* Accordion */}
        <div className="flex flex-col gap-3">
          {FAQS.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={faq.q}
                className="group"
              >
                {/* Question button */}
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className={`
                    relative flex w-full items-center gap-4 px-6 py-5 text-left
                    comic-border transition-all duration-200
                    ${
                      isOpen
                        ? "bg-primary border-primary text-background"
                        : "bg-card border-foreground hover:border-primary hover:text-primary"
                    }
                  `}
                >
                  {/* Number */}
                  <span className={`font-bangers text-xl ${isOpen ? "text-background/80" : "text-muted-foreground"}`}>
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  {/* Question text */}
                  <span className="flex-1 font-bangers text-xl tracking-wide md:text-2xl">
                    {faq.q}
                  </span>

                  {/* Chevron */}
                  <ChevronDown 
                    size={24} 
                    className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} 
                  />
                </button>

                {/* Answer panel */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="border-x-2 border-b-2 border-primary bg-card p-6 comic-border-bottom">
                        <div className="relative pl-6 border-l-4 border-accent">
                          <MessageSquare
                            size={16}
                            className="absolute -left-[10px] top-0 text-accent bg-card"
                          />
                          <p className="font-sans text-lg leading-relaxed text-muted-foreground">
                            {faq.a}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
