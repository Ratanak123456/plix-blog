"use client";

import { motion } from "framer-motion";
import { Mail, MapPin, Megaphone, Send, Sparkles, Target, Users2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const WHO_WE_ARE = [
  "A student-built blogging platform made for sharing ideas, opinions, and creative work in one clean space.",
  "A place where readers can discover stories that feel personal, simple to follow, and worth coming back to.",
];

const MISSION_POINTS = [
  "Create a friendly blog experience that feels easy for both writers and readers.",
  "Give every member of the community a space to publish, connect, and grow their voice.",
  "Keep improving the platform with better design, better usability, and clearer storytelling.",
];

const FEMALE_MENTOR = {
  name: "Dr. Lina Vichea",
  role: "Lead Mentor",
  summary:
    "Guides the team with structure, calm decision-making, and the kind of feedback that keeps the work moving in the right direction.",
  focus: ["Project direction", "Team confidence", "Presentation quality"],
  accent: "from-rose-400 via-orange-300 to-amber-200",
};

const MALE_MENTORS = [
  {
    name: "Mr. Dara Sok",
    role: "Technical Mentor",
    summary:
      "Supports the product side of the project and helps turn early ideas into practical features the team can build.",
    focus: ["Feature planning", "System thinking", "Technical advice"],
    accent: "from-sky-400 via-cyan-300 to-teal-200",
  },
  {
    name: "Mr. Visal Heng",
    role: "Development Mentor",
    summary:
      "Keeps the team focused on execution, code quality, and building a website that feels consistent across devices.",
    focus: ["Frontend review", "Code discipline", "Responsive design"],
    accent: "from-emerald-400 via-lime-300 to-amber-200",
  },
];

const TEAM = [
  {
    name: "Sokchea N.",
    role: "Frontend Designer",
    bio: "Shapes the page layouts, visual style, and the small details that make the site feel polished.",
    accent: "from-amber-500 to-orange-500",
  },
  {
    name: "Malis P.",
    role: "Content Planner",
    bio: "Organizes page content and helps keep the message clear, friendly, and easy for visitors to understand.",
    accent: "from-rose-500 to-pink-500",
  },
  {
    name: "Rith K.",
    role: "Frontend Developer",
    bio: "Builds responsive sections and turns the design ideas into interfaces that work across screen sizes.",
    accent: "from-cyan-500 to-blue-600",
  },
  {
    name: "Vannak T.",
    role: "Project Coordinator",
    bio: "Keeps the team aligned, tracks progress, and makes sure the final result feels complete and presentable.",
    accent: "from-emerald-500 to-teal-600",
  },
];

function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="font-oswald text-sm uppercase tracking-[0.28em] text-accent">{eyebrow}</p>
      <h2 className="mt-3 font-bangers text-4xl leading-none text-primary md:text-5xl">{title}</h2>
      {subtitle ? <p className="mt-4 text-base leading-7 text-muted-foreground md:text-lg">{subtitle}</p> : null}
    </div>
  );
}

export default function AboutPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <section className="container mx-auto px-4 pb-8 pt-12 md:pb-10 md:pt-16">
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden bg-card p-6 comic-border halftone-bg md:p-10"
        >
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,hsl(var(--primary)/0.18),transparent_45%,hsl(var(--accent)/0.18))]" />
          <div className="relative z-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <div className="inline-flex -rotate-2 items-center gap-2 bg-primary px-4 py-1 font-bangers text-xl text-primary-foreground comic-border-secondary">
                <Sparkles size={18} />
                ABOUT THIS WEBSITE
              </div>
              <h1 className="mt-6 font-bangers text-5xl leading-none text-primary drop-shadow-[4px_4px_0px_hsl(var(--secondary))] md:text-7xl">
                Meet <span className="text-accent">PlixBlog</span>
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
                PlixBlog is a student project website built to share blog content in a way that feels modern,
                welcoming, and easy to explore. It gives readers a place to discover stories and gives writers a place
                to publish their ideas with confidence.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
              <Card className="border-primary bg-background/85 comic-border">
                <CardContent className="p-6">
                  <p className="font-oswald text-xs uppercase tracking-[0.3em] text-accent">Built For</p>
                  <p className="mt-3 text-base leading-7 text-muted-foreground">
                    Students, creative thinkers, and readers who want a simple blog experience with a stronger visual
                    identity.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-secondary bg-background/85 comic-border-secondary">
                <CardContent className="p-6">
                  <p className="font-oswald text-xs uppercase tracking-[0.3em] text-primary">What Makes It Different</p>
                  <p className="mt-3 text-base leading-7 text-muted-foreground">
                    The platform combines personality, readability, and responsive design instead of feeling like a
                    default template.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="container mx-auto px-4 py-8 md:py-10">
        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <Card className="border-primary bg-card comic-border">
            <CardContent className="p-6 md:p-8">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Users2 size={28} />
              </div>
              <SectionHeading eyebrow="Section One" title="Who We Are" />
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            {WHO_WE_ARE.map((item, index) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: index * 0.08 }}
              >
                <Card className="h-full border-accent bg-card comic-border-accent">
                  <CardContent className="p-6 md:p-8">
                    <p className="font-bangers text-2xl text-primary">0{index + 1}</p>
                    <p className="mt-4 text-base leading-7 text-muted-foreground">{item}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8 md:py-10">
        <div className="relative overflow-hidden bg-card p-6 comic-border-secondary md:p-10">
          <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/3 bg-[radial-gradient(circle_at_center,hsl(var(--accent)/0.16),transparent_68%)] md:block" />
          <div className="relative z-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/15 text-accent">
                <Target size={28} />
              </div>
              <SectionHeading
                eyebrow="Our Mission"
                title="A Better Place To Read, Write, And Connect"
                subtitle="The goal is not only to publish content, but to build a blog platform that feels useful, readable, and memorable."
              />
            </div>

            <div className="grid gap-4">
              {MISSION_POINTS.map((point, index) => (
                <motion.div
                  key={point}
                  initial={{ opacity: 0, x: 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ delay: index * 0.08 }}
                  className="speech-bubble p-5 md:p-6"
                >
                  <div className="flex items-start gap-4">
                    <span className="mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary font-bangers text-lg text-primary-foreground">
                      {index + 1}
                    </span>
                    <p className="text-base leading-7 text-muted-foreground">{point}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8 md:py-10">
        <SectionHeading
          eyebrow="Our Mentors"
          title="Guidance Behind The Project"
          subtitle="This project is supported by mentors who shape the direction, quality, and confidence of the team."
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          className="mt-8"
        >
          <Card className="overflow-hidden border-primary bg-card comic-border">
            <CardContent className="grid gap-6 p-0 lg:grid-cols-[0.95fr_1.05fr]">
              <div className={`min-h-[220px] bg-gradient-to-br ${FEMALE_MENTOR.accent} p-6 md:p-8`}>
                <p className="font-oswald text-sm uppercase tracking-[0.28em] text-black/65">Female Mentor</p>
                <h3 className="mt-4 font-bangers text-5xl leading-none text-black">{FEMALE_MENTOR.name}</h3>
                <p className="mt-3 text-sm font-semibold uppercase tracking-[0.2em] text-black/70">
                  {FEMALE_MENTOR.role}
                </p>
              </div>
              <div className="p-6 md:p-8">
                <p className="text-base leading-7 text-muted-foreground">{FEMALE_MENTOR.summary}</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  {FEMALE_MENTOR.focus.map((item) => (
                    <span
                      key={item}
                      className="inline-flex items-center rounded-full border border-primary bg-primary/10 px-4 py-2 text-sm font-medium text-foreground"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {MALE_MENTORS.map((mentor, index) => (
            <motion.div
              key={mentor.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ delay: index * 0.08 }}
            >
              <Card className="h-full overflow-hidden border-secondary bg-card comic-border-secondary">
                <CardContent className="p-0">
                  <div className={`p-6 md:p-8 bg-gradient-to-br ${mentor.accent}`}>
                    <p className="font-oswald text-sm uppercase tracking-[0.28em] text-black/65">
                      Male Mentor 0{index + 1}
                    </p>
                    <h3 className="mt-4 font-bangers text-4xl leading-none text-black">{mentor.name}</h3>
                    <p className="mt-3 text-sm font-semibold uppercase tracking-[0.2em] text-black/70">{mentor.role}</p>
                  </div>
                  <div className="p-6 md:p-8">
                    <p className="text-base leading-7 text-muted-foreground">{mentor.summary}</p>
                    <div className="mt-6 grid gap-3 sm:grid-cols-3">
                      {mentor.focus.map((item) => (
                        <div
                          key={item}
                          className="rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium text-foreground"
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-8 md:py-10">
        <SectionHeading
          eyebrow="Team Section"
          title="The People Building It"
          subtitle="The team section uses a responsive grid: 4 cards on laptop, 2 on tablet, and 1 on phone."
        />

        <div className="mt-8 grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
          {TEAM.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ delay: index * 0.06 }}
            >
              <Card className="h-full border-primary bg-card comic-border">
                <CardContent className="p-6">
                  <div
                    className={`flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br ${member.accent} font-bangers text-2xl text-white`}
                  >
                    {member.name
                      .split(" ")
                      .map((part) => part[0])
                      .join("")}
                  </div>
                  <h3 className="mt-5 font-bangers text-3xl leading-none text-primary">{member.name}</h3>
                  <p className="mt-2 font-oswald text-sm uppercase tracking-[0.2em] text-accent">{member.role}</p>
                  <p className="mt-4 text-base leading-7 text-muted-foreground">{member.bio}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 pb-14 pt-8 md:pb-16 md:pt-10">
        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <Card className="border-accent bg-card comic-border-accent">
            <CardContent className="p-6 md:p-8">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/15 text-accent">
                <Megaphone size={28} />
              </div>
              <SectionHeading
                eyebrow="Get In Touch"
                title="Send Us A Message"
                subtitle="If a visitor wants to ask a question, share feedback, or contact the team, this section gives them a clear way to do it."
              />

              <div className="mt-8 grid gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-primary" />
                  <span>contact@plixblog.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin size={18} className="text-primary" />
                  <span>Phnom Penh, Cambodia</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary bg-card comic-border">
            <CardContent className="p-6 md:p-8">
              <form className="grid gap-5">
                <div className="grid gap-5 md:grid-cols-2">
                  <div className="grid gap-2">
                    <label htmlFor="name" className="font-oswald text-sm uppercase tracking-[0.18em] text-primary">
                      Full Name
                    </label>
                    <Input id="name" name="name" placeholder="Enter your full name" className="h-11 rounded-none bg-background" />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="email" className="font-oswald text-sm uppercase tracking-[0.18em] text-primary">
                      Email
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      className="h-11 rounded-none bg-background"
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <label htmlFor="subject" className="font-oswald text-sm uppercase tracking-[0.18em] text-primary">
                    Subject
                  </label>
                  <Input id="subject" name="subject" placeholder="What would you like to talk about?" className="h-11 rounded-none bg-background" />
                </div>

                <div className="grid gap-2">
                  <label htmlFor="message" className="font-oswald text-sm uppercase tracking-[0.18em] text-primary">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Write your message here..."
                    className="min-h-36 rounded-none bg-background"
                  />
                </div>

                <Button type="submit" size="lg" className="mt-2 h-11 rounded-none font-oswald text-sm uppercase tracking-[0.22em]">
                  Send Message
                  <Send size={16} />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
