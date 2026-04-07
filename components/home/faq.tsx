"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, MessageSquare } from "lucide-react";
import { useState } from "react";

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
    <section className="container mx-auto px-4 py-12 md:py-16">
      <div className="container mx-auto max-w-3xl px-4 py-14 relative z-10">
        <div className="mb-10 text-center">
          <span className="inline-block bg-accent px-5 py-1.5 font-oswald text-xs font-bold uppercase tracking-[0.3em] text-background comic-border-secondary shadow-md transform -rotate-1 hover:rotate-0 transition-transform">
            Common Questions
          </span>
          <h2 className="mt-5 font-bangers text-5xl text-primary md:text-6xl drop-shadow-lg tracking-wide">
            FREQUENTLY ASKED
          </h2>
          <div className="w-24 h-1 bg-accent mx-auto mt-4 rounded-full" />
        </div>

        <div className="flex flex-col gap-5">
          {FAQS.map((faq, index) => (
            <motion.div
              key={faq.q}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
            >
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className={`flex w-full items-center gap-4 border-3 px-5 py-4 text-left transition-all duration-300 group faq-question comic-border shadow-md hover:shadow-xl ${
                  openFaq === index
                    ? "faq-question-active bg-primary border-primary"
                    : "hover:border-primary hover:bg-primary"
                }`}
              >
                <div
                  className={`p-1 rounded-full transition-all duration-300 ${openFaq === index ? "bg-white text-primary" : "bg-background text-accent group-hover:bg-white group-hover:text-primary"}`}
                >
                  <MessageSquare size={20} className="shrink-0" />
                </div>
                <span
                  className={`flex-1 font-bangers text-xl tracking-[0.05em] transition-all md:text-2xl ${openFaq === index ? "text-white drop-shadow-sm" : "group-hover:text-white text-foreground"}`}
                >
                  {faq.q}
                </span>
                <span
                  className={`w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 ${
                    openFaq === index
                      ? "text-primary bg-white rotate-180"
                      : "text-primary bg-primary/10 group-hover:bg-white group-hover:scale-110"
                  }`}
                >
                  <ChevronDown size={20} />
                </span>              </button>

              <AnimatePresence>
                {openFaq === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="overflow-hidden"
                  >
                    <div className="faq-answer-shell p-4">
                      <div className="speech-bubble faq-answer-bubble mb-0 font-sans text-base text-foreground bg-card/50 backdrop-blur-sm border-l-4 border-accent shadow-inner p-4 rounded-r-xl">
                        {faq.a}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
