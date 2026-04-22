import Image from "next/image";
import Link from "next/link";

const FOOTER_LINKS = [
  { label: "HOME", href: "/" },
  { label: "BLOG", href: "/blog" },
  { label: "ABOUT US", href: "/about" },
];

export function SiteFooter() {
  return (
    <footer
      id="about"
      className="relative mt-4 overflow-hidden py-12 bg-primary"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(rgba(0,0,0,0.12) 2px, transparent 2px)",
          backgroundSize: "12px 12px",
        }}
      />
      <div className="relative z-10 container mx-auto px-4">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          <div className="flex flex-col items-center gap-1 md:items-start">
            <Link
              href="/"
              className="font-bangers text-5xl drop-shadow-[2px_2px_0px_rgba(0,0,0,0.3)] transition-opacity hover:opacity-80"
              style={{ color: "#1a1a1a" }}
            >
              PLIXBLOG
            </Link>
            <p
              className="font-oswald text-sm uppercase tracking-widest"
              style={{ color: "#3a3a3a" }}
            >
              Every piece of tech has an origin story.
            </p>
          </div>

          <nav
            className="flex flex-wrap justify-center gap-6 font-oswald text-lg uppercase"
            style={{ color: "#1a1a1a" }}
          >
            {FOOTER_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="transition-colors hover:opacity-70"
                style={{ color: "#1a1a1a" }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col items-center gap-4 md:items-end">
            <span className="font-oswald text-xs font-bold uppercase tracking-widest text-black/60">
              Official Sponsor
            </span>
            <div className="flex items-center transition-transform hover:scale-105">
              <div className="relative h-20 w-56">
                <Image
                  src="/logo.png"
                  alt="ISTAD Logo"
                  fill
                  sizes="(max-width: 768px) 100vw, 224px"
                  className="object-contain md:object-right"
                  priority
                />
              </div>
            </div>
            <div className="text-center md:text-right uppercase">
              <p className="font-oswald text-lg font-bold text-[#1a1a1a] leading-tight tracking-[0.1em]">
                Institute of Science and Technology<br/>
                <span className="text-xl tracking-[0.12em]">Advanced Development</span>
              </p>
            </div>
          </div>
        </div>

        <div
          className="mt-12 border-t border-black/10 pt-8 text-center font-sans text-sm"
          style={{ color: "#3a3a3a" }}
        >
          © {new Date().getFullYear()} PlixBlog Universe. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
