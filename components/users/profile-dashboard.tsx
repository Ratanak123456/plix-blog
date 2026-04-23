"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type ChangeEvent, useEffect, useMemo, useState } from "react";
import { ArrowLeft, Zap, Skull, Trash2, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import { skipToken } from "@reduxjs/toolkit/query";
import { motion, AnimatePresence } from "framer-motion";
import { logout } from "@/lib/features/auth/auth-slice";
import { getGeneralErrorMessage } from "@/lib/utils/auth-utils";
import { navigateWithFallback } from "@/lib/utils/client-navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  type BlogPost,
  type PageResponse,
  useChangePasswordMutation,
  useDeletePostMutation,
  useGetMyBookmarksQuery,
  useGetMyProfileQuery,
  useGetUserPostsPageQuery,
  useUpdateProfileMutation,
  useUploadImageMutation,
} from "@/lib/services/auth-api";
import { BlogCard } from "@/components/blog/blog-card";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { getFileUploadErrorMessage } from "@/lib/utils/file-upload";
import { getRenderableImageUrl } from "@/lib/utils/image-url";
import { ProfileSidebar } from "./profile-sidebar";
import { UserInfoForm } from "./user-info-form";
import { ChangePasswordForm } from "./change-password-form";
import { formatDate } from "./profile-utils";

type ProfileTab = "info" | "posts" | "bookmarks";
type ImageField = "profileImage" | "coverImage";

// ─── Comic Components ──────────────────────────────────────────

function ThickBorder({ children, className = "", color = "foreground" }: {
  children: React.ReactNode;
  className?: string;
  color?: string;
}) {
  return (
    <div
      className={`border-[4px] border-${color} ${className}`}
      style={{ boxShadow: "6px 6px 0px 0px hsl(var(--foreground))" }}
    >
      {children}
    </div>
  );
}

function BenDayDots({ className = "", size = 8, color = "var(--foreground)" }: {
  className?: string;
  size?: number;
  color?: string;
}) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 opacity-[0.08] ${className}`}
      style={{
        backgroundImage: `radial-gradient(circle, ${color} 2px, transparent 2px)`,
        backgroundSize: `${size}px ${size}px`,
      }}
    />
  );
}

function JaggedDivider({ className = "" }: { className?: string }) {
  return (
    <svg className={`w-full h-3 ${className}`} viewBox="0 0 100 12" preserveAspectRatio="none">
      <polygon
        points="0,6 4,0 8,6 12,0 16,6 20,0 24,6 28,0 32,6 36,0 40,6 44,0 48,6 52,0 56,6 60,0 64,6 68,0 72,6 76,0 80,6 84,0 88,6 92,0 96,6 100,0 100,12 0,12"
        fill="hsl(var(--foreground))"
      />
    </svg>
  );
}

function SoundFX({ text, className = "" }: { text: string; className?: string }) {
  return (
    <span
      className={`font-bangers text-2xl uppercase leading-none ${className}`}
      style={{
        WebkitTextStroke: "1.5px hsl(var(--foreground))",
        textShadow: "3px 3px 0px hsl(var(--foreground))",
      }}
    >
      {text}
    </span>
  );
}

// ─── Pagination ────────────────────────────────────────────────

function PaginationBar({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i).slice(
    Math.max(0, page - 1),
    Math.min(totalPages, page + 2),
  );

  return (
    <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t-[3px] border-foreground pt-6">
      <p className="font-oswald text-xs uppercase tracking-[0.28em] text-muted-foreground">
        Page <span className="font-bangers text-lg text-accent">{page + 1}</span> of {totalPages}
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => onChange(page - 1)}
          disabled={page === 0}
          className="bg-card px-4 py-2 font-oswald text-xs uppercase tracking-[0.28em] text-primary border-[3px] border-foreground transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-x-0 disabled:hover:translate-y-0"
          style={{ boxShadow: "4px 4px 0px 0px hsl(var(--foreground))" }}
        >
          Prev
        </button>
        {pages.map((pageIndex) => (
          <button
            key={pageIndex}
            type="button"
            onClick={() => onChange(pageIndex)}
            className={`px-4 py-2 font-oswald text-xs uppercase tracking-[0.28em] border-[3px] border-foreground transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none ${
              pageIndex === page
                ? "bg-accent text-accent-foreground"
                : "bg-card text-muted-foreground"
            }`}
            style={pageIndex !== page ? { boxShadow: "4px 4px 0px 0px hsl(var(--foreground))" } : {}}
          >
            {pageIndex + 1}
          </button>
        ))}
        <button
          type="button"
          onClick={() => onChange(page + 1)}
          disabled={page >= totalPages - 1}
          className="bg-card px-4 py-2 font-oswald text-xs uppercase tracking-[0.28em] text-primary border-[3px] border-foreground transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-x-0 disabled:hover:translate-y-0"
          style={{ boxShadow: "4px 4px 0px 0px hsl(var(--foreground))" }}
        >
          Next
        </button>
      </div>
    </div>
  );
}

// ─── Post Grid ─────────────────────────────────────────────────

function PostGrid({
  heading,
  description,
  page,
  isLoading,
  emptyMessage,
  onPageChange,
  showEditButton = false,
  showStatus = false,
  statusFilter,
  onStatusChange,
  onDelete,
}: {
  heading: string;
  description: string;
  page: PageResponse<BlogPost> | undefined;
  isLoading: boolean;
  emptyMessage: string;
  onPageChange: (page: number) => void;
  showEditButton?: boolean;
  showStatus?: boolean;
  statusFilter?: string;
  onStatusChange?: (status: string) => void;
  onDelete?: (id: string) => void;
}) {
  const [postToDelete, setPostToDelete] = useState<string | null>(null);

  const filteredContent = useMemo(() => {
    if (!page?.content) return [];
    return page.content.filter((post) => !statusFilter || post.status === statusFilter);
  }, [page, statusFilter]);

  return (
    <ThickBorder className="relative bg-card p-6 md:p-8">
      <BenDayDots size={10} />

      <AlertDialog open={!!postToDelete} onOpenChange={(open) => !open && setPostToDelete(null)}>
        <AlertDialogContent className="border-[4px] border-foreground bg-background" style={{ boxShadow: "8px 8px 0px 0px hsl(var(--destructive))" }}>
          <AlertDialogHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-8 w-8 text-destructive" />
              <AlertDialogTitle className="font-bangers text-3xl uppercase text-destructive">
                Danger Zone!
              </AlertDialogTitle>
            </div>
            <AlertDialogDescription className="font-oswald text-lg uppercase tracking-wide text-foreground">
              This action cannot be undone. Your story will be permanently erased from the archives!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6 gap-3">
            <AlertDialogCancel className="bg-card px-6 py-3 font-bangers text-xl uppercase border-[3px] border-foreground transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none" style={{ boxShadow: "4px 4px 0px 0px hsl(var(--foreground))" }}>
              Abort!
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (postToDelete && onDelete) {
                  onDelete(postToDelete);
                  setPostToDelete(null);
                }
              }}
              className="bg-destructive px-6 py-3 font-bangers text-xl uppercase text-destructive-foreground border-[3px] border-foreground transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
              style={{ boxShadow: "4px 4px 0px 0px hsl(var(--foreground))" }}
            >
              <Trash2 className="mr-2 h-5 w-5" />
              Destroy It
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Header */}
      <div className="relative z-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-oswald text-xs uppercase tracking-[0.35em] text-muted-foreground">
            {description}
          </p>
          <h2
            className="mt-2 font-bangers text-4xl uppercase text-primary sm:text-5xl"
            style={{ textShadow: "3px 3px 0px hsl(var(--secondary))" }}
          >
            {heading}
          </h2>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {onStatusChange && (
            <select
              value={statusFilter}
              onChange={(e) => onStatusChange(e.target.value)}
              className="bg-background px-3 py-2 font-oswald text-xs uppercase tracking-[0.28em] text-primary border-[3px] border-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              style={{ boxShadow: "3px 3px 0px 0px hsl(var(--foreground))" }}
            >
              <option value="">All Issues</option>
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Draft</option>
            </select>
          )}
          <ThickBorder className="bg-background px-4 py-2">
            <span className="font-oswald text-xs uppercase tracking-[0.28em] text-muted-foreground">
              <span className="font-bangers text-lg text-accent">{page?.totalElements ?? 0}</span> stories
            </span>
          </ThickBorder>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="relative z-10 mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-64 animate-pulse bg-muted border-[3px] border-foreground" style={{ boxShadow: "4px 4px 0px 0px hsl(var(--foreground))" }} />
          ))}
        </div>
      ) : filteredContent.length ? (
        <>
          <div className="relative z-10 mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredContent.map((post, index) => (
              <div key={post.id} className="relative group">
                <BlogCard
                  post={post}
                  index={index}
                  onDelete={onDelete ? (id) => setPostToDelete(id) : undefined}
                  showStatus={showStatus}
                  showEditButton={showEditButton}
                />
              </div>
            ))}
          </div>
          <PaginationBar
            page={page!.number}
            totalPages={page!.totalPages}
            onChange={onPageChange}
          />
        </>
      ) : (
        <div className="relative z-10 mt-6 flex flex-col items-center justify-center bg-background p-12 text-center border-[3px] border-foreground" style={{ boxShadow: "6px 6px 0px 0px hsl(var(--foreground))" }}>
          <div className="mb-4 flex items-center justify-center h-20 w-20 bg-muted border-[3px] border-foreground">
            <Skull className="h-10 w-10 text-muted-foreground opacity-40" />
          </div>
          <SoundFX text="EMPTY!" className="text-muted-foreground mb-2" />
          <p className="max-w-xs font-oswald text-lg uppercase tracking-wider text-muted-foreground">
            {emptyMessage}
          </p>
          {!statusFilter && (
            <Link
              href="/write"
              className="mt-6 inline-flex items-center gap-2 bg-accent px-6 py-3 font-bangers text-xl uppercase text-accent-foreground border-[3px] border-foreground transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
              style={{ boxShadow: "4px 4px 0px 0px hsl(var(--foreground))" }}
            >
              <Zap className="h-5 w-5 fill-current" />
              Start Writing
            </Link>
          )}
        </div>
      )}
    </ThickBorder>
  );
}

// ─── Main Dashboard ────────────────────────────────────────────

export function ProfileDashboard() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user: currentUser } = useAppSelector((state) => state.auth);
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<ProfileTab>("info");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [postsPageIndex, setPostsPageIndex] = useState(0);
  const [bookmarksPageIndex, setBookmarksPageIndex] = useState(0);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [saveError, setSaveError] = useState<string | null>(null);
  const [deletionResult, setDeletionResult] = useState<{ success: boolean; message: string } | null>(null);
  const [form, setForm] = useState({
    username: "",
    fullName: "",
    email: "",
    profileImage: "",
    coverImage: "",
    bio: "",
  });
  const [uploadingField, setUploadingField] = useState<ImageField | null>(null);
  const [uploadMessages, setUploadMessages] = useState<Record<ImageField, string | null>>({
    profileImage: null,
    coverImage: null,
  });

  const { data: profile, isLoading, isError } = useGetMyProfileQuery(undefined, {
    skip: !isAuthenticated,
  });
  const [updateProfile, { isLoading: isSaving }] = useUpdateProfileMutation();
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();
  const [deletePost] = useDeletePostMutation();
  const [uploadImage, { isLoading: isUploadingImage }] = useUploadImageMutation();

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const [isTabMenuOpen, setIsTabMenuOpen] = useState(false);

  const profileUsername = profile?.username ?? currentUser?.username;
  const postsQueryArg = profileUsername
    ? { username: profileUsername, page: postsPageIndex, size: 9 }
    : skipToken;

  const { data: postsPage, isLoading: postsLoading, refetch: refetchPosts } = useGetUserPostsPageQuery(postsQueryArg);
  const { data: bookmarksPage, isLoading: bookmarksLoading, refetch: refetchBookmarks } = useGetMyBookmarksQuery(
    isAuthenticated ? { page: bookmarksPageIndex, size: 9 } : skipToken,
  );

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => { if (!profile) return; setForm({ username: profile.username ?? "", fullName: profile.fullName ?? "", email: profile.email ?? "", profileImage: profile.profileImage ?? "", coverImage: profile.coverImage ?? "", bio: profile.bio ?? "" }); setUploadMessages({ profileImage: null, coverImage: null }); }, [profile]);
  useEffect(() => { setSaveMessage(null); setSaveError(null); if (activeTab !== "posts") { setStatusFilter(""); setPostsPageIndex(0); } }, [activeTab]);

  const tabs = useMemo(() => [
    { id: "info" as const, label: "User Info" },
    { id: "posts" as const, label: "My Blogs" },
    { id: "bookmarks" as const, label: "Bookmarks" },
  ], []);

  if (!mounted) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="grid gap-8 lg:grid-cols-[22rem_minmax(0,1fr)]">
            <div className="h-[32rem] animate-pulse bg-muted border-[4px] border-foreground" style={{ boxShadow: "6px 6px 0px 0px hsl(var(--foreground))" }} />
            <div className="h-[32rem] animate-pulse bg-muted border-[4px] border-foreground" style={{ boxShadow: "6px 6px 0px 0px hsl(var(--foreground))" }} />
          </div>
        </div>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="grid gap-8 lg:grid-cols-[22rem_minmax(0,1fr)]">
            <div className="h-[32rem] animate-pulse bg-muted border-[4px] border-foreground" style={{ boxShadow: "6px 6px 0px 0px hsl(var(--foreground))" }} />
            <div className="h-[32rem] animate-pulse bg-muted border-[4px] border-foreground" style={{ boxShadow: "6px 6px 0px 0px hsl(var(--foreground))" }} />
          </div>
        </div>
      </main>
    );
  }

  if (isError || !profile) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16">
          <ThickBorder className="mx-auto max-w-3xl bg-card p-8 text-center">
            <BenDayDots size={12} />
            <div className="relative z-10">
              <p className="font-oswald text-xs uppercase tracking-[0.35em] text-muted-foreground">System Failure</p>
              <h1 className="mt-3 font-bangers text-5xl uppercase text-primary sm:text-6xl" style={{ textShadow: "4px 4px 0px hsl(var(--secondary))" }}>
                Profile Offline!
              </h1>
              <div className="mt-4 flex justify-center">
                <XCircle className="h-16 w-16 text-destructive" />
              </div>
              <p className="mt-4 font-oswald text-lg uppercase text-muted-foreground">
                The current user profile could not be loaded from the API.
              </p>
            </div>
          </ThickBorder>
        </div>
      </main>
    );
  }

  const previewFullName = profile.fullName;
  const previewUsername = profile.username;
  const previewBio = profile.bio;
  const previewProfileImage = (profile.profileImage || "").trim();
  const previewCoverImage = (profile.coverImage || "").trim();
  const previewCoverImageUrl = getRenderableImageUrl(previewCoverImage);
  const previewProfileImageUrl = getRenderableImageUrl(previewProfileImage);

  function clearFieldError(field: keyof typeof form) {
    setFieldErrors((current) => {
      if (!(field in current)) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  async function handleImageUpload(field: ImageField, event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setSaveMessage(null);
    setSaveError(null);
    clearFieldError(field);
    setUploadMessages((current) => ({ ...current, [field]: null }));
    setUploadingField(field);

    try {
      const uploadedFile = await uploadImage(file).unwrap();
      setForm((current) => ({ ...current, [field]: uploadedFile.location }));
      setUploadMessages((current) => ({
        ...current,
        [field]: `Uploaded "${file.name}". Save to persist!`,
      }));
    } catch (error) {
      setFieldErrors((current) => ({ ...current, [field]: getFileUploadErrorMessage(error) }));
    } finally {
      setUploadingField((current) => (current === field ? null : current));
    }
  }

  function validateProfileForm() {
    const errors: Record<string, string> = {};
    if (!form.username.trim()) errors.username = "Username required!";
    else if (form.username.length < 3 || form.username.length > 30) errors.username = "3-30 chars only!";
    else if (!/^[A-Za-z0-9_]+$/.test(form.username)) errors.username = "Letters, numbers, underscores!";

    if (!form.email.trim()) errors.email = "Email required!";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = "Invalid email!";

    if (!form.fullName.trim()) errors.fullName = "Name required!";
    else if (form.fullName.trim().length < 3 || form.fullName.trim().length > 100) errors.fullName = "3-100 chars!";

    if (form.bio.length > 500) errors.bio = "Max 500 chars!";
    if (form.profileImage && !/^https?:\/\/.+$/i.test(form.profileImage)) errors.profileImage = "Valid URL only!";
    if (form.coverImage && !/^https?:\/\/.+$/i.test(form.coverImage)) errors.coverImage = "Valid URL only!";

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSaveProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaveMessage(null);
    setSaveError(null);
    if (isUploadingImage) { setSaveError("Wait for upload to finish!"); return; }
    if (!validateProfileForm()) return;

    try {
      await updateProfile({
        username: form.username,
        fullName: form.fullName,
        email: form.email,
        profileImage: form.profileImage || null,
        coverImage: form.coverImage || null,
        bio: form.bio || null,
      }).unwrap();
      setSaveMessage("Profile updated successfully!");
    } catch (error) {
      setSaveError(getGeneralErrorMessage(error));
    }
  }

  async function handlePasswordChange(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPasswordMessage(null);
    setPasswordError(null);

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("Passwords don't match!"); return;
    }
    if (passwordForm.newPassword.length < 8) { setPasswordError("Min 8 chars!"); return; }
    if (!/[A-Z]/.test(passwordForm.newPassword)) { setPasswordError("Need uppercase!"); return; }
    if (!/[a-z]/.test(passwordForm.newPassword)) { setPasswordError("Need lowercase!"); return; }
    if (!/\d/.test(passwordForm.newPassword)) { setPasswordError("Need a number!"); return; }

    try {
      await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      }).unwrap();
      setPasswordMessage("Password changed!");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      setPasswordError(getGeneralErrorMessage(error));
    }
  }

  async function handleDeletePost(id: string) {
    try {
      await deletePost(id).unwrap();
      setDeletionResult({ success: true, message: "Story destroyed! Removed from archives." });
      refetchPosts();
      refetchBookmarks();
    } catch (error) {
      setDeletionResult({ success: false, message: getGeneralErrorMessage(error) });
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Deletion Result Dialog */}
      <AlertDialog open={!!deletionResult} onOpenChange={(open) => !open && setDeletionResult(null)}>
        <AlertDialogContent className="border-[4px] border-foreground bg-background" style={{ boxShadow: deletionResult?.success ? "8px 8px 0px 0px hsl(var(--primary))" : "8px 8px 0px 0px hsl(var(--destructive))" }}>
          <AlertDialogHeader>
            <div className="flex items-center gap-2">
              {deletionResult?.success ? <CheckCircle2 className="h-8 w-8 text-primary" /> : <XCircle className="h-8 w-8 text-destructive" />}
              <AlertDialogTitle className={`font-bangers text-3xl uppercase ${deletionResult?.success ? "text-primary" : "text-destructive"}`}>
                {deletionResult?.success ? "Mission Accomplished!" : "System Error!"}
              </AlertDialogTitle>
            </div>
            <AlertDialogDescription className="font-oswald text-lg uppercase tracking-wide text-foreground">
              {deletionResult?.message}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6">
            <AlertDialogAction
              onClick={() => setDeletionResult(null)}
              className="bg-primary px-6 py-3 font-bangers text-xl uppercase text-primary-foreground border-[3px] border-foreground transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
              style={{ boxShadow: "4px 4px 0px 0px hsl(var(--foreground))" }}
            >
              Acknowledged
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <section className="container mx-auto px-4 py-10 md:py-12">
        {/* Back button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-card px-4 py-2 font-oswald text-xs uppercase tracking-[0.28em] text-primary border-[3px] border-foreground transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
          style={{ boxShadow: "4px 4px 0px 0px hsl(var(--foreground))" }}
        >
          <ArrowLeft size={14} />
          Back to Base
        </Link>

        <div className="mt-8 grid gap-8 lg:grid-cols-[22rem_minmax(0,1fr)]">
          {/* Sidebar */}
          <ProfileSidebar
            profile={profile}
            previewFullName={previewFullName}
            previewUsername={previewUsername}
            previewBio={previewBio}
            previewProfileImageUrl={previewProfileImageUrl}
            previewCoverImageUrl={previewCoverImageUrl}
            postsCount={postsPage?.totalElements ?? 0}
            bookmarksCount={bookmarksPage?.totalElements ?? 0}
            activeTab={activeTab}
            tabs={tabs}
            isTabMenuOpen={isTabMenuOpen}
            setIsTabMenuOpen={setIsTabMenuOpen}
            setActiveTab={setActiveTab}
            formatDate={formatDate}
            onLogout={() => {
              dispatch(logout());
              navigateWithFallback(router, "/");
            }}
          />

          {/* Main Content */}
          <div className="space-y-6">
            <AnimatePresence mode="wait">
              {activeTab === "info" && (
                <motion.div
                  key="info"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <UserInfoForm
                    form={form}
                    setForm={setForm}
                    fieldErrors={fieldErrors}
                    clearFieldError={clearFieldError}
                    uploadingField={uploadingField}
                    uploadMessages={uploadMessages}
                    isUploadingImage={isUploadingImage}
                    isSaving={isSaving}
                    saveMessage={saveMessage}
                    saveError={saveError}
                    handleImageUpload={handleImageUpload}
                    handleSaveProfile={handleSaveProfile}
                    joinedDate={profile.createdAt}
                  />

                  <div className="py-4">
                    <JaggedDivider />
                  </div>

                  <ChangePasswordForm
                    passwordForm={passwordForm}
                    setPasswordForm={setPasswordForm}
                    handlePasswordChange={handlePasswordChange}
                    isChangingPassword={isChangingPassword}
                    passwordMessage={passwordMessage}
                    passwordError={passwordError}
                  />
                </motion.div>
              )}

              {activeTab === "posts" && (
                <motion.div
                  key="posts"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <PostGrid
                    heading="My Blogs"
                    description={statusFilter ? `Showing ${statusFilter.toLowerCase()} issues` : `Stories by @${profile.username}`}
                    page={postsPage}
                    isLoading={postsLoading}
                    emptyMessage={statusFilter === "DRAFT" ? "No drafts in your secret archives." : statusFilter === "PUBLISHED" ? "No published issues. Hit the press!" : "Your story arc hasn't started. Create your first post!"}
                    onPageChange={setPostsPageIndex}
                    showStatus={true}
                    showEditButton={true}
                    statusFilter={statusFilter}
                    onStatusChange={(status) => { setStatusFilter(status); setPostsPageIndex(0); }}
                    onDelete={handleDeletePost}
                  />
                </motion.div>
              )}

              {activeTab === "bookmarks" && (
                <motion.div
                  key="bookmarks"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <PostGrid
                    heading="Saved Bookmarks"
                    description="Stories you saved for later"
                    page={bookmarksPage}
                    isLoading={bookmarksLoading}
                    emptyMessage="No bookmarks yet. Start exploring!"
                    onPageChange={setBookmarksPageIndex}
                    onDelete={handleDeletePost}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </main>
  );
}