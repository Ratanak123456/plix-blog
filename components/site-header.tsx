"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Globe, LogIn, Menu, Moon, PenSquare, Sun, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const LANGUAGES = [
  { code: "EN", label: "English", flag: "🇺🇸" },
  { code: "ES", label: "Español", flag: "🇪🇸" },
  { code: "FR", label: "Français", flag: "🇫🇷" },
];

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Blog", href: "/#blog" },
  { label: "About US", href: "/about" },
];

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [langOpen, setLangOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState("EN");
  const [loginOpen, setLoginOpen] = useState(false);
  const [modalType, setModalType] = useState<"login" | "register">("login");
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem("plixblog-theme");
    const isDark = storedTheme !== "light";
    setDarkMode(isDark);
    document.documentElement.classList.toggle("dark", isDark);
    document.documentElement.classList.toggle("light", !isDark);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    document.documentElement.classList.toggle("light", !darkMode);
    window.localStorage.setItem("plixblog-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setLangOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <>
      <AnimatePresence>
        {loginOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            onClick={() => setLoginOpen(false)}
          >
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 30 }}
              transition={{ type: "spring", bounce: 0.3 }}
              className="relative z-10 w-full max-w-md bg-card p-8 shadow-2xl comic-border"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                onClick={() => setLoginOpen(false)}
                className="absolute top-4 right-4 text-muted-foreground transition-colors hover:text-accent"
              >
                <X size={24} />
              </button>
              <span className="font-bangers text-3xl logo-gradient">PLIXBLOG</span>
              <h2 className="mt-1 mb-1 font-bangers text-4xl">
                {modalType === "login" ? "ENTER THE UNIVERSE" : "JOIN THE HEROES"}
              </h2>
              <p className="mb-6 font-oswald text-sm uppercase tracking-wide text-muted-foreground">
                {modalType === "login" ? "Sign in to your account" : "Create your secret identity"}
              </p>
              <form
                className="flex flex-col gap-4"
                onSubmit={(event) => {
                  event.preventDefault();
                  setLoginOpen(false);
                }}
              >
                {modalType === "register" && (
                  <div>
                    <label className="mb-1 block font-oswald text-xs uppercase tracking-wider text-muted-foreground">
                      Username
                    </label>
                    <input
                      type="text"
                      placeholder="SuperReader99"
                      className="w-full bg-background px-4 py-3 font-oswald text-lg text-foreground transition-colors placeholder:text-muted-foreground/60 focus:border-accent focus:outline-none comic-border"
                    />
                  </div>
                )}
                <div>
                  <label className="mb-1 block font-oswald text-xs uppercase tracking-wider text-muted-foreground">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="hero@plixblog.com"
                    className="w-full bg-background px-4 py-3 font-oswald text-lg text-foreground transition-colors placeholder:text-muted-foreground/60 focus:border-accent focus:outline-none comic-border"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-oswald text-xs uppercase tracking-wider text-muted-foreground">
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-background px-4 py-3 font-oswald text-lg text-foreground transition-colors placeholder:text-muted-foreground/60 focus:border-accent focus:outline-none comic-border"
                  />
                </div>
                <button
                  type="submit"
                  className="mt-2 w-full bg-accent py-3 font-bangers text-2xl text-background transition-colors hover:bg-primary comic-border"
                >
                  {modalType === "login" ? "LOGIN" : "REGISTER"}
                </button>
                <p className="text-center font-oswald text-sm text-muted-foreground">
                  {modalType === "login" ? (
                    <>
                      No account?{" "}
                      <button
                        type="button"
                        onClick={() => setModalType("register")}
                        className="text-accent underline transition-colors hover:text-primary"
                      >
                        Join the universe
                      </button>
                    </>
                  ) : (
                    <>
                      Already a hero?{" "}
                      <button
                        type="button"
                        onClick={() => setModalType("login")}
                        className="text-accent underline transition-colors hover:text-primary"
                      >
                        Login here
                      </button>
                    </>
                  )}
                </p>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="sticky top-0 z-50 border-b-[4px] border-primary bg-background/95 shadow-md backdrop-blur transition-colors duration-300">
        <div className="container mx-auto flex h-20 items-center justify-between gap-4 px-4">
          <Link
            href="/"
            className="cursor-pointer font-bangers text-4xl tracking-wider logo-gradient drop-shadow-[2px_2px_0px_#5C6E6B] transition-opacity hover:opacity-80"
          >
            PLIXBLOG
          </Link>

          <nav className="hidden items-center gap-5 font-oswald text-base uppercase tracking-wide lg:flex">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="group relative whitespace-nowrap transition-colors hover:text-primary"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 h-[3px] w-0 bg-accent transition-all group-hover:w-full" />
              </Link>
            ))}
          </nav>

          <div className="hidden shrink-0 items-center gap-2 md:flex">
            <div ref={langRef} className="relative">
              <button
                onClick={() => setLangOpen((open) => !open)}
                className="flex items-center gap-1 px-3 py-2 font-oswald text-sm uppercase transition-all hover:border-accent hover:text-accent comic-border"
              >
                <Globe size={15} /> {currentLang}
                <ChevronDown size={13} className={`transition-transform ${langOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full z-50 mt-1 w-36 bg-card shadow-lg comic-border"
                  >
                    {LANGUAGES.map((language) => (
                      <button
                        key={language.code}
                        onClick={() => {
                          setCurrentLang(language.code);
                          setLangOpen(false);
                        }}
                        className={`flex w-full items-center gap-2 px-4 py-2 text-left font-oswald text-sm uppercase transition-colors hover:bg-primary/20 hover:text-primary ${
                          currentLang === language.code ? "text-accent" : ""
                        }`}
                      >
                        <span>{language.flag}</span>
                        {language.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <button
              onClick={() => setDarkMode((mode) => !mode)}
              className="p-2 transition-all hover:border-accent hover:text-accent comic-border"
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <Link
              href="/write"
              className="flex items-center gap-2 px-3 py-2 font-bangers text-lg transition-all hover:border-accent hover:text-accent comic-border"
            >
              <PenSquare size={16} /> WRITE
            </Link>
            <button
              onClick={() => {
                setModalType("login");
                setLoginOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 font-bangers text-lg transition-all hover:border-accent hover:text-accent comic-border"
            >
              <LogIn size={16} /> LOGIN
            </button>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <button onClick={() => setDarkMode((mode) => !mode)} className="p-2 text-primary" aria-label="Toggle theme">
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button className="text-primary" onClick={() => setMobileMenuOpen((open) => !open)}>
              {mobileMenuOpen ? <X size={30} /> : <Menu size={30} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden border-b-4 border-primary bg-card md:hidden"
            >
              <nav className="flex flex-col gap-3 p-4 font-oswald text-xl uppercase">
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="border-b border-secondary/30 pb-3 transition-colors hover:text-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="mt-2 flex gap-3">
                  {LANGUAGES.map((language) => (
                    <button
                      key={language.code}
                      onClick={() => setCurrentLang(language.code)}
                      className={`px-3 py-1 font-oswald text-sm transition-all comic-border ${
                        currentLang === language.code ? "bg-primary text-background" : "hover:text-primary"
                      }`}
                    >
                      {language.code}
                    </button>
                  ))}
                </div>
                <Link
                  href="/write"
                  onClick={() => setMobileMenuOpen(false)}
                  className="mt-2 flex items-center gap-2 px-4 py-2 font-bangers text-2xl transition-colors hover:text-accent comic-border"
                >
                  <PenSquare size={20} /> WRITE
                </Link>
                <button
                  onClick={() => {
                    setModalType("login");
                    setLoginOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="mt-1 flex items-center gap-2 px-4 py-2 font-bangers text-2xl transition-colors hover:text-accent comic-border-secondary"
                >
                  <LogIn size={20} /> LOGIN
                </button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
