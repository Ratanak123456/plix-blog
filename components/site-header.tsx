"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Globe, LogIn, LogOut, Menu, Moon, PenSquare, Sun, User2, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AuthModal } from "@/components/auth-modal";
import { logout } from "@/lib/features/auth/auth-slice";
import { useGetMyProfileQuery } from "@/lib/services/auth-api";
import { useAppDispatch, useAppSelector } from "@/lib/store";

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
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [themeReady, setThemeReady] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState("EN");
  const [loginOpen, setLoginOpen] = useState(false);
  const [modalType, setModalType] = useState<"login" | "register">("login");
  const langRef = useRef<HTMLDivElement>(null);

  useGetMyProfileQuery(undefined, {
    skip: !isAuthenticated,
  });

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("plixblog-theme");
    setDarkMode(savedTheme !== "light");
    setThemeReady(true);
  }, []);

  useEffect(() => {
    if (!themeReady) {
      return;
    }

    document.documentElement.classList.toggle("dark", darkMode);
    document.documentElement.classList.toggle("light", !darkMode);
    window.localStorage.setItem("plixblog-theme", darkMode ? "dark" : "light");
  }, [darkMode, themeReady]);

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
      <AuthModal open={loginOpen} mode={modalType} onClose={() => setLoginOpen(false)} onModeChange={setModalType} />

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
              {themeReady && !darkMode ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <Link
              href="/write"
              className="flex items-center gap-2 px-3 py-2 font-bangers text-lg transition-all hover:border-accent hover:text-accent comic-border"
            >
              <PenSquare size={16} /> WRITE
            </Link>
            {isAuthenticated && user ? (
              <>
                <div className="flex items-center gap-2 px-4 py-2 font-oswald text-sm uppercase tracking-wide comic-border">
                  <User2 size={16} />
                  <span>{user.username}</span>
                </div>
                <button
                  onClick={() => dispatch(logout())}
                  className="flex items-center gap-2 px-4 py-2 font-bangers text-lg transition-all hover:border-accent hover:text-accent comic-border"
                >
                  <LogOut size={16} /> LOGOUT
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setModalType("login");
                  setLoginOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-2 font-bangers text-lg transition-all hover:border-accent hover:text-accent comic-border"
              >
                <LogIn size={16} /> LOGIN
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <button onClick={() => setDarkMode((mode) => !mode)} className="p-2 text-primary" aria-label="Toggle theme">
              {themeReady && !darkMode ? <Moon size={20} /> : <Sun size={20} />}
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
                {isAuthenticated && user ? (
                  <>
                    <div className="mt-2 flex items-center gap-2 px-4 py-2 font-oswald text-base uppercase comic-border">
                      <User2 size={18} /> {user.username}
                    </div>
                    <button
                      onClick={() => {
                        dispatch(logout());
                        setMobileMenuOpen(false);
                      }}
                      className="mt-1 flex items-center gap-2 px-4 py-2 font-bangers text-2xl transition-colors hover:text-accent comic-border-secondary"
                    >
                      <LogOut size={20} /> LOGOUT
                    </button>
                  </>
                ) : (
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
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
