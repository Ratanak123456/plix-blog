import { SiGithub, SiInstagram, SiX } from "react-icons/si";

export function SiteFooter() {
  return (
    <footer
      id="about"
      className="relative mt-4 overflow-hidden py-12"
      style={{ backgroundColor: "#F0B443" }}
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
            <span
              className="font-bangers text-5xl drop-shadow-[2px_2px_0px_rgba(0,0,0,0.3)]"
              style={{ color: "#1a1a1a" }}
            >
              PLIXBLOG
            </span>
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
            {["About", "Privacy", "Advertise", "Contact"].map((link) => (
              <a
                key={link}
                href="#"
                className="transition-colors hover:opacity-70"
                style={{ color: "#1a1a1a" }}
              >
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

        <div className="mt-12 flex flex-col items-center border-t border-black/10 pt-8">
          <span className="mb-4 font-oswald text-xs font-bold uppercase tracking-widest text-black/50">
            Official Sponsor
          </span>
          <div className="flex items-center justify-center grayscale transition-all hover:grayscale-0">
            {/* Replace with actual sponsor logo */}
            <div className="bg-black/5 px-6 py-3 comic-border border-black/20">
              <span className="font-bangers text-2xl text-black/40">SPONSOR LOGO</span>
            </div>
          </div>
        </div>

        <div
          className="mt-10 text-center font-sans text-sm"
          style={{ color: "#3a3a3a" }}
        >
          © {new Date().getFullYear()} PlixBlog Universe. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
