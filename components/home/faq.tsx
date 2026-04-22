"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle, MessageSquare, Zap } from "lucide-react";

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
    <section className="relative overflow-hidden px-4 py-16 md:py-24 bg-background transition-colors duration-300">
      {/* ── Halftone Background ── */}
      <div
        className="absolute inset-0 opacity-[0.06] dark:opacity-[0.1] pointer-events-none text-secondary dark:text-primary"
        style={{
          backgroundImage:
            "radial-gradient(circle, currentColor 1.5px, transparent 1.5px)",
          backgroundSize: "20px 20px",
        }}
      />

      {/* ── Action Lines - Top Left ── */}
      <svg
        className="absolute top-8 left-0 w-40 h-64 opacity-[0.08] dark:opacity-[0.15] pointer-events-none text-secondary dark:text-primary"
        viewBox="0 0 100 200"
      >
        <path
          d="M90 0 L30 100 L95 200"
          stroke="currentColor"
          strokeWidth="3"
          fill="none"
          strokeDasharray="10 5"
        />
        <path
          d="M70 20 L20 100 L75 180"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          strokeDasharray="6 6"
        />
        <path
          d="M100 40 L40 100 L100 160"
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
          strokeDasharray="12 4"
        />
      </svg>

      {/* ── Action Lines - Bottom Right ── */}
      <svg
        className="absolute bottom-8 right-0 w-40 h-64 opacity-[0.08] dark:opacity-[0.15] pointer-events-none rotate-180 text-secondary dark:text-primary"
        viewBox="0 0 100 200"
      >
        <path
          d="M90 0 L30 100 L95 200"
          stroke="currentColor"
          strokeWidth="3"
          fill="none"
          strokeDasharray="10 5"
        />
        <path
          d="M70 20 L20 100 L75 180"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          strokeDasharray="6 6"
        />
      </svg>


      <div className="container mx-auto max-w-3xl px-4 py-10 relative z-10">
        {/* Header */}
        <div className="mb-14 text-center relative">
          <h2
            className="font-bangers text-5xl text-primary dark:text-white sm:text-6xl md:text-7xl tracking-wide relative inline-block"
            style={{
              textShadow: "4px 4px 0px hsl(var(--accent))",
              WebkitTextStroke: "1.5px hsl(var(--accent))",
            }}
          >
            FREQUENTLY ASKED
          </h2>

          {/* Comic Divider */}
          <div className="flex items-center justify-center mt-6 gap-3">
            <div className="h-0.75` w-16 bg-secondary dark:bg-primary shadow-[2px_2px_0px_0px_hsl(var(--accent))]" />
            <div className="w-3 h-3 bg-primary border-2 border-secondary rotate-45 shadow-[2px_2px_0px_0px_hsl(var(--accent))]" />
            <div className="h-0.75` w-16 bg-secondary dark:bg-primary shadow-[2px_2px_0px_0px_hsl(var(--accent))]" />
          </div>
        </div>

        {/* Accordion */}
        <div className="flex flex-col gap-4">
          {FAQS.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <motion.div
                key={faq.q}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 150,
                }}
                className="group relative"
              >
                {/* Comic Panel Container */}
                <div
                  className="relative"
                  style={{
                    boxShadow: isOpen
                      ? "8px 8px 0px 0px rgba(0,0,0,1)"
                      : "6px 6px 0px 0px rgba(0,0,0,0.8)",
                  }}
                >
                  {/* Question button */}
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className={`
                  relative flex w-full items-center gap-4 px-5 py-5 text-left sm:gap-5 sm:px-7 sm:py-6
                  border-4 border-secondary dark:border-white transition-all duration-200
                  ${isOpen ? "bg-primary text-white" : "bg-card dark:bg-card text-secondary dark:text-white hover:bg-yellow-50 dark:hover:bg-primary/20"}
                `}
                  >
                    {/* Comic Number Badge */}
                    <span
                      className={`
                  flex items-center justify-center w-12 h-12 shrink-0 font-bangers text-xl sm:text-2xl
                  border-3 border-secondary shadow-[3px_3px_0px_0px_hsl(var(--secondary))]
                  ${isOpen ? "bg-card text-primary rotate-3" : "bg-primary text-white -rotate-2"}
                  transition-transform duration-200
                `}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    {/* Question text */}
                    <span className="flex-1 font-bangers text-xl tracking-wide sm:text-2xl md:text-3xl leading-tight">
                      {faq.q}
                    </span>

                    {/* Comic Chevron */}
                    <div
                      className={`
                  flex items-center justify-center w-10 h-10 shrink-0 border-3 border-secondary dark:border-white
                  ${isOpen ? "bg-card text-primary dark:white  dark:text-secondary rotate-0" : "bg-black dark:bg-card text-white dark:text-secondary rotate-0"}
                  transition-all duration-300 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)]
                `}
                    >
                      <ChevronDown
                        size={24}
                        strokeWidth={3}
                        className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                      />
                    </div>
                  </button>

                  {/* Answer panel */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="border-x-4 border-b-4 border-secondary dark:border-white bg-card dark:bg-card p-6 sm:p-8 relative">
                          {/* Speech Bubble Tail */}
                          <div className="absolute -top-[2px] left-24 w-6 h-4 bg-primary dark:bg-card border-l-4 border-r-4 dark:border-white border-secondary transform -translate-y-1/2 rotate-45" />

                          <div className="relative pl-8">
                            {/* Comic Quote Mark */}
                            <MessageSquare
                              size={20}
                              className="absolute -left-2 top-0 text-primary bg-primary dark:bg-card border-2 border-secondary p-1"
                              strokeWidth={2.5}
                            />
                            <p
                              className="font-sans text-base leading-relaxed text-gray-700 dark:text-gray-300 sm:text-lg"
                              style={{
                                fontFamily:
                                  '"Comic Sans MS", "Chalkboard SE", sans-serif',
                              }}
                            >
                              {faq.a}
                            </p>
                          </div>

                          {/* Bottom decorative element */}
                          <div className="mt-6 flex items-center gap-2 opacity-40">
                            <div className="h-[2px] flex-1 bg-primary" />
                            <Zap
                              size={16}
                              className="text-primary fill-primary"
                            />
                            <div className="h-[2px] flex-1 bg-primary" />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Sound Effect Badge (only on closed items, alternating) */}
                {!isOpen && index < 3 && (
                  <div
                    className={`
                absolute -top-3 ${index % 2 === 0 ? "-right-2" : "-left-2"} z-20
                bg-primary dark:bg-primary border-3 border-secondary px-3 py-1 font-bangers text-sm text-secondary
                shadow-[3px_3px_0px_0px_hsl(var(--secondary))]
                ${index % 2 === 0 ? "rotate-12" : "-rotate-12"}
              `}
                  >
                    {index === 0 ? "HMM?" : index === 1 ? "AHA!" : "GOT IT!"}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA Comic Element */}
        <div className="mt-14 flex justify-center">
          <div className="group relative cursor-pointer">
            <div className="bg-primary border-4 border-secondary px-8 py-4 font-bangers text-2xl text-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rotate-1 group-hover:rotate-0 transition-all duration-200 flex items-center gap-3">
              <HelpCircle size={24} strokeWidth={3} />
              STILL HAVE QUESTIONS?
            </div>
            {/* Decorative burst behind */}
            <svg
              className="absolute -inset-4 -z-10 w-[calc(100%+32px)] h-[calc(100%+32px)] text-primary dark:text-primary opacity-0 group-hover:opacity-100 transition-opacity"
              viewBox="0 0 100 100"
            >
              <path
                d="M50 0 L55 40 L95 25 L60 50 L95 75 L55 60 L50 100 L45 60 L5 75 L40 50 L5 25 L45 40Z"
                fill="currentColor"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
