"use client";

import { motion } from "framer-motion";
import { ArrowRight, HeartHandshake, NotebookText, Sparkles, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const VALUES = [
  {
    icon: Sparkles,
    title: "Story-First Tech",
    text: "We cover technology like it shapes culture, identity, and power, not just product launch cycles.",
  },
  {
    icon: NotebookText,
    title: "Editorial Depth",
    text: "Every issue mixes quick reads with long-form origin stories so readers get context, not noise.",
  },
  {
    icon: HeartHandshake,
    title: "Human Voice",
    text: "PlixBlog keeps the reporting sharp, visual, and personal instead of flattening everything into generic tech copy.",
  },
];

const TEAM = [
  {
    name: "Mina Hart",
    role: "Editor-in-Chief",
    bio: "Builds each issue around the intersection of design, media, and the machines shaping daily life.",
    tone: "from-amber-500 to-rose-500",
  },
  {
    name: "Jules Mercer",
    role: "Features Director",
    bio: "Leads deep dives into AI, software culture, and the people behind the code that changes everything.",
    tone: "from-cyan-500 to-blue-600",
  },
  {
    name: "Ari Sol",
    role: "Visual Story Lead",
    bio: "Translates dense technical ideas into panels, layouts, and visual systems that feel alive.",
    tone: "from-violet-500 to-fuchsia-600",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <section className="container mx-auto px-4 py-12 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden bg-card p-6 md:p-10 comic-border halftone-bg"
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/15 via-transparent to-accent/15" />
          <div className="relative z-10 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div>
              <div className="mb-4 inline-block -rotate-2 bg-primary px-4 py-1 font-bangers text-xl text-background comic-border-secondary">
                ISSUE DOSSIER
              </div>
              <h1 className="font-bangers text-5xl leading-none uppercase drop-shadow-[4px_4px_0px_hsl(var(--secondary))] md:text-7xl">
                About <span className="text-accent">PlixBlog</span>
              </h1>
              <p className="mt-6 max-w-2xl font-sans text-lg text-muted-foreground">
                PlixBlog is a comic-tech publication built for readers who want sharper reporting, stronger design, and
                stories that connect hardware, software, culture, and people.
              </p>
              <p className="mt-4 max-w-2xl font-sans text-lg text-muted-foreground">
                We treat each article like an origin story: where it started, who shaped it, what changed, and why it
                matters now.
              </p>
              <div className="mt-8">
                <a
                  href="/#blog"
                  className="inline-flex items-center gap-2 bg-accent px-6 py-3 font-bangers text-xl text-background transition-colors hover:bg-primary comic-border"
                >
                  READ THE LATEST ISSUE <ArrowRight size={18} />
                </a>
              </div>
            </div>

            <div className="grid gap-4">
              <Card className="border-primary bg-background/80 comic-border">
                <CardContent className="p-6">
                  <div className="mb-3 flex items-center gap-3">
                    <Users className="text-accent" size={24} />
                    <h2 className="font-bangers text-3xl text-primary">Who We Write For</h2>
                  </div>
                  <p className="font-sans text-muted-foreground">
                    Curious builders, designers, developers, readers, and anyone tired of flat, forgettable tech
                    content.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-secondary bg-background/80 comic-border-secondary">
                <CardContent className="p-6">
                  <div className="mb-3 font-oswald text-sm uppercase tracking-[0.25em] text-accent">Our Promise</div>
                  <p className="font-sans text-muted-foreground">
                    Less hype. More signal. Better taste. Every page should feel informed, visual, and intentional.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="container mx-auto px-4 py-10">
        <div className="mb-8 flex items-center gap-4">
          <h2 className="whitespace-nowrap font-bangers text-4xl text-primary md:text-5xl">OUR VALUES</h2>
          <div className="h-1 flex-1 bg-secondary" />
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {VALUES.map((value, index) => {
            const Icon = value.icon;
            return (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full border-primary bg-card comic-border">
                  <CardHeader className="p-6 pb-0">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Icon size={28} />
                    </div>
                    <CardTitle className="font-bangers text-3xl">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 pt-4">
                    <p className="font-sans text-base text-muted-foreground">{value.text}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="container mx-auto px-4 py-10">
        <div className="mb-8 flex items-center gap-4">
          <h2 className="whitespace-nowrap font-bangers text-4xl text-primary md:text-5xl">THE TEAM</h2>
          <div className="h-1 flex-1 bg-secondary" />
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {TEAM.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full border-primary bg-card comic-border">
                <CardContent className="p-6">
                  <div
                    className={`mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br ${member.tone} font-bangers text-2xl text-white`}
                  >
                    {member.name
                      .split(" ")
                      .map((part) => part[0])
                      .join("")}
                  </div>
                  <h3 className="font-bangers text-3xl">{member.name}</h3>
                  <p className="mt-1 font-oswald text-sm uppercase tracking-[0.18em] text-accent">{member.role}</p>
                  <p className="mt-4 font-sans text-muted-foreground">{member.bio}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-14">
        <Card className="border-accent bg-card comic-border-accent">
          <CardContent className="flex flex-col items-start justify-between gap-6 p-8 md:flex-row md:items-center">
            <div>
              <p className="font-oswald text-sm uppercase tracking-[0.25em] text-muted-foreground">Join The Universe</p>
              <h2 className="mt-2 font-bangers text-4xl text-primary">Follow the stories behind the screens.</h2>
            </div>
            <a
              href="/#blog"
              className="inline-flex items-center gap-2 bg-accent px-6 py-3 font-bangers text-xl text-background transition-colors hover:bg-primary comic-border"
            >
              Back To Blog <ArrowRight size={18} />
            </a>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
