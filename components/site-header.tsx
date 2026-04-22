"use client";

import { AnimatePresence, motion } from "framer-motion";
import { LogIn, Menu, Moon, PenSquare, Sun, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { AuthModal } from "@/components/auth/auth-modal";
import { useGetMyProfileQuery } from "@/lib/services/auth-api";
import { useAppSelector } from "@/lib/store";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Blog", href: "/blog" },
  { label: "About US", href: "/about" },
];

export function SiteHeader() {
  const { theme, setTheme } = useTheme();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const [loginOpen, setLoginOpen] = useState(false);
  const [modalType, setModalType] = useState<"login" | "register">("login");

  useGetMyProfileQuery(undefined, {
    skip: !isAuthenticated,
  });

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

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

          <nav className="hidden items-center gap-5 font-oswald text-base uppercase tracking-wide md:flex">
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
            <button
              onClick={toggleTheme}
              className="p-2 transition-all hover:border-accent hover:text-accent comic-border"
              aria-label="Toggle theme"
            >
              {mounted ? (theme === "light" ? <Moon size={18} /> : <Sun size={18} />) : <div className="h-[18px] w-[18px]" />}
            </button>
            <Link
              href="/write"
              className="flex items-center gap-2 px-3 py-2 font-bangers text-lg transition-all hover:border-accent hover:text-accent comic-border"
            >
              <PenSquare size={16} /> WRITE
            </Link>
            {isAuthenticated ? (
              user ? (
                <Link
                  href="/profile"
                  className="flex items-center gap-2 p-1 transition-all hover:border-accent comic-border"
                  title={user.username}
                >
                  <div className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border-2 border-primary bg-accent shadow-[1px_1px_0px_0px_hsl(var(--foreground))]">
                    {user.profileImage ? (
                      <Image
                        src={user.profileImage}
                        alt={user.fullName}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <span className="font-bangers text-[10px] text-background uppercase">
                        {user.fullName.charAt(0)}
                      </span>
                    )}
                  </div>
                </Link>
              ) : (
                <div className="h-10 w-10 animate-pulse rounded-full border-2 border-primary bg-accent/20 shadow-[1px_1px_0px_0px_hsl(var(--foreground))]" />
              )
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
            <button
              onClick={toggleTheme}
              className="p-2 text-primary"
              aria-label="Toggle theme"
            >
              {mounted ? (theme === "light" ? <Moon size={20} /> : <Sun size={20} />) : <div className="h-[20px] w-[20px]" />}
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
                <Link
                  href="/write"
                  onClick={() => setMobileMenuOpen(false)}
                  className="mt-2 flex items-center gap-2 px-4 py-2 font-bangers text-2xl transition-colors hover:text-accent comic-border"
                >
                  <PenSquare size={20} /> WRITE
                </Link>
                {isAuthenticated ? (
                  user ? (
                    <Link
                      href="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="mt-2 flex items-center gap-3 px-4 py-2 font-oswald text-base uppercase transition-colors hover:text-primary comic-border"
                    >
                      <div className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border-2 border-primary bg-accent shadow-[1px_1px_0px_0px_hsl(var(--foreground))]">
                        {user.profileImage ? (
                          <Image
                            src={user.profileImage}
                            alt={user.fullName}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <span className="font-bangers text-[10px] text-background uppercase">
                            {user.fullName.charAt(0)}
                          </span>
                        )}
                      </div>
                      <span>{user.username}</span>
                    </Link>
                  ) : (
                    <div className="mt-2 flex h-12 w-full animate-pulse items-center gap-3 rounded-md border-2 border-primary bg-accent/20 px-4 shadow-[1px_1px_0px_0px_hsl(var(--foreground))]" />
                  )
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
