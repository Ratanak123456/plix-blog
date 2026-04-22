"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Send } from "lucide-react";
import { useState } from "react";

export function FeedbackForm() {
  const [feedbackSent, setFeedbackSent] = useState(false);

  function handleFeedback(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedbackSent(true);
    window.setTimeout(() => setFeedbackSent(false), 4000);
  }

  return (
<section className="relative overflow-hidden py-16 md:py-24 bg-background transition-colors duration-300">
  {/* ── Halftone Background ── */}
  <div
    className="absolute inset-0 opacity-[0.06] dark:opacity-[0.1] pointer-events-none text-secondary dark:text-primary"
    style={{
      backgroundImage: "radial-gradient(circle, currentColor 1.5px, transparent 1.5px)",
      backgroundSize: "20px 20px",
    }}
  />

  {/* ── Action Lines - Top Left ── */}
  <svg className="absolute top-12 left-0 w-40 h-64 opacity-[0.08] dark:opacity-[0.15] pointer-events-none text-secondary dark:text-primary" viewBox="0 0 100 200">
    <path d="M90 0 L20 100 L95 200" stroke="currentColor" strokeWidth="3" fill="none" strokeDasharray="12 6"/>
    <path d="M70 30 L10 100 L75 170" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="8 8"/>
    <path d="M100 60 L30 100 L100 140" stroke="currentColor" strokeWidth="4" fill="none" strokeDasharray="15 5"/>
  </svg>

  {/* ── Action Lines - Bottom Right ── */}
  <svg className="absolute bottom-12 right-0 w-40 h-64 opacity-[0.08] dark:opacity-[0.15] pointer-events-none rotate-180 text-secondary dark:text-primary" viewBox="0 0 100 200">
    <path d="M90 0 L20 100 L95 200" stroke="currentColor" strokeWidth="3" fill="none" strokeDasharray="12 6"/>
    <path d="M70 30 L10 100 L75 170" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="8 8"/>
  </svg>

  <div className="container relative z-10 mx-auto max-w-2xl px-4 py-14">
    {/* Header */}
    <div className="mb-10 flex items-center gap-4">
      <div className="relative">
        <h2 className="font-bangers text-4xl text-secondary dark:text-white sm:text-5xl md:text-6xl tracking-wide relative inline-block"
          style={{ 
            textShadow: '4px 4px 0px #FFD700, 8px 8px 0px rgba(0,0,0,0.1)',
            WebkitTextStroke: '1.5px black'
          }}
        >
          SEND FEEDBACK
        </h2>
      </div>
      <div className="h-[3px] flex-1 bg-black dark:bg-primary shadow-[3px_3px_0px_0px_rgba(0,0,0,0.2)]" />
    </div>

    {/* Comic Form Panel */}
    <div className="relative bg-card dark:bg-card border-4 border-secondary dark:border-primary p-6 md:p-10 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] dark:shadow-[10px_10px_0px_0px_var(--color-primary)]">
      {/* Inner dashed border */}
      <div className="absolute inset-3 border-2 border-dashed border-gray-200 dark:border-gray-800 pointer-events-none"/>
      
      {/* Corner accents */}
      <div className="absolute -top-3 -left-3 w-8 h-8 bg-primary border-3 border-secondary z-10"/>
      <div className="absolute -bottom-3 -right-3 w-8 h-8 bg-accent border-3 border-secondary z-10"/>

      {/* Success Overlay */}
      <AnimatePresence>
        {feedbackSent && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-card/98 dark:bg-card/98 p-8 text-center border-4 border-secondary dark:border-primary m-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
          >
            <svg className="absolute -inset-8 w-[calc(100%+64px)] h-[calc(100%+64px)] text-primary dark:text-primary -z-10 opacity-50" viewBox="0 0 100 100">
              <path d="M50 0 L60 35 L95 35 L68 57 L79 91 L50 70 L21 91 L32 57 L5 35 L40 35Z" fill="currentColor" stroke="black" strokeWidth="2"/>
            </svg>
            <div className="font-bangers text-5xl text-primary sm:text-6xl"
              style={{ 
                textShadow: '3px 3px 0px #FFD700, 6px 6px 0px rgba(0,0,0,0.1)',
                WebkitTextStroke: '1px black'
              }}
            >
              THANKS!
            </div>
            <p className="font-oswald text-base uppercase tracking-wider text-gray-600 dark:text-gray-300 sm:text-xl max-w-xs">
              We read every message. Your feedback powers our next issue!
            </p>
            <div className="mt-2 font-bangers text-2xl text-accent rotate-[-3deg]">
              ISSUE #1 COMPLETE!
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleFeedback} className="relative z-10 flex flex-col gap-6">
        {/* Name & Email Row */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="relative">
            <label className="mb-2 inline-block bg-primary px-3 py-1 font-oswald text-xs font-bold uppercase tracking-wider text-white border-2 border-secondary shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              Name
            </label>
            <input
              type="text"
              placeholder="Your name"
              required
              className="w-full bg-muted dark:bg-background border-3 border-secondary dark:border-primary px-4 py-3 font-oswald text-base text-secondary dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:border-accent dark:focus:border-accent focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:focus:shadow-[4px_4px_0px_0px_var(--color-primary)] transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)]"
            />
          </div>
          <div className="relative">
            <label className="mb-2 inline-block bg-primary px-3 py-1 font-oswald text-xs font-bold uppercase tracking-wider text-white border-2 border-secondary shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              Email
            </label>
            <input
              type="email"
              placeholder="your@email.com"
              required
              className="w-full bg-muted dark:bg-background border-3 border-secondary dark:border-primary px-4 py-3 font-oswald text-base text-secondary dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:border-accent dark:focus:border-accent focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:focus:shadow-[4px_4px_0px_0px_var(--color-primary)] transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)]"
            />
          </div>
        </div>

        {/* Message Field */}
        <div className="relative">
          <label className="mb-2 inline-block bg-primary px-3 py-1 font-oswald text-xs font-bold uppercase tracking-wider text-white border-2 border-secondary shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            Message
          </label>
          <textarea
            placeholder="What's on your mind?"
            rows={5}
            required
            className="w-full resize-none bg-muted dark:bg-background border-3 border-secondary dark:border-primary px-4 py-3 font-oswald text-base text-secondary dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:border-accent dark:focus:border-accent focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:focus:shadow-[4px_4px_0px_0px_var(--color-primary)] transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)]"
            style={{ fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif' }}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="group relative flex w-full items-center justify-center gap-3 bg-accent py-4 font-bangers text-xl text-white border-4 border-secondary shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-primary sm:text-2xl mt-2"
        >
          <span className="relative z-10">SUBMIT FEEDBACK</span>
          <Send size={22} strokeWidth={3} className="transition-transform group-hover:translate-x-2 relative z-10" />
          
          {/* Button shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500"/>
        </button>
      </form>

      {/* Decorative elements */}
      <div className="absolute -top-6 right-8 bg-primary dark:bg-primary border-3 border-secondary px-3 py-1 font-bangers text-sm text-secondary shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] rotate-12 z-20">
        WRITE TO US!
      </div>
      
      <div className="absolute -bottom-4 left-8 bg-primary border-3 border-secondary px-3 py-1 font-bangers text-sm text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] -rotate-6 z-20">
        WE LISTEN!
      </div>
    </div>
  </div>
</section>
  );
}
