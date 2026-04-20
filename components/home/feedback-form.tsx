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
    <section className="container mx-auto max-w-2xl px-4 py-14">
      <div className="mb-8 flex items-center gap-4">
        <h2 className="font-bangers text-3xl text-primary sm:text-4xl md:text-5xl">
          SEND FEEDBACK
        </h2>
        <div className="h-1 flex-1 bg-secondary" />
      </div>
      <div className="relative bg-card p-6 md:p-10 comic-border">
        <div className="pointer-events-none absolute top-0 left-0 h-full w-full -translate-x-1 -translate-y-1 border-[3px] border-secondary" />
        <AnimatePresence>
          {feedbackSent && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-card/95 p-8 text-center"
            >
              <div className="font-bangers text-4xl text-accent sm:text-5xl">
                THANKS!
              </div>
              <p className="font-oswald text-base uppercase text-muted-foreground sm:text-xl">
                Thanks for your feedback! We read every message.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
        <form onSubmit={handleFeedback} className="flex flex-col gap-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block font-oswald text-xs uppercase tracking-wider text-muted-foreground">
                Name
              </label>
              <input
                type="text"
                placeholder="Your name"
                required
                className="w-full bg-background px-4 py-3 font-oswald text-base text-foreground transition-colors placeholder:text-muted-foreground/60 focus:border-accent focus:outline-none comic-border"
              />
            </div>
            <div>
              <label className="mb-1 block font-oswald text-xs uppercase tracking-wider text-muted-foreground">
                Email
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                required
                className="w-full bg-background px-4 py-3 font-oswald text-base text-foreground transition-colors placeholder:text-muted-foreground/60 focus:border-accent focus:outline-none comic-border"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block font-oswald text-xs uppercase tracking-wider text-muted-foreground">
              Message
            </label>
            <textarea
              placeholder="What's on your mind?"
              rows={5}
              required
              className="w-full resize-none bg-background px-4 py-3 font-oswald text-base text-foreground transition-colors placeholder:text-muted-foreground/60 focus:border-accent focus:outline-none comic-border"
            />
          </div>
          <button
            type="submit"
            className="group flex w-full items-center justify-center gap-3 bg-accent py-4 font-bangers text-xl text-background transition-colors hover:bg-primary sm:text-2xl comic-border"
          >
            SUBMIT FEEDBACK{" "}
            <Send
              size={20}
              className="transition-transform group-hover:translate-x-1"
            />
          </button>
        </form>
      </div>
    </section>
  );
}
