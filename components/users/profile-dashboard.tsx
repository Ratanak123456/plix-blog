"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Bookmark,
  CalendarDays,
  FileText,
  ImagePlus,
  Mail,
  Save,
  User2,
} from "lucide-react";
import { skipToken } from "@reduxjs/toolkit/query";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  type BlogPost,
  type PageResponse,
  useGetMyBookmarksQuery,
  useGetMyProfileQuery,
  useGetUserPostsPageQuery,
  useUpdateProfileMutation,
} from "@/lib/services/auth-api";
import { useAppSelector } from "@/lib/store";

type ProfileTab = "info" | "posts" | "bookmarks";

function formatDate(input: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(input));
}

function getInitials(name: string) {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "PB"
  );
}

function stripHtml(input: string) {
  return input
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getPreview(content: string) {
  const clean = stripHtml(content);
  return clean.length > 180 ? `${clean.slice(0, 177)}...` : clean;
}

function PaginationBar({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = Array.from({ length: totalPages }, (_, index) => index).slice(
    Math.max(0, page - 1),
    Math.min(totalPages, page + 2),
  );

  return (
    <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
      <p className="font-oswald text-xs uppercase tracking-[0.28em] text-muted-foreground">
        Page {page + 1} of {totalPages}
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => onChange(page - 1)}
          disabled={page === 0}
          className="bg-card px-4 py-2 font-oswald text-xs uppercase tracking-[0.28em] text-primary disabled:cursor-not-allowed disabled:opacity-50 comic-border-secondary"
        >
          Previous
        </button>
        {pages.map((pageIndex) => (
          <button
            key={pageIndex}
            type="button"
            onClick={() => onChange(pageIndex)}
            className={`px-4 py-2 font-oswald text-xs uppercase tracking-[0.28em] comic-border ${
              pageIndex === page
                ? "bg-primary text-primary-foreground"
                : "bg-card text-muted-foreground"
            }`}
          >
            {pageIndex + 1}
          </button>
        ))}
        <button
          type="button"
          onClick={() => onChange(page + 1)}
          disabled={page >= totalPages - 1}
          className="bg-card px-4 py-2 font-oswald text-xs uppercase tracking-[0.28em] text-primary disabled:cursor-not-allowed disabled:opacity-50 comic-border-secondary"
        >
          Next
        </button>
      </div>
    </div>
  );
}

function PostGrid({
  heading,
  description,
  page,
  isLoading,
  emptyMessage,
  onPageChange,
}: {
  heading: string;
  description: string;
  page: PageResponse<BlogPost> | undefined;
  isLoading: boolean;
  emptyMessage: string;
  onPageChange: (page: number) => void;
}) {
  return (
    <section className="bg-card p-6 md:p-8 comic-border">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-oswald text-xs uppercase tracking-[0.35em] text-muted-foreground">{description}</p>
          <h2 className="mt-2 font-bangers text-4xl text-primary">{heading}</h2>
        </div>
        <div className="bg-background px-4 py-2 font-oswald text-xs uppercase tracking-[0.28em] text-muted-foreground comic-border-secondary">
          {(page?.totalElements ?? 0)} stories
        </div>
      </div>

      {isLoading ? (
        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-64 animate-pulse bg-background comic-border" />
          ))}
        </div>
      ) : page?.content.length ? (
        <>
          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {page.content.map((post) => (
              <article key={post.id} className="overflow-hidden bg-background comic-border-secondary">
                <div className="relative aspect-[16/9] overflow-hidden bg-linear-to-br from-orange-800 via-primary/40 to-amber-300">
                  {post.thumbnailUrl ? (
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${post.thumbnailUrl})` }}
                    />
                  ) : null}
                  <div className="absolute inset-0 opacity-20 halftone-bg" />
                </div>
                <div className="p-5">
                  <p className="font-oswald text-xs uppercase tracking-[0.28em] text-muted-foreground">
                    {post.category?.name ?? "Latest"} • {formatDate(post.publishedAt ?? post.createdAt)}
                  </p>
                  <h3 className="mt-3 font-bangers text-3xl leading-none text-primary">{post.title}</h3>
                  <p className="mt-4 font-sans text-sm leading-7 text-muted-foreground">
                    {getPreview(post.content)}
                  </p>
                  <Link
                    href={`/posts/${post.slug}`}
                    className="mt-5 inline-flex items-center gap-2 bg-accent px-4 py-2 font-bangers text-xl text-accent-foreground comic-border"
                  >
                    Open story
                  </Link>
                </div>
              </article>
            ))}
          </div>
          <PaginationBar
            page={page.number}
            totalPages={page.totalPages}
            onChange={onPageChange}
          />
        </>
      ) : (
        <div className="mt-6 bg-background p-6 font-sans text-sm text-muted-foreground comic-border-secondary">
          {emptyMessage}
        </div>
      )}
    </section>
  );
}

export function ProfileDashboard() {
  const { isAuthenticated, user: currentUser } = useAppSelector((state) => state.auth);
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<ProfileTab>("info");
  const [postsPageIndex, setPostsPageIndex] = useState(0);
  const [bookmarksPageIndex, setBookmarksPageIndex] = useState(0);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [form, setForm] = useState({
    username: "",
    fullName: "",
    email: "",
    profileImage: "",
    coverImage: "",
    bio: "",
  });

  const { data: profile, isLoading, isError } = useGetMyProfileQuery(undefined, {
    skip: !isAuthenticated,
  });
  const [updateProfile, { isLoading: isSaving }] = useUpdateProfileMutation();

  const profileUsername = profile?.username ?? currentUser?.username;
  const postsQueryArg = profileUsername
    ? { username: profileUsername, page: postsPageIndex, size: 9 }
    : skipToken;

  const { data: postsPage, isLoading: postsLoading } = useGetUserPostsPageQuery(postsQueryArg);
  const { data: bookmarksPage, isLoading: bookmarksLoading } = useGetMyBookmarksQuery(
    isAuthenticated ? { page: bookmarksPageIndex, size: 9 } : skipToken,
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!profile) {
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setForm({
      username: profile.username ?? "",
      fullName: profile.fullName ?? "",
      email: profile.email ?? "",
      profileImage: profile.profileImage ?? "",
      coverImage: profile.coverImage ?? "",
      bio: profile.bio ?? "",
    });
  }, [profile]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSaveMessage(null);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSaveError(null);
  }, [activeTab]);

  const tabs = useMemo(
    () => [
      { id: "info" as const, label: "User information" },
      { id: "posts" as const, label: "My blogs" },
      { id: "bookmarks" as const, label: "Saved bookmarks" },
    ],
    [],
  );

  if (!mounted) {
    return (
      <main className="container mx-auto px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-[22rem_minmax(0,1fr)]">
          <div className="h-[32rem] animate-pulse bg-card comic-border" />
          <div className="h-[32rem] animate-pulse bg-card comic-border-secondary" />
        </div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-3xl bg-card p-8 text-center comic-border-secondary">
          <p className="font-oswald text-xs uppercase tracking-[0.35em] text-muted-foreground">Private profile</p>
          <h1 className="mt-3 font-bangers text-5xl text-primary md:text-6xl">Login required</h1>
          <p className="mt-4 font-sans text-base text-muted-foreground">
            Sign in first to manage your profile, blogs, and saved bookmarks.
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex items-center gap-2 bg-accent px-6 py-3 font-bangers text-xl text-accent-foreground comic-border"
          >
            <ArrowLeft size={18} />
            Back to home
          </Link>
        </div>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="container mx-auto px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-[22rem_minmax(0,1fr)]">
          <div className="h-[32rem] animate-pulse bg-card comic-border" />
          <div className="h-[32rem] animate-pulse bg-card comic-border-secondary" />
        </div>
      </main>
    );
  }

  if (isError || !profile) {
    return (
      <main className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-3xl bg-card p-8 text-center comic-border-secondary">
          <p className="font-oswald text-xs uppercase tracking-[0.35em] text-muted-foreground">Profile unavailable</p>
          <h1 className="mt-3 font-bangers text-5xl text-primary md:text-6xl">Unable to load profile</h1>
          <p className="mt-4 font-sans text-base text-muted-foreground">
            The current user profile could not be loaded from the API.
          </p>
        </div>
      </main>
    );
  }

  async function handleSaveProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaveMessage(null);
    setSaveError(null);

    try {
      await updateProfile({
        username: form.username,
        fullName: form.fullName,
        email: form.email,
        profileImage: form.profileImage || null,
        coverImage: form.coverImage || null,
        bio: form.bio || null,
      }).unwrap();
      setSaveMessage("Profile updated successfully.");
    } catch (error) {
      const message =
        typeof error === "object" && error !== null && "data" in error && typeof error.data === "string"
          ? error.data
          : "Unable to update your profile right now.";
      setSaveError(message);
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="container mx-auto px-4 py-10 md:py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-card px-4 py-2 font-oswald text-xs uppercase tracking-[0.28em] text-primary comic-border-secondary"
        >
          <ArrowLeft size={14} />
          Back to home
        </Link>

        <div className="mt-8 grid gap-8 lg:grid-cols-[22rem_minmax(0,1fr)]">
          <aside className="overflow-hidden bg-card comic-border">
            <div
              className="relative min-h-44 border-b-4 border-primary bg-linear-to-br from-primary via-orange-500 to-amber-300"
              style={profile.coverImage ? { backgroundImage: `url(${profile.coverImage})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
            >
              <div className="absolute inset-0 bg-background/20" />
              <div className="absolute inset-0 opacity-25 halftone-bg" />
            </div>

            <div className="relative px-6 pb-6">
              <div className="-mt-12 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-background bg-primary font-bangers text-3xl text-primary-foreground">
                {profile.profileImage ? (
                  <div
                    className="h-full w-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${profile.profileImage})` }}
                  />
                ) : (
                  getInitials(profile.fullName)
                )}
              </div>

              <div className="mt-4">
                <p className="font-oswald text-xs uppercase tracking-[0.35em] text-muted-foreground">Profile HQ</p>
                <h1 className="mt-2 font-bangers text-5xl leading-none text-primary">{profile.fullName}</h1>
                <p className="mt-2 font-sans text-base text-muted-foreground">@{profile.username}</p>
                <p className="mt-5 font-sans text-sm leading-7 text-foreground">
                  {profile.bio?.trim() || "Add a bio so readers know what kind of stories you publish."}
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
                  <p className="mt-2 font-bangers text-2xl text-primary">{postsPage?.totalElements ?? 0}</p>
                </div>
                <div className="bg-background p-4 comic-border-secondary">
                  <div className="flex items-center gap-2 font-oswald text-xs uppercase tracking-wider text-muted-foreground">
                    <Bookmark size={14} />
                    Saved stories
                  </div>
                  <p className="mt-2 font-bangers text-2xl text-primary">{bookmarksPage?.totalElements ?? 0}</p>
                </div>
              </div>

              <div className="mt-6 grid gap-2">
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
            </div>
          </aside>

          <div className="space-y-6">
            {activeTab === "info" ? (
              <section className="bg-card p-6 md:p-8 comic-border-secondary">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-oswald text-xs uppercase tracking-[0.35em] text-muted-foreground">Account editor</p>
                    <h2 className="mt-2 font-bangers text-4xl text-primary">User information</h2>
                  </div>
                  <div className="bg-background px-4 py-2 font-oswald text-xs uppercase tracking-[0.28em] text-muted-foreground comic-border">
                    Joined on {formatDate(profile.createdAt)}
                  </div>
                </div>

                <form onSubmit={handleSaveProfile} className="mt-6 space-y-5">
                  <div className="grid gap-5 md:grid-cols-2">
                    <label className="space-y-2">
                      <span className="inline-flex items-center gap-2 font-oswald text-xs uppercase tracking-[0.28em] text-muted-foreground">
                        <User2 size={14} />
                        Full name
                      </span>
                      <Input
                        value={form.fullName}
                        onChange={(event) => setForm((current) => ({ ...current, fullName: event.target.value }))}
                        className="h-11 bg-background comic-border-secondary"
                      />
                    </label>

                    <label className="space-y-2">
                      <span className="inline-flex items-center gap-2 font-oswald text-xs uppercase tracking-[0.28em] text-muted-foreground">
                        <User2 size={14} />
                        Username
                      </span>
                      <Input
                        value={form.username}
                        onChange={(event) => setForm((current) => ({ ...current, username: event.target.value }))}
                        className="h-11 bg-background comic-border-secondary"
                      />
                    </label>

                    <label className="space-y-2 md:col-span-2">
                      <span className="inline-flex items-center gap-2 font-oswald text-xs uppercase tracking-[0.28em] text-muted-foreground">
                        <Mail size={14} />
                        Email
                      </span>
                      <Input
                        type="email"
                        value={form.email}
                        onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                        className="h-11 bg-background comic-border-secondary"
                      />
                    </label>

                    <label className="space-y-2">
                      <span className="inline-flex items-center gap-2 font-oswald text-xs uppercase tracking-[0.28em] text-muted-foreground">
                        <ImagePlus size={14} />
                        Profile image URL
                      </span>
                      <Input
                        value={form.profileImage}
                        onChange={(event) => setForm((current) => ({ ...current, profileImage: event.target.value }))}
                        className="h-11 bg-background comic-border-secondary"
                      />
                    </label>

                    <label className="space-y-2">
                      <span className="inline-flex items-center gap-2 font-oswald text-xs uppercase tracking-[0.28em] text-muted-foreground">
                        <ImagePlus size={14} />
                        Cover image URL
                      </span>
                      <Input
                        value={form.coverImage}
                        onChange={(event) => setForm((current) => ({ ...current, coverImage: event.target.value }))}
                        className="h-11 bg-background comic-border-secondary"
                      />
                    </label>
                  </div>

                  <label className="block space-y-2">
                    <span className="font-oswald text-xs uppercase tracking-[0.28em] text-muted-foreground">Bio</span>
                    <Textarea
                      value={form.bio}
                      onChange={(event) => setForm((current) => ({ ...current, bio: event.target.value }))}
                      className="min-h-36 resize-y bg-background comic-border-secondary"
                    />
                  </label>

                  {saveMessage ? <p className="font-sans text-sm text-green-600">{saveMessage}</p> : null}
                  {saveError ? <p className="font-sans text-sm text-red-500">{saveError}</p> : null}

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="inline-flex items-center gap-2 bg-accent px-5 py-3 font-bangers text-xl text-accent-foreground disabled:cursor-not-allowed disabled:opacity-60 comic-border"
                    >
                      <Save size={16} />
                      {isSaving ? "Saving..." : "Save profile"}
                    </button>
                    <p className="font-sans text-sm text-muted-foreground">
                      Your join date stays fixed and cannot be edited.
                    </p>
                  </div>
                </form>
              </section>
            ) : null}

            {activeTab === "posts" ? (
              <PostGrid
                heading="My blogs"
                description={`Stories published by @${profile.username}`}
                page={postsPage}
                isLoading={postsLoading}
                emptyMessage="You do not have any published posts yet."
                onPageChange={setPostsPageIndex}
              />
            ) : null}

            {activeTab === "bookmarks" ? (
              <PostGrid
                heading="Saved bookmarks"
                description="Stories you saved for later"
                page={bookmarksPage}
                isLoading={bookmarksLoading}
                emptyMessage="You have not bookmarked any stories yet."
                onPageChange={setBookmarksPageIndex}
              />
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
}
