"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Globe, LogIn, Menu, Moon, Sun, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Blog", href: "/#blog" },
  { label: "About Us", href: "/about" },
];

const LANGUAGES = [
  { code: "EN", label: "English", flag: "🇺🇸" },
  { code: "ES", label: "Español", flag: "🇪🇸" },
  { code: "FR", label: "Français", flag: "🇫🇷" },
];

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [langOpen, setLangOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState("EN");
  const [loginOpen, setLoginOpen] = useState(false);
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
      <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
        <DialogContent className="max-w-md border-primary bg-card p-8 shadow-2xl comic-border">
          <DialogHeader className="text-left">
            <span className="font-bangers text-3xl logo-gradient">PLIXBLOG</span>
            <DialogTitle className="mt-1 mb-1 font-bangers text-4xl">ENTER THE UNIVERSE</DialogTitle>
            <DialogDescription className="font-oswald text-sm uppercase tracking-wide text-muted-foreground">
              Sign in to your account
            </DialogDescription>
          </DialogHeader>
          <form
            className="flex flex-col gap-4"
            onSubmit={(event) => {
              event.preventDefault();
              setLoginOpen(false);
            }}
          >
            <div>
              <label className="mb-1 block font-oswald text-xs uppercase tracking-wider text-muted-foreground">
                Email
              </label>
              <Input
                type="email"
                placeholder="hero@plixblog.com"
                className="h-auto border-primary bg-background px-4 py-3 font-oswald text-lg comic-border"
              />
            </div>
            <div>
              <label className="mb-1 block font-oswald text-xs uppercase tracking-wider text-muted-foreground">
                Password
              </label>
              <Input
                type="password"
                placeholder="********"
                className="h-auto border-primary bg-background px-4 py-3 font-oswald text-lg comic-border"
              />
            </div>
            <Button
              type="submit"
              className="mt-2 h-auto w-full bg-accent py-3 font-bangers text-2xl text-background hover:bg-primary comic-border"
            >
              LOGIN
            </Button>
            <p className="text-center font-oswald text-sm text-muted-foreground">
              No account?{" "}
              <a href="#" className="text-accent underline transition-colors hover:text-primary">
                Join the universe
              </a>
            </p>
          </form>
        </DialogContent>
      </Dialog>

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
            <Button
              variant="ghost"
              onClick={() => setLoginOpen(true)}
              className="h-auto border-primary px-4 py-2 font-bangers text-lg hover:border-accent hover:bg-transparent hover:text-accent comic-border"
            >
              <LogIn size={16} /> LOGIN
            </Button>
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
                <Button
                  variant="ghost"
                  onClick={() => {
                    setLoginOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="mt-1 h-auto justify-start border-secondary px-4 py-2 font-bangers text-2xl hover:bg-transparent hover:text-accent comic-border-secondary"
                >
                  <LogIn size={20} /> LOGIN
                </Button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
