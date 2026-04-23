"use client";

import { CalendarDays, ChevronDown, FileText, Bookmark, LogOut, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getInitials } from "./profile-utils";
import { type UserProfile } from "@/lib/types";

type ProfileTab = "info" | "posts" | "bookmarks";

interface ProfileSidebarProps {
  profile: UserProfile;
  previewFullName: string;
  previewUsername: string;
  previewBio: string | null;
  previewProfileImageUrl: string | null;
  previewCoverImageUrl: string | null;
  postsCount: number;
  bookmarksCount: number;
  activeTab: string;
  tabs: { id: ProfileTab; label: string }[];
  isTabMenuOpen: boolean;
  setIsTabMenuOpen: (open: boolean) => void;
  setActiveTab: (tab: ProfileTab) => void;
  formatDate: (date: string) => string;
  onLogout: () => void;
}

export function ProfileSidebar({
  profile,
  previewFullName,
  previewUsername,
  previewBio,
  previewProfileImageUrl,
  previewCoverImageUrl,
  postsCount,
  bookmarksCount,
  activeTab,
  tabs,
  isTabMenuOpen,
  setIsTabMenuOpen,
  setActiveTab,
  formatDate,
  onLogout,
}: ProfileSidebarProps) {
  return (
    <aside className="overflow-hidden bg-card border-4 border-foreground shadow-[8px_8px_0px_0px_hsl(var(--foreground))] relative">
      {/* Inner dashed border */}
      <div className="absolute inset-2 border-2 border-dashed border-muted-border pointer-events-none z-10"/>

      {/* Cover Image */}
      <div
        className="relative min-h-48 border-b-4 border-foreground bg-gradient-to-br from-primary/60 via-secondary/40 to-accent/30"
        style={previewCoverImageUrl ? { backgroundImage: `url("${previewCoverImageUrl}")`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
      >
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, hsl(var(--foreground)) 1.5px, transparent 1.5px)",
            backgroundSize: "8px 8px",
          }}
        />
        
        {/* Floating badge */}
        <div className="absolute top-4 right-4 bg-yellow-400 border-3 border-foreground px-3 py-1 font-bangers text-sm text-black shadow-[3px_3px_0px_0px_hsl(var(--foreground))] rotate-6 z-20">
          PROFILE HQ
        </div>
      </div>

      <div className="relative px-6 pb-6 z-20">
        {/* Avatar */}
        <div className="-mt-14 relative inline-block">
          <div className="flex h-28 w-28 items-center justify-center overflow-hidden border-4 border-foreground bg-primary shadow-[4px_4px_0px_0px_hsl(var(--foreground))]"
            style={{ clipPath: 'polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)' }}
          >
            {previewProfileImageUrl ? (
              <div
                className="h-full w-full bg-cover bg-center"
                style={{ backgroundImage: `url("${previewProfileImageUrl}")` }}
              />
            ) : (
              <span className="font-bangers text-4xl text-white drop-shadow-md">
                {getInitials(previewFullName)}
              </span>
            )}
          </div>
          {/* Status dot */}
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-3 border-foreground shadow-[2px_2px_0px_0px_hsl(var(--foreground))]"/>
        </div>

        {/* User Info */}
        <div className="mt-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-primary border-2 border-foreground px-2 py-0.5 shadow-[2px_2px_0px_0px_hsl(var(--foreground))]">
              <p className="font-oswald text-[10px] uppercase tracking-[0.35em] text-white font-bold">Hero Profile</p>
            </div>
          </div>
          <h1 className="font-bangers text-4xl leading-none text-foreground sm:text-5xl tracking-wide"
            style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.1)' }}
          >
            {previewFullName}
          </h1>
          <p className="mt-2 font-bangers text-xl text-primary tracking-wide">@{previewUsername}</p>
          
          {/* Bio Panel */}
          <div className="mt-5 relative bg-background border-3 border-foreground p-4 shadow-[4px_4px_0px_0px_hsl(var(--foreground))]">
            <div className="absolute -top-3 -left-3 bg-accent border-2 border-foreground px-2 py-0.5 font-bangers text-xs text-white shadow-[2px_2px_0px_0px_hsl(var(--foreground))]">
              BIO
            </div>
            <p className="font-sans text-sm leading-7 text-foreground mt-2"
              style={{ fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif' }}
            >
              {previewBio?.trim() || "Add a bio so readers know what kind of stories you publish."}
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mt-6 grid grid-cols-1 gap-3">
          {/* Joined */}
          <div className="bg-background border-3 border-foreground p-4 shadow-[4px_4px_0px_0px_hsl(var(--foreground))] relative group hover:-translate-y-1 transition-transform">
            <div className="absolute -top-2 -right-2 bg-primary border-2 border-foreground px-2 py-0.5 font-bangers text-xs text-white shadow-[2px_2px_0px_0px_hsl(var(--foreground))] opacity-0 group-hover:opacity-100 transition-opacity">
              MEMBER!
            </div>
            <div className="flex items-center gap-2 font-oswald text-xs uppercase tracking-wider text-muted-foreground mb-2">
              <CalendarDays size={14} className="text-primary" strokeWidth={3} />
              Joined
            </div>
            <p className="font-bangers text-3xl text-foreground tracking-wide">{formatDate(profile.createdAt)}</p>
          </div>

          {/* Posts */}
          <div className="bg-background border-3 border-foreground p-4 shadow-[4px_4px_0px_0px_hsl(var(--foreground))] relative group hover:-translate-y-1 transition-transform">
            <div className="absolute -top-2 -right-2 bg-secondary border-2 border-foreground px-2 py-0.5 font-bangers text-xs text-white shadow-[2px_2px_0px_0px_hsl(var(--foreground))] opacity-0 group-hover:opacity-100 transition-opacity">
              WRITER!
            </div>
            <div className="flex items-center gap-2 font-oswald text-xs uppercase tracking-wider text-muted-foreground mb-2">
              <FileText size={14} className="text-secondary" strokeWidth={3} />
              Total Blogs
            </div>
            <p className="font-bangers text-3xl text-foreground tracking-wide">{postsCount}</p>
          </div>

          {/* Bookmarks */}
          <div className="bg-background border-3 border-foreground p-4 shadow-[4px_4px_0px_0px_hsl(var(--foreground))] relative group hover:-translate-y-1 transition-transform">
            <div className="absolute -top-2 -right-2 bg-accent border-2 border-foreground px-2 py-0.5 font-bangers text-xs text-white shadow-[2px_2px_0px_0px_hsl(var(--foreground))] opacity-0 group-hover:opacity-100 transition-opacity">
              SAVED!
            </div>
            <div className="flex items-center gap-2 font-oswald text-xs uppercase tracking-wider text-muted-foreground mb-2">
              <Bookmark size={14} className="text-accent" strokeWidth={3} />
              Saved Stories
            </div>
            <p className="font-bangers text-3xl text-foreground tracking-wide">{bookmarksCount}</p>
          </div>
        </div>

        {/* Tabs & Logout */}
        <div className="mt-6 relative z-20">
          {/* Mobile/Tablet Toggle */}
          <div className="lg:hidden">
            <button
              type="button"
              onClick={() => setIsTabMenuOpen(!isTabMenuOpen)}
              className="flex w-full items-center justify-between bg-primary border-3 border-foreground px-4 py-3 font-oswald text-xs uppercase tracking-[0.28em] text-white shadow-[4px_4px_0px_0px_hsl(var(--foreground))] transition-all hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_hsl(var(--foreground))]"
            >
              <span className="font-bangers text-base tracking-wide">{tabs.find((t) => t.id === activeTab)?.label}</span>
              <ChevronDown className={`transition-transform duration-300 ${isTabMenuOpen ? "rotate-180" : ""}`} size={18} strokeWidth={3} />
            </button>
            
            <AnimatePresence>
              {isTabMenuOpen && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mt-2 grid gap-2 overflow-hidden"
                >
                  {tabs.map((tab, index) => (
                    <motion.button
                      key={tab.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      type="button"
                      onClick={() => {
                        setActiveTab(tab.id);
                        setIsTabMenuOpen(false);
                      }}
                      className={`flex items-center gap-3 px-4 py-3 text-left font-oswald text-xs uppercase tracking-[0.28em] transition-all border-3 shadow-[3px_3px_0px_0px_hsl(var(--foreground))] hover:-translate-y-0.5 ${
                        activeTab === tab.id
                          ? "bg-primary text-white border-foreground"
                          : "bg-card text-foreground border-foreground hover:bg-secondary hover:text-white"
                      }`}
                    >
                      {tab.id === "info" && <User size={14} strokeWidth={3} />}
                      {tab.id === "posts" && <FileText size={14} strokeWidth={3} />}
                      {tab.id === "bookmarks" && <Bookmark size={14} strokeWidth={3} />}
                      <span className="font-bangers text-base tracking-wide">{tab.label}</span>
                      {activeTab === tab.id && (
                        <div className="ml-auto w-2 h-2 bg-white border-2 border-foreground rotate-45"/>
                      )}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Desktop Buttons */}
          <div className="hidden lg:grid lg:gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 text-left font-oswald text-xs uppercase tracking-[0.28em] transition-all border-3 shadow-[4px_4px_0px_0px_hsl(var(--foreground))] hover:-translate-y-1 hover:shadow-[5px_5px_0px_0px_hsl(var(--foreground))] ${
                  activeTab === tab.id
                    ? "bg-primary text-white border-foreground"
                    : "bg-card text-foreground border-foreground hover:bg-secondary hover:text-white"
                }`}
              >
                <div className={`p-1.5 border-2 border-foreground ${activeTab === tab.id ? "bg-white/20" : "bg-card"}`}>
                  {tab.id === "info" && <User size={14} strokeWidth={3} />}
                  {tab.id === "posts" && <FileText size={14} strokeWidth={3} />}
                  {tab.id === "bookmarks" && <Bookmark size={14} strokeWidth={3} />}
                </div>
                <span className="font-bangers text-base tracking-wide">{tab.label}</span>
                {activeTab === tab.id && (
                  <div className="ml-auto w-3 h-3 bg-yellow-400 border-2 border-foreground rotate-45 shadow-[1px_1px_0px_0px_hsl(var(--foreground))]"/>
                )}
              </button>
            ))}
          </div>
          
          {/* Logout Button */}
          <button
            type="button"
            onClick={onLogout}
            className="mt-4 flex w-full items-center justify-center gap-2 bg-red-500 border-3 border-foreground px-4 py-3 font-bangers text-2xl text-white shadow-[4px_4px_0px_0px_hsl(var(--foreground))] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_hsl(var(--foreground))] hover:bg-red-600"
          >
            <LogOut size={20} strokeWidth={3} /> LOGOUT
          </button>
        </div>
      </div>
    </aside>
  );
}