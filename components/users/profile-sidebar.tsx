"use client";

import { CalendarDays, ChevronDown, FileText, Bookmark, LogOut } from "lucide-react";
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
    <aside className="overflow-hidden bg-card comic-border">
      <div
        className="relative min-h-44 border-b-4 border-primary bg-linear-to-br from-primary via-orange-500 to-amber-300"
        style={previewCoverImageUrl ? { backgroundImage: `url("${previewCoverImageUrl}")`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
      >
        <div className="absolute inset-0 bg-background/20" />
        <div className="absolute inset-0 opacity-25 halftone-bg" />
      </div>

      <div className="relative px-6 pb-6">
        <div className="-mt-12 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-background bg-primary font-bangers text-3xl text-primary-foreground">
          {previewProfileImageUrl ? (
            <div
              className="h-full w-full bg-cover bg-center"
              style={{ backgroundImage: `url("${previewProfileImageUrl}")` }}
            />
          ) : (
            getInitials(previewFullName)
          )}
        </div>

        <div className="mt-4">
          <p className="font-oswald text-xs uppercase tracking-[0.35em] text-muted-foreground">Profile HQ</p>
          <h1 className="mt-2 font-bangers text-4xl leading-none text-primary sm:text-5xl">{previewFullName}</h1>
          <p className="mt-2 font-sans text-base text-muted-foreground">@{previewUsername}</p>
          <p className="mt-5 font-sans text-sm leading-7 text-foreground">
            {previewBio?.trim() || "Add a bio so readers know what kind of stories you publish."}
          </p>
        </div>

        <div className="mt-6 space-y-3">
          <div className="bg-background p-4 comic-border-secondary">
            <div className="flex items-center gap-2 font-oswald text-xs uppercase tracking-wider text-muted-foreground">
              <CalendarDays size={14} />
              Joined
            </div>
            <p className="mt-2 font-bangers text-2xl text-primary">{formatDate(profile.createdAt)}</p>
          </div>
          <div className="bg-background p-4 comic-border-secondary">
            <div className="flex items-center gap-2 font-oswald text-xs uppercase tracking-wider text-muted-foreground">
              <FileText size={14} />
              Total blogs
            </div>
            <p className="mt-2 font-bangers text-2xl text-primary">{postsCount}</p>
          </div>
          <div className="bg-background p-4 comic-border-secondary">
            <div className="flex items-center gap-2 font-oswald text-xs uppercase tracking-wider text-muted-foreground">
              <Bookmark size={14} />
              Saved stories
            </div>
            <p className="mt-2 font-bangers text-2xl text-primary">{bookmarksCount}</p>
          </div>
        </div>

        <div className="mt-6">
          {/* Mobile/Tablet Toggle Box */}
          <div className="lg:hidden">
            <button
              type="button"
              onClick={() => setIsTabMenuOpen(!isTabMenuOpen)}
              className="flex w-full items-center justify-between bg-background px-4 py-3 font-oswald text-xs uppercase tracking-[0.28em] text-primary comic-border-secondary"
            >
              <span>{tabs.find((t) => t.id === activeTab)?.label}</span>
              <ChevronDown className={`transition-transform duration-300 ${isTabMenuOpen ? "rotate-180" : ""}`} size={16} />
            </button>
            
            <div className={`mt-2 grid gap-2 overflow-hidden transition-all duration-300 ${isTabMenuOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"}`}>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.id);
                    setIsTabMenuOpen(false);
                  }}
                  className={`px-4 py-3 text-left font-oswald text-xs uppercase tracking-[0.28em] transition-colors comic-border-secondary ${
                    activeTab === tab.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-background text-muted-foreground hover:text-primary"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Desktop Buttons */}
          <div className="hidden lg:grid lg:gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-left font-oswald text-xs uppercase tracking-[0.28em] transition-colors comic-border-secondary ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-background text-muted-foreground hover:text-primary"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          
          <button
            type="button"
            onClick={onLogout}
            className="mt-4 flex w-full items-center justify-center gap-2 bg-destructive/10 px-4 py-3 font-bangers text-2xl text-destructive transition-all hover:bg-destructive hover:text-destructive-foreground comic-border-secondary"
          >
            <LogOut size={20} /> LOGOUT
          </button>
        </div>
      </div>
    </aside>
  );
}
