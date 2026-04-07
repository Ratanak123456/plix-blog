"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Clock,
  Code2,
  Cpu,
  Eye,
  Film,
  MessageSquare,
  Send,
  ShieldCheck,
  Smartphone,
  Star,
  TrendingUp,
} from "lucide-react";
import { SiGithub, SiInstagram, SiX } from "react-icons/si";
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

const SIDE_STORIES = [
  { title: "How 5G Was Built on a Lie", tag: "Exposé", time: "8 MIN", color: "from-rose-900 to-red-600" },
  { title: "The Secret Life of Server Farms", tag: "Infrastructure", time: "5 MIN", color: "from-blue-900 to-indigo-600" },
  { title: "When Crypto Met The Mob", tag: "Investigation", time: "15 MIN", color: "from-purple-900 to-fuchsia-600" },
];

const CATEGORIES = [
  { icon: Cpu, name: "AI & Algorithms", desc: "The ghosts in the machine.", href: "#ai" },
  { icon: Code2, name: "Code & Creativity", desc: "Building the digital frontier.", href: "#code" },
  { icon: Smartphone, name: "Gadgets & Gear", desc: "Hardware that hits different.", href: "#gadgets" },
  { icon: Film, name: "Entertainment", desc: "Pixels, polygons & pop culture.", href: "#entertainment" },
  { icon: ShieldCheck, name: "Cybersecurity", desc: "Guarding the mainframe.", href: "#cybersecurity" },
];

const POPULAR_ISSUES = [
  { title: "The Death of the Passcode", cat: "CYBER", time: "4 MIN", color: "from-slate-700 to-slate-900" },
  { title: "Review: The Neural-Link Headset", cat: "GADGETS", time: "9 MIN", color: "from-amber-600 to-orange-900" },
  { title: "Hollywood's AI Writer Strike", cat: "ENTERTAIN", time: "7 MIN", color: "from-pink-800 to-rose-600" },
  { title: "Open Source vs Big Tech: Round 2", cat: "CODE", time: "6 MIN", color: "from-teal-800 to-cyan-600" },
];

export default function Page() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [feedbackSent, setFeedbackSent] = useState(false);

  function handleFeedback(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedbackSent(true);
    window.setTimeout(() => setFeedbackSent(false), 4000);
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground transition-colors duration-300">
      <main>
        <section className="container mx-auto px-4 py-12 md:py-16">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden bg-card p-4 md:p-8 comic-border halftone-bg"
          >
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20" />
            <div className="relative z-10 flex flex-col items-center gap-8 md:flex-row">
              <div className="flex-1 space-y-5">
                <div className="inline-block -rotate-2 bg-primary px-4 py-1 font-bangers text-xl text-background comic-border-secondary">
                  DAILY ISSUE #402
                </div>
                <h1 className="font-bangers text-6xl leading-none uppercase drop-shadow-[4px_4px_0px_hsl(var(--secondary))] md:text-8xl">
                  The Silicon <br />
                  <span className="text-accent">Awakening</span>
                </h1>
                <div className="inline-block max-w-lg p-4 font-oswald text-xl text-foreground md:p-5 speech-bubble">
                  &quot;AI chips are eating the world — and we&apos;ve got the full origin story inside.&quot;
                </div>
                <div className="pt-4">
                  <a
                    href="#"
                    className="inline-flex items-center gap-3 bg-accent px-8 py-4 font-bangers text-2xl text-background transition-all hover:-translate-y-2 hover:rotate-1 hover:shadow-lg comic-border"
                  >
                    READ THE FULL STRIP <ArrowRight size={22} />
                  </a>
                </div>
              </div>
              <div className="w-full flex-1">
                <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden bg-gradient-to-tr from-indigo-900 via-primary/50 to-accent comic-border-accent md:aspect-[4/3]">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    className="flex h-32 w-32 items-center justify-center rounded-lg border-[8px] border-background/50 md:h-64 md:w-64"
                  >
                    <div className="h-16 w-16 rounded-full bg-accent/80 blur-xl md:h-32 md:w-32" />
                  </motion.div>
                  <div className="pointer-events-none absolute inset-0 z-10 border-[16px] border-card/20" />
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        <section className="container mx-auto px-4 py-10">
          <div className="mb-6 flex items-center gap-4">
            <TrendingUp size={28} className="shrink-0 text-accent" />
            <h2 className="whitespace-nowrap font-bangers text-4xl text-primary md:text-5xl">TODAY&apos;S MOST READ</h2>
            <div className="h-1 flex-1 bg-secondary" />
          </div>
          <motion.article initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="group cursor-pointer">
            <div className="flex flex-col overflow-hidden bg-card transition-colors hover:border-accent md:flex-row comic-border">
              <div className="relative aspect-video min-h-[240px] overflow-hidden bg-gradient-to-br from-violet-900 via-purple-700 to-accent/70 md:w-2/5 md:aspect-auto">
                <div className="absolute inset-0 opacity-30 halftone-bg" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{ scale: [1, 1.08, 1] }}
                    transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                    className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-primary/60 md:h-36 md:w-36"
                  >
                    <Eye size={40} className="text-primary/80" />
                  </motion.div>
                </div>
                <div className="absolute top-4 left-4 bg-accent px-3 py-1 font-bangers text-lg text-background comic-border-secondary">
                  #1 TODAY
                </div>
              </div>
              <div className="flex flex-1 flex-col justify-center p-6 md:p-10">
                <div className="mb-4 flex flex-wrap gap-3">
                  <span className="bg-secondary px-3 py-1 font-oswald text-sm uppercase text-background comic-border-accent">
                    Exclusive
                  </span>
                  <span className="flex items-center gap-1 py-1 font-oswald text-sm text-muted-foreground">
                    <Clock size={14} /> 11 MIN READ
                  </span>
                  <span className="flex items-center gap-1 py-1 font-oswald text-sm text-accent">
                    <Eye size={14} /> 48.2k views
                  </span>
                </div>
                <h3 className="mb-4 font-bangers text-4xl leading-tight transition-colors group-hover:text-accent md:text-6xl">
                  The Algorithm That Broke Democracy
                </h3>
                <p className="mb-6 max-w-2xl font-sans text-lg text-muted-foreground">
                  A whistleblower inside a major social platform reveals how a single recommendation model rewired political discourse across 40 countries — and why it was never shut down.
                </p>
                <a href="#" className="inline-flex items-center gap-2 font-bangers text-xl text-accent transition-colors hover:text-primary">
                  CONTINUE READING <ArrowRight size={20} />
                </a>
              </div>
            </div>
          </motion.article>
        </section>

        <section className="container mx-auto px-4 py-10">
          <div className="mb-6 flex items-center gap-4">
            <h2 className="whitespace-nowrap font-bangers text-4xl text-primary md:text-5xl">ORIGIN STORIES</h2>
            <div className="h-1 flex-1 bg-secondary" />
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <motion.article initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="group cursor-pointer lg:col-span-2">
              <div className="flex h-full flex-col overflow-hidden bg-muted transition-colors hover:border-primary comic-border-secondary">
                <div className="relative aspect-video w-full overflow-hidden bg-gradient-to-br from-cyan-900 to-emerald-800 md:aspect-[21/9]">
                  <div className="absolute inset-0 opacity-30 halftone-bg" />
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-900 to-emerald-800 transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="relative z-10 -mt-10 flex flex-1 flex-col justify-end border-t-4 border-secondary bg-card p-6 transition-colors group-hover:border-primary md:p-8">
                  <div className="mb-3 flex gap-3">
                    <span className="bg-secondary px-3 py-1 font-oswald text-sm font-bold uppercase text-background comic-border-accent">
                      Deep Dive
                    </span>
                    <span className="py-1 font-oswald text-sm text-muted-foreground">12 MIN READ</span>
                  </div>
                  <h3 className="mb-4 font-bangers text-4xl transition-colors group-hover:text-accent md:text-5xl">
                    The Man Who Taught Machines to Dream
                  </h3>
                  <p className="line-clamp-3 font-sans text-lg text-muted-foreground">
                    Before neural networks were mainstream, one rogue engineer decided to feed a supercomputer nothing but classic comic books. The results were terrifyingly beautiful.
                  </p>
                </div>
              </div>
            </motion.article>

            <div className="flex flex-col gap-5">
              {SIDE_STORIES.map((post, index) => (
                <motion.article
                  key={post.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-4 bg-card p-4 transition-all hover:-translate-y-1 hover:border-primary comic-border-secondary group cursor-pointer"
                >
                  <div className={`h-24 w-24 shrink-0 bg-gradient-to-br ${post.color} comic-border-accent`} />
                  <div className="flex flex-col justify-center">
                    <div className="mb-1 flex gap-2 font-oswald text-xs uppercase">
                      <span className="text-accent">{post.tag}</span>
                      <span className="text-muted-foreground">• {post.time}</span>
                    </div>
                    <h4 className="font-bangers text-2xl leading-tight transition-colors group-hover:text-primary">
                      {post.title}
                    </h4>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section id="ai" className="relative my-10 border-y-4 border-secondary bg-muted/30 py-14">
          <div className="pointer-events-none absolute inset-0 opacity-15 halftone-bg" />
          <div className="relative z-10 container mx-auto px-4">
            <h2 className="mb-10 text-center font-bangers text-4xl drop-shadow-[2px_2px_0px_hsl(var(--primary))]">
              CHOOSE YOUR ADVENTURE
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-5">
              {CATEGORIES.map((category, index) => {
                const Icon = category.icon;

                return (
                  <motion.a
                    href={category.href}
                    key={category.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="relative flex flex-col items-center overflow-hidden bg-card p-6 text-center transition-all duration-300 hover:scale-105 hover:border-accent hover:shadow-coral comic-border group"
                  >
                    <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-10 halftone-bg" />
                    <Icon size={44} className="mb-4 text-primary transition-colors group-hover:text-accent" />
                    <h3 className="mb-2 font-bangers text-2xl">{category.name}</h3>
                    <p className="mb-4 font-sans text-sm text-muted-foreground">{category.desc}</p>
                    <span className="flex items-center gap-1 font-oswald text-sm text-accent transition-all group-hover:gap-2">
                      Explore <ArrowRight size={14} />
                    </span>
                  </motion.a>
                );
              })}
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-10">
          <div className="mb-8 flex items-center gap-4">
            <h2 className="whitespace-nowrap font-bangers text-4xl text-primary md:text-5xl">POPULAR ISSUES</h2>
            <div className="h-1 flex-1 bg-secondary" />
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {POPULAR_ISSUES.map((post, index) => (
              <motion.article
                key={post.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex cursor-pointer flex-col group"
              >
                <div className={`relative mb-4 aspect-[3/2] w-full overflow-hidden bg-gradient-to-br ${post.color} comic-border`}>
                  <div className="absolute inset-0 opacity-20 halftone-bg" />
                  <div className="absolute top-3 left-3 rotate-[-2deg] bg-accent px-2 py-0.5 font-bangers text-sm text-background transition-transform group-hover:rotate-0 comic-border-secondary">
                    {post.cat}
                  </div>
                </div>
                <div className="mb-1 flex items-center gap-2 font-oswald text-xs font-bold uppercase text-primary">
                  <Clock size={12} /> {post.time} READ
                </div>
                <h3 className="font-bangers text-2xl leading-tight transition-colors group-hover:text-accent">{post.title}</h3>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="container mx-auto max-w-4xl px-4 py-10">
          <div className="mb-8 flex items-center gap-4">
            <MessageSquare size={28} className="shrink-0 text-accent" />
            <h2 className="whitespace-nowrap font-bangers text-4xl text-primary md:text-5xl">FAQ</h2>
            <div className="h-1 flex-1 bg-secondary" />
          </div>
          <div className="flex flex-col gap-4">
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
                  className="flex w-full items-center justify-between gap-4 bg-card p-5 text-left transition-colors hover:border-accent comic-border group"
                >
                  <span className="font-bangers text-xl transition-colors group-hover:text-accent md:text-2xl">{faq.q}</span>
                  <span className={`text-2xl ${openFaq === index ? "text-accent" : "text-primary"}`}>
                    {openFaq === index ? "−" : "+"}
                  </span>
                </button>
                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="border-l-4 border-t-0 border-primary bg-muted/40 p-5 font-sans text-base text-muted-foreground faq-bubble">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="border-y-4 border-secondary bg-muted/20 py-14">
          <div className="container mx-auto px-4">
            <div className="mb-10 flex items-center gap-4">
              <h2 className="whitespace-nowrap font-bangers text-4xl text-primary md:text-5xl">READER REVIEWS</h2>
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
                          className={starIndex < review.rating ? "fill-primary text-primary" : "text-muted-foreground"}
                        />
                      ))}
                    </div>
                    <p className="mb-4 font-sans text-base italic text-foreground">&quot;{review.text}&quot;</p>
                    <div className="mt-4 flex items-center gap-3 border-t border-border pt-4">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${review.avatarColor} font-bangers text-sm text-white`}
                      >
                        {review.avatar}
                      </div>
                      <div>
                        <div className="font-bangers text-lg leading-tight">{review.name}</div>
                        <div className="font-oswald text-xs text-accent">{review.handle}</div>
                      </div>
                    </div>
                  </div>
                  <div className="review-tail" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="container mx-auto max-w-2xl px-4 py-14">
          <div className="mb-8 flex items-center gap-4">
            <h2 className="whitespace-nowrap font-bangers text-4xl text-primary md:text-5xl">SEND FEEDBACK</h2>
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
                  <div className="font-bangers text-5xl text-accent">THANKS!</div>
                  <p className="font-oswald text-xl uppercase text-muted-foreground">
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
                className="group flex w-full items-center justify-center gap-3 bg-accent py-4 font-bangers text-2xl text-background transition-colors hover:bg-primary comic-border"
              >
                SUBMIT FEEDBACK <Send size={20} className="transition-transform group-hover:translate-x-1" />
              </button>
            </form>
          </div>
        </section>
      </main>

      <footer id="about" className="relative mt-4 overflow-hidden py-12" style={{ backgroundColor: "#F0B443" }}>
        <div
          className="pointer-events-none absolute inset-0"
          style={{ backgroundImage: "radial-gradient(rgba(0,0,0,0.12) 2px, transparent 2px)", backgroundSize: "12px 12px" }}
        />
        <div className="relative z-10 container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
            <div className="flex flex-col items-center gap-1 md:items-start">
              <span className="font-bangers text-5xl drop-shadow-[2px_2px_0px_rgba(0,0,0,0.3)]" style={{ color: "#1a1a1a" }}>
                PLIXBLOG
              </span>
              <p className="font-oswald text-sm uppercase tracking-widest" style={{ color: "#3a3a3a" }}>
                Every piece of tech has an origin story.
              </p>
            </div>

            <nav className="flex flex-wrap justify-center gap-6 font-oswald text-lg uppercase" style={{ color: "#1a1a1a" }}>
              {["About", "Privacy", "Advertise", "Contact"].map((link) => (
                <a key={link} href="#" className="transition-colors hover:opacity-70" style={{ color: "#1a1a1a" }}>
                  {link}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              {[SiX, SiGithub, SiInstagram].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="flex h-11 w-11 items-center justify-center transition-all hover:-translate-y-1 comic-border"
                  style={{ backgroundColor: "#1a1a1a", color: "#F0B443" }}
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          <div className="mt-10 text-center font-sans text-sm" style={{ color: "#3a3a3a" }}>
            © {new Date().getFullYear()} PlixBlog Universe. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
