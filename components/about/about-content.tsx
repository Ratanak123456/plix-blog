"use client";

import { motion } from "framer-motion";
import { BookOpen, Sparkles, Target, Users, Zap } from "lucide-react";
import Image from "next/image";
import { FaFacebook, FaGithub } from "react-icons/fa";

const mentors = [
  {
    name: "Mom Reksmey",
    role: "Frontend",
    image: "/about/teacher1.png",
    accent: "bg-accent",
    facebook: "https://www.facebook.com/mom.reksmey.12",
    github: "https://github.com/Reksmeys",
  },
  {
    name: "Chan Chhaya",
    role: "Backend",
    image: "/about/Chhaya.jpg",
    accent: "bg-primary",
    facebook: "https://www.facebook.com/chhayadevkh",
    github: "https://github.com/it-chhaya",
  },
  {
    name: "Kit Tara",
    role: "Database",
    image: "/about/teacher3.png",
    accent: "bg-secondary",
    facebook: "https://www.facebook.com/drksearcherz",
    github: "https://github.com",
  },
];

const teamMembers = [
  {
    name: "Saren Ratanak",
    role: "Leader",
    image: "/about/leader.jpg",
    facebook: "https://www.facebook.com/mrr.nak.5264382/",
    github: "https://github.com/Ratanak123456",
  },
  {
    name: "Khann Kanhchana",
    role: "Sub Leader",
    image: "/about/subleader.jpg",
    facebook: "https://www.facebook.com/kanh.chana.9277",
    github: "https://github.com/khannkanhchana",
  },
  {
    name: "Man Tolfary",
    role: "Member",
    image: "/about/member2.jpg",
    facebook: "https://facebook.com",
    github: "https://github.com/mantolfary",
  },
  {
    name: "Heang Minea",
    role: "Member",
    image: "/about/member1.png",
    facebook: "https://facebook.com",
    github: "https://github.com/hahaxd-a69",
  },
];

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="space-y-4">
      <div className="inline-block comic-border bg-primary px-3 py-1 font-oswald text-xs font-bold uppercase tracking-[0.2em] text-primary-foreground shadow-sm">
        {eyebrow}
      </div>
      <h2 className="font-bangers text-4xl text-primary md:text-5xl">
        {title}
      </h2>
      <p className="max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">
        {description}
      </p>
    </div>
  );
}

function PersonCard({
  name,
  role,
  image,
  accent = "bg-secondary",
  facebook,
  github,
}: {
  name: string;
  role: string;
  image: string;
  accent?: string;
  facebook?: string;
  github?: string;
}) {
  return (
    <article className="group relative mx-auto w-full max-w-[280px] overflow-visible comic-border bg-card p-4 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:rotate-2 hover:shadow-2xl">
      {/* Decorative square corner */}
      <div
        className={`absolute -right-2 -top-2 h-6 w-6 rotate-12 border-2 border-foreground ${accent} z-10 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`}
      />

      {/* Badge/Role Tag */}
      <div className="absolute -left-3 top-4 z-20 -rotate-12 border-2 border-foreground bg-primary px-3 py-1 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
        <p className="font-oswald text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
          {role}
        </p>
      </div>

      <div className="relative aspect-[4/5] overflow-hidden comic-border-secondary bg-muted">
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, 280px"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted-foreground/10">
            <p className="font-bangers text-5xl text-muted-foreground opacity-20">
              ?
            </p>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-white/10 opacity-0 transition-opacity group-hover:opacity-100" />
      </div>

      <div className="mt-4 text-center">
        <h3 className="line-clamp-1 font-bangers text-2xl text-foreground drop-shadow-sm">
          {name}
        </h3>
        {(facebook || github) && (
          <div className="mt-3 flex justify-center gap-3">
            {facebook && (
              <a
                href={facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center border-2 border-foreground bg-muted shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-1 hover:bg-accent hover:text-accent-foreground active:translate-y-0 active:shadow-none"
              >
                <FaFacebook className="text-base" />
              </a>
            )}
            {github && (
              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center border-2 border-foreground bg-muted shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-1 hover:bg-accent hover:text-accent-foreground active:translate-y-0 active:shadow-none"
              >
                <FaGithub className="text-base" />
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

export default function AboutContent() {
  return (
    <main className="overflow-x-hidden  dark:bg-gray-950 text-foreground ">
      {/* Hero Section */}
      <section className="relative border-b-8 border-black dark:border-white bg-white dark:bg-gray-900 overflow-hidden">
        {/* Halftone Background */}
        <div
          className="absolute inset-0 opacity-[0.06] dark:opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, black 1.5px, transparent 1.5px)",
            backgroundSize: "20px 20px",
          }}
        />

        {/* Action Lines - Left */}
        <svg
          className="absolute top-0 left-0 w-40 h-full opacity-[0.07] dark:opacity-[0.04] pointer-events-none"
          viewBox="0 0 100 400"
          preserveAspectRatio="none"
        >
          <path
            d="M80 0 L20 200 L85 400"
            stroke="black"
            strokeWidth="3"
            fill="none"
            strokeDasharray="12 6"
          />
          <path
            d="M60 50 L10 200 L70 350"
            stroke="black"
            strokeWidth="2"
            fill="none"
            strokeDasharray="8 8"
          />
        </svg>

        {/* Action Lines - Right */}
        <svg
          className="absolute top-0 right-0 w-40 h-full opacity-[0.07] dark:opacity-[0.04] pointer-events-none rotate-180"
          viewBox="0 0 100 400"
          preserveAspectRatio="none"
        >
          <path
            d="M80 0 L20 200 L85 400"
            stroke="black"
            strokeWidth="3"
            fill="none"
            strokeDasharray="12 6"
          />
        </svg>

        {/* Floating Sound Effects */}
        <div className="absolute top-20 right-[15%] bg-yellow-400 border-3 border-black dark:border-white px-3 py-1 font-bangers text-sm text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.3)] rotate-12 pointer-events-none hidden lg:block">
          ORIGIN!
        </div>

        <div className="container relative mx-auto grid gap-10 px-4 py-16 md:py-24 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 100 }}
            className="space-y-8"
          >
            {/* Eyebrow Badge */}
            <div className="relative inline-block">
              <svg
                className="absolute -inset-4 w-[calc(100%+32px)] h-[calc(100%+32px)] text-yellow-400 -z-10"
                viewBox="0 0 100 100"
              >
                <path
                  d="M50 0 L58 38 L95 30 L65 55 L85 90 L50 68 L15 90 L35 55 L5 30 L42 38Z"
                  fill="currentColor"
                  stroke="black"
                  strokeWidth="2"
                />
              </svg>
              <div className="inline-flex items-center gap-2 bg-accent border-3 border-black dark:border-white px-4 py-2 font-oswald text-xs font-bold uppercase tracking-[0.24em] text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.3)]">
                <BookOpen size={14} strokeWidth={3} />
                The About Issue
              </div>
            </div>

            {/* Title */}
            <div className="space-y-4">
              <h1
                className="font-bangers text-6xl leading-none text-black dark:text-white md:text-8xl tracking-wide"
                style={{
                  textShadow:
                    "5px 5px 0px rgba(0,0,0,0.1) dark:shadow-[5px_5px_0px_rgba(255,255,255,0.1)]",
                  WebkitTextStroke: "2px black dark:stroke-white",
                }}
              >
                OUR STORY,
                <span
                  className="block text-primary mt-2"
                  style={{ textShadow: "4px 4px 0px rgba(0,0,0,0.15)" }}
                >
                  OUR CREW
                </span>
              </h1>
              <p
                className="max-w-2xl text-lg leading-8 text-gray-600 dark:text-gray-400 md:text-xl"
                style={{
                  fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif',
                }}
              >
                PlixBlog tells tech stories with comic-book energy.
              </p>
            </div>

            {/* Info Panels */}
            <div className="grid gap-4 md:grid-cols-2">
              {/* Mission Panel - Speech Bubble Style */}
              <div className="relative bg-white dark:bg-gray-800 border-4 border-black dark:border-white p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.15)]">
                {/* Speech bubble tail */}
                <div className="absolute -bottom-4 left-8 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[16px] border-t-black dark:border-t-white" />
                <div className="absolute -bottom-[11px] left-[33px] w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[12px] border-t-white dark:border-t-gray-800" />

                <div className="absolute -top-3 -left-3 w-6 h-6 bg-primary border-3 border-black dark:border-white" />

                <div className="flex items-center gap-2 mb-3">
                  <Target size={16} className="text-primary" strokeWidth={3} />
                  <p className="font-oswald text-xs uppercase tracking-[0.25em] text-primary font-bold">
                    Our Mission
                  </p>
                </div>
                <p className="text-sm leading-7 text-gray-600 dark:text-gray-400">
                  Turn learning, building, and teamwork into stories readers
                  actually want to follow from panel one to the final page.
                </p>
              </div>

              {/* Team Energy Panel */}
              <div className="relative bg-white dark:bg-gray-800 border-4 border-black dark:border-white p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.15)]">
                <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-accent border-3 border-black dark:border-white" />

                <div className="flex items-center gap-2 mb-3">
                  <Sparkles size={16} className="text-accent" strokeWidth={3} />
                  <p className="font-oswald text-xs uppercase tracking-[0.25em] text-accent font-bold">
                    Team Energy
                  </p>
                </div>
                <p className="text-sm leading-7 text-gray-600 dark:text-gray-400">
                  Guided by mentors, powered by creators, and styled with the
                  same bold comic identity already used across the frontend.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Hero Image Panel */}
          <motion.div
            initial={{ opacity: 0, x: 50, rotate: 2 }}
            whileInView={{ opacity: 1, x: 0, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute -left-4 top-6 h-24 w-24 rounded-full bg-accent/30 blur-3xl" />
            <div className="absolute -right-2 bottom-4 h-32 w-32 rounded-full bg-primary/30 blur-3xl" />

            <div className="relative bg-white dark:bg-gray-900 border-4 border-black dark:border-white p-3 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] dark:shadow-[10px_10px_0px_0px_rgba(255,255,255,0.15)]">
              {/* Inner dashed border */}
              <div className="absolute inset-2 border-2 border-dashed border-gray-200 dark:border-gray-700 pointer-events-none" />

              <div className="relative aspect-[4/3] overflow-hidden border-3 border-black dark:border-white">
                <Image
                  src="/talk.jpg"
                  alt="PlixBlog team discussing ideas"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
                {/* Halftone overlay on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity pointer-events-none"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle, black 1.5px, transparent 1.5px)",
                    backgroundSize: "6px 6px",
                  }}
                />
              </div>

              <div className="mt-4 flex items-center justify-between gap-4">
                <div>
                  <p className="font-oswald text-xs uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
                    Panel Caption
                  </p>
                  <p className="font-bangers text-2xl text-black dark:text-white md:text-3xl">
                    Meet The People Behind The Pages
                  </p>
                </div>
                <div className="bg-accent border-3 border-black dark:border-white px-3 py-2 font-oswald text-xs font-bold uppercase tracking-[0.2em] text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.3)] -rotate-3">
                  Issue 01
                </div>
              </div>
            </div>

            {/* Decorative corner accent */}
            <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-yellow-400 border-3 border-black dark:border-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.3)] z-10 hidden md:block" />
          </motion.div>
        </div>
      </section>

      {/* Why This Team Section */}
      <section className="border-b-8 border-black dark:border-white py-16 md:py-24  dark:bg-gray-950 relative">
        <div
          className="absolute inset-0 opacity-[0.04] dark:opacity-[0.02] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, black 1.5px, transparent 1.5px)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* Action Lines */}
        <svg
          className="absolute top-1/2 left-0 w-32 h-80 -translate-y-1/2 opacity-[0.06] dark:opacity-[0.03] pointer-events-none"
          viewBox="0 0 100 300"
        >
          <path
            d="M80 0 L20 150 L85 300"
            stroke="black"
            strokeWidth="3"
            fill="none"
            strokeDasharray="12 6"
          />
        </svg>
        <svg
          className="absolute top-1/2 right-0 w-32 h-80 -translate-y-1/2 opacity-[0.06] dark:opacity-[0.03] pointer-events-none rotate-180"
          viewBox="0 0 100 300"
        >
          <path
            d="M80 0 L20 150 L85 300"
            stroke="black"
            strokeWidth="3"
            fill="none"
            strokeDasharray="12 6"
          />
        </svg>

        <div className="container relative mx-auto px-4">
          <SectionHeading
            eyebrow="Origin Story"
            title="WHY THIS TEAM"
            description="PlixBlog is built by a passionate team of creators dedicated to bringing tech stories to life through a unique comic-inspired lens."
          />

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {[
              {
                icon: Zap,
                title: "Comic Identity",
                color: "bg-primary",
                text: "Bold type, thick borders, halftone texture, and punchy labels keep the page tied to the unique PlixBlog aesthetic.",
              },
              {
                icon: Target,
                title: "Core Values",
                color: "bg-accent",
                text: "We believe in the power of visual storytelling to simplify complex topics with high-quality content.",
              },
              {
                icon: Users,
                title: "Team Roster",
                color: "bg-secondary",
                text: "Our responsive roster brings together diverse talents from leadership to core contributors.",
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{
                  opacity: 0,
                  y: 30,
                  rotate: index % 2 === 0 ? -1 : 1,
                }}
                whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: index * 0.15,
                  type: "spring",
                  stiffness: 150,
                }}
                className="group relative bg-white dark:bg-gray-900 border-4 border-black dark:border-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.15)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[12px_12px_0px_0px_rgba(255,255,255,0.25)] transition-all duration-300 hover:-translate-y-1"
              >
                {/* Hover sound effect */}
                <div className="absolute -top-3 -right-3 bg-yellow-400 border-3 border-black dark:border-white px-2 py-1 font-bangers text-sm text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rotate-6 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  {index === 0 ? "BAM!" : index === 1 ? "POW!" : "ZAP!"}
                </div>

                {/* Section number badge */}
                <div className="absolute -top-3 -left-3 bg-black dark:bg-white border-3 border-black dark:border-white w-8 h-8 flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.3)]">
                  <span className="font-bangers text-sm text-white dark:text-black">
                    0{index + 1}
                  </span>
                </div>

                <div
                  className={`inline-flex items-center justify-center w-12 h-12 ${item.color} border-3 border-black dark:border-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.3)] mb-4 mt-2`}
                >
                  <item.icon
                    size={24}
                    className="text-white"
                    strokeWidth={2.5}
                  />
                </div>

                <p className="font-oswald text-xs uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 font-bold mb-2">
                  Section 0{index + 1}
                </p>
                <h3 className="font-bangers text-3xl text-black dark:text-white mb-3">
                  {item.title}
                </h3>
                <p
                  className="text-sm leading-7 text-gray-600 dark:text-gray-400"
                  style={{
                    fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif',
                  }}
                >
                  {item.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mentors Section */}
      <section className="relative overflow-hidden border-b-8 border-black dark:border-white bg-white dark:bg-gray-900 py-16 md:py-24">
        <div
          className="absolute inset-0 opacity-[0.05] dark:opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, black 1.5px, transparent 1.5px)",
            backgroundSize: "20px 20px",
          }}
        />

        {/* Action Lines */}
        <svg
          className="absolute top-1/2 left-0 w-32 h-80 -translate-y-1/2 opacity-[0.06] dark:opacity-[0.03] pointer-events-none"
          viewBox="0 0 100 300"
        >
          <path
            d="M80 0 L20 150 L85 300"
            stroke="black"
            strokeWidth="3"
            fill="none"
            strokeDasharray="12 6"
          />
        </svg>
        <svg
          className="absolute top-1/2 right-0 w-32 h-80 -translate-y-1/2 opacity-[0.06] dark:opacity-[0.03] pointer-events-none rotate-180"
          viewBox="0 0 100 300"
        >
          <path
            d="M80 0 L20 150 L85 300"
            stroke="black"
            strokeWidth="3"
            fill="none"
            strokeDasharray="12 6"
          />
        </svg>

        {/* Floating sound effect */}
        <div className="absolute top-16 right-[10%] bg-primary border-3 border-black dark:border-white px-3 py-1 font-bangers text-sm text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.3)] rotate-12 pointer-events-none hidden lg:block">
          GUIDES!
        </div>

        <div className="container relative mx-auto px-4">
          <SectionHeading
            eyebrow="Guide Panel"
            title="OUR MENTORS"
            description="Guided by industry leaders who help shape the direction, quality, and confidence of the team."
          />

          <div className="mx-auto mt-16 max-w-5xl">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {mentors.map((mentor, index) => (
                <div
                  key={mentor.name}
                  className={index === 0 ? "sm:col-span-2 lg:col-span-1" : ""}
                >
                  <PersonCard
                    name={mentor.name}
                    role={mentor.role}
                    image={mentor.image}
                    accent={mentor.accent}
                    facebook={mentor.facebook}
                    github={mentor.github}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 md:py-24  dark:bg-gray-950 relative">
        <div
          className="absolute inset-0 opacity-[0.04] dark:opacity-[0.02] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, black 1.5px, transparent 1.5px)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* Floating sound effect */}
        <div className="absolute top-12 left-[8%] bg-accent border-3 border-black dark:border-white px-3 py-1 font-bangers text-sm text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.3)] -rotate-12 pointer-events-none hidden lg:block">
          HEROES!
        </div>

        <div className="container relative mx-auto px-4">
          <SectionHeading
            eyebrow="Hero Roster"
            title="OUR TEAM"
            description="The passionate people driving the project forward, from leadership to core contributors."
          />

          <div className="mt-14 grid grid-cols-1 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {teamMembers.map((member, index) => (
              <div
                key={member.name}
                className={`flex justify-center ${
                  index === 0 ? "lg:col-span-3 xl:col-span-1" : ""
                }`}
              >
                <PersonCard
                  name={member.name}
                  role={member.role}
                  image={member.image}
                  accent={index % 2 === 0 ? "bg-primary" : "bg-accent"}
                  facebook={member.facebook}
                  github={member.github}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
