"use client";

import Link from "next/link";
import { Check, Copy, ExternalLink, Link2, Bookmark } from "lucide-react";
import { useMemo, useState } from "react";
import { SiFacebook, SiX } from "react-icons/si";
import {
  useGetPostBookmarkStatusQuery,
  useTogglePostBookmarkMutation,
} from "@/lib/services/auth-api";
import { useAppSelector } from "@/lib/store";

type PostSharePanelProps = {
  postId: string;
  slug: string;
  title: string;
  initialBookmarked?: boolean;
};

type ShareCardProps = {
  href?: string;
  icon: React.ReactNode;
  label: string;
  description: string;
  onClick?: () => void;
};

function ShareCard({ href, icon, label, description, onClick }: ShareCardProps) {
  const className =
    "flex items-center justify-between gap-4 bg-background p-4 text-left transition-transform hover:-translate-y-0.5 comic-border";

  const content = (
    <>
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
          {icon}
        </div>
        <div>
          <p className="font-bangers text-2xl text-primary">{label}</p>
          <p className="font-sans text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <ExternalLink size={16} className="shrink-0 text-muted-foreground" />
    </>
  );

  if (href) {
    return (
      <Link href={href} target="_blank" rel="noreferrer" className={className}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={className}>
      {content}
    </button>
  );
}

export function PostSharePanel({ postId, slug, title, initialBookmarked = false }: PostSharePanelProps) {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [copied, setCopied] = useState(false);
  const [bookmarkedOverride, setBookmarkedOverride] = useState<boolean | null>(null);
  const { data: bookmarkedStatus } = useGetPostBookmarkStatusQuery(postId, { skip: !isAuthenticated });
  const [toggleBookmark, { isLoading: bookmarkPending }] = useTogglePostBookmarkMutation();
  const shareUrl = useMemo(() => {
    if (typeof window === "undefined") {
      return `/posts/${slug}`;
    }

    return `${window.location.origin}/posts/${slug}`;
  }, [slug]);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  async function handleBookmarkToggle() {
    if (!isAuthenticated || bookmarkPending) {
      return;
    }

    const nextBookmarked = !bookmarked;
    setBookmarkedOverride(nextBookmarked);

    try {
      const response = await toggleBookmark(postId).unwrap();
      setBookmarkedOverride(response.bookmarked);
    } catch {
      setBookmarkedOverride(null);
    }
  }

  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);
  const bookmarked = bookmarkedOverride ?? (isAuthenticated ? (bookmarkedStatus ?? initialBookmarked) : false);

  return (
    <section className="bg-card p-6 comic-border-accent">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-oswald text-xs uppercase tracking-[0.35em] text-muted-foreground">Share this story</p>
          <h2 className="mt-2 font-bangers text-4xl text-primary">Choose a platform</h2>
        </div>
        <button
          type="button"
          onClick={copyLink}
          className="inline-flex items-center gap-2 bg-background px-4 py-2 font-oswald text-xs uppercase tracking-[0.28em] text-muted-foreground comic-border"
        >
          {copied ? <Check size={14} className="text-primary" /> : <Copy size={14} className="text-primary" />}
          {copied ? "Link copied" : "Copy link"}
        </button>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <ShareCard
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
          icon={<SiFacebook size={20} />}
          label="Facebook"
          description="Open Facebook share and publish this post."
        />
        <ShareCard
          href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
          icon={<SiX size={20} />}
          label="X"
          description="Open X composer with the post link attached."
        />
      </div>

      <div className="mt-4">
        <button
          type="button"
          onClick={handleBookmarkToggle}
          disabled={!isAuthenticated || bookmarkPending}
          className={`flex w-full items-center justify-between gap-4 bg-background p-4 text-left transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 comic-border ${
            bookmarked ? "border-accent bg-accent/10" : ""
          }`}
          title={isAuthenticated ? "Save this post" : "Login to save posts"}
        >
          <div className="flex items-center gap-4">
            <div className={`flex h-12 w-12 items-center justify-center rounded-full ${bookmarked ? "bg-accent text-accent-foreground" : "bg-primary text-primary-foreground"}`}>
              <Bookmark size={20} className={bookmarked ? "fill-current" : ""} />
            </div>
            <div>
              <p className="font-bangers text-2xl text-primary">{bookmarked ? "Saved" : "Save for later"}</p>
              <p className="font-sans text-sm text-muted-foreground">
                {isAuthenticated
                  ? "Keep this story in your bookmark collection."
                  : "Sign in to save this story to your profile."}
              </p>
            </div>
          </div>
          <ExternalLink size={16} className="shrink-0 text-muted-foreground" />
        </button>
      </div>

      <div className="mt-6 bg-background p-4 comic-border-secondary">
        <div className="flex items-start gap-3">
          <Link2 size={18} className="mt-1 shrink-0 text-primary" />
          <div>
            <p className="font-oswald text-xs uppercase tracking-[0.28em] text-muted-foreground">Direct link</p>
            <p className="mt-2 break-all font-sans text-sm text-foreground">{shareUrl}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
