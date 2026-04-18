import type { Metadata } from "next";
import Image from "next/image";
import { FaFacebook, FaGithub } from "react-icons/fa";

const mentors = [
  {
    name: "Mom Reksmey",
    role: "Frontend",
    image: "/about/teacher1.png",
    accent: "bg-accent",
    facebook: "https://facebook.com",
    github: "https://github.com",
  },
  {
    name: "Chan Chhaya",
    role: "Backend",
    image: "/about/Chhaya.jpg",
    accent: "bg-primary",
    facebook: "https://www.facebook.com/chhayadevkh",
    github: "https://github.com",
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
    facebook: "https://facebook.com",
    github: "https://github.com",
  },
  {
    name: "Khann Kanhchana",
    role: "Sub Leader",
    image: "",
    facebook: "https://facebook.com",
    github: "https://github.com",
  },
  {
    name: "Man Tolfary",
    role: "Member",
    image: "/about/member2.jpg",
    facebook: "https://facebook.com",
    github: "https://github.com",
  },
  {
    name: "Heang Minea",
    role: "Member",
    image: "/about/member1.png",
    facebook: "https://facebook.com",
    github: "https://github.com",
  },
];

export const metadata: Metadata = {
  title: "About Us",
  description: "Meet the mentors and team behind PlixBlog's comic-inspired storytelling.",
};

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
    <div className="mx-auto max-w-3xl text-center">
      <div className="inline-block comic-border-secondary bg-background px-4 py-2 font-oswald text-xs font-bold uppercase tracking-[0.24em] text-secondary shadow-sm">
        {eyebrow}
      </div>
      <h2 className="mt-5 font-bangers text-5xl text-primary drop-shadow-lg md:text-7xl">
        {title}
      </h2>
      <p className="mt-4 text-base leading-7 text-muted-foreground md:text-lg">
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
      <div className={`absolute -right-2 -top-2 h-6 w-6 rotate-12 border-2 border-foreground ${accent} z-10 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`} />
      
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
            <p className="font-bangers text-5xl text-muted-foreground opacity-20">?</p>
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

export default function AboutPage() {
  return (
    <main className="overflow-x-hidden bg-background text-foreground">
      <section className="relative border-b-4 border-primary bg-[linear-gradient(180deg,hsl(var(--background))_0%,hsl(var(--muted))_100%)]">
        <div className="absolute inset-0 halftone-bg opacity-35" />
        <div className="container relative mx-auto grid gap-10 px-4 py-14 md:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-7">
            <div className="inline-block comic-border bg-accent px-4 py-2 font-oswald text-xs font-bold uppercase tracking-[0.24em] text-accent-foreground shadow-sm">
              The About Issue
            </div>
            <div className="space-y-4">
              <h1 className="font-bangers text-6xl leading-none text-primary drop-shadow-lg md:text-8xl">
                OUR STORY,
                <span className="block text-accent">OUR CREW</span>
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-muted-foreground md:text-xl">
                PlixBlog tells tech stories with comic-book energy.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="speech-bubble p-5">
                <p className="font-oswald text-xs uppercase tracking-[0.25em] text-secondary">
                  Our Mission
                </p>
                <p className="mt-3 text-sm leading-7 text-muted-foreground md:text-base">
                  Turn learning, building, and teamwork into stories readers actually want to
                  follow from panel one to the final page.
                </p>
              </div>
              <div className="comic-border-accent bg-card p-5 shadow-sm">
                <p className="font-oswald text-xs uppercase tracking-[0.25em] text-accent">
                  Team Energy
                </p>
                <p className="mt-3 text-sm leading-7 text-muted-foreground md:text-base">
                  Guided by mentors, powered by creators, and styled with the same bold comic
                  identity already used across the frontend.
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-4 top-6 h-24 w-24 rounded-full bg-accent/30 blur-3xl" />
            <div className="absolute -right-2 bottom-4 h-32 w-32 rounded-full bg-primary/30 blur-3xl" />
            <div className="relative overflow-hidden comic-border bg-card p-3 shadow-xl">
              <div className="relative aspect-[4/3] overflow-hidden comic-border-secondary">
                <Image
                  src="/talk.jpg"
                  alt="PlixBlog team discussing ideas"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>
              <div className="mt-4 flex items-center justify-between gap-4">
                <div>
                  <p className="font-oswald text-xs uppercase tracking-[0.2em] text-secondary">
                    Panel Caption
                  </p>
                  <p className="font-bangers text-2xl text-foreground md:text-3xl">
                    Meet The People Behind The Pages
                  </p>
                </div>
                <div className="comic-border-accent bg-accent px-3 py-2 font-oswald text-xs font-bold uppercase tracking-[0.2em] text-accent-foreground">
                  Issue 01
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b-4 border-secondary py-14 md:py-20">
        <div className="container mx-auto px-4">
          <SectionHeading
            eyebrow="Origin Story"
            title="WHY THIS TEAM"
            description="PlixBlog is built by a passionate team of creators dedicated to bringing tech stories to life through a unique comic-inspired lens. Our mission is to make technical knowledge engaging and accessible for everyone."
          />

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            <div className="comic-border bg-card p-6 shadow-md">
              <p className="font-oswald text-xs uppercase tracking-[0.2em] text-accent">
                Section 01
              </p>
              <h3 className="mt-3 font-bangers text-3xl text-primary">Comic Identity</h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                Bold type, thick borders, halftone texture, and punchy labels keep the page tied
                to the unique PlixBlog aesthetic, ensuring a cohesive and immersive experience.
              </p>
            </div>
            <div className="comic-border-secondary bg-muted/30 p-6 shadow-md">
              <p className="font-oswald text-xs uppercase tracking-[0.2em] text-secondary">
                Section 02
              </p>
              <h3 className="mt-3 font-bangers text-3xl text-primary">Core Values</h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                We believe in the power of visual storytelling to simplify complex topics. Our team
                focuses on high-quality content, clean code, and immersive design.
              </p>
            </div>
            <div className="comic-border-accent bg-card p-6 shadow-md">
              <p className="font-oswald text-xs uppercase tracking-[0.2em] text-accent">
                Section 03
              </p>
              <h3 className="mt-3 font-bangers text-3xl text-primary">Team Roster</h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                Our responsive roster brings together diverse talents from leadership to core
                contributors, all working in sync to deliver the best "issues" to our readers.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-b-4 border-accent bg-muted/20 py-14 md:py-20">
        <div className="absolute inset-0 halftone-bg opacity-20" />
        <div className="container relative mx-auto px-4">
          <SectionHeading
            eyebrow="Guide Panel"
            title="OUR MENTORS"
            description="Guided by industry leaders who help shape the direction, quality, and confidence of the team."
          />

          <div className="mx-auto mt-16 max-w-5xl">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {mentors.map((mentor) => (
                <PersonCard
                  key={mentor.name}
                  name={mentor.name}
                  role={mentor.role}
                  image={mentor.image}
                  accent={mentor.accent}
                  facebook={mentor.facebook}
                  github={mentor.github}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="container mx-auto px-4">
          <SectionHeading
            eyebrow="Hero Roster"
            title="OUR TEAM"
            description="The passionate people driving the project forward, from leadership to core contributors."
          />

          <div className="mt-12 grid gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {teamMembers.map((member, index) => (
              <PersonCard
                key={member.name}
                name={member.name}
                role={member.role}
                image={member.image}
                accent={index % 2 === 0 ? "bg-primary" : "bg-accent"}
                facebook={member.facebook}
                github={member.github}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
