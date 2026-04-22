"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type ChangeEvent, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Bookmark,
  CalendarDays,
  ChevronDown,
  Edit,
  Eye,
  EyeOff,
  FileText,
  ImagePlus,
  LoaderCircle,
  Lock,
  LogOut,
  Mail,
  Save,
  Trash2,
  User2,
} from "lucide-react";
import { skipToken } from "@reduxjs/toolkit/query";
import { logout } from "@/lib/features/auth/auth-slice";
import { getGeneralErrorMessage } from "@/lib/utils/auth-utils";
import { navigateWithFallback } from "@/lib/utils/client-navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
} from "@/lib/services/auth-api";
import { BlogCard } from "@/components/blog/blog-card";
import { PostActions } from "@/components/home/post-actions";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import {
  getFileUploadErrorMessage,
  uploadImageFile,
} from "@/lib/utils/file-upload";
import { getRenderableImageUrl } from "@/lib/utils/image-url";

type ProfileTab = "info" | "posts" | "bookmarks";
type ImageField = "profileImage" | "coverImage";

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
  const router = useRouter();
  const [isEditMode, setIsEditMode] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);

  const filteredContent = useMemo(() => {
    if (!page?.content) return [];
    return page.content.filter((post) => !statusFilter || post.status === statusFilter);
  }, [page, statusFilter]);

  return (
    <section className="bg-card p-6 md:p-8 comic-border">
      <AlertDialog open={!!postToDelete} onOpenChange={(open) => !open && setPostToDelete(null)}>
        <AlertDialogContent className="comic-border-secondary">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-bangers text-3xl text-primary uppercase">Danger Zone!</AlertDialogTitle>
            <AlertDialogDescription className="font-oswald text-lg uppercase tracking-wide">
              This action cannot be undone. This will permanently delete your story and remove its data from our archives.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel className="font-bangers text-xl comic-border-secondary">Abort Mission</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (postToDelete && onDelete) {
                  onDelete(postToDelete);
                  setPostToDelete(null);
                }
              }}
              className="bg-destructive text-destructive-foreground font-bangers text-xl hover:bg-destructive/90 comic-border"
            >
              Confirm Deletion
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-oswald text-xs uppercase tracking-[0.35em] text-muted-foreground">{description}</p>
          <h2 className="mt-2 font-bangers text-4xl text-primary">{heading}</h2>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {onStatusChange && (
            <select
              value={statusFilter}
              onChange={(e) => onStatusChange(e.target.value)}
              className="bg-background px-3 py-2 font-oswald text-xs uppercase tracking-[0.28em] text-primary comic-border-secondary focus:outline-none"
            >
              <option value="">All Status</option>
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Draft</option>
            </select>
          )}
          {showEditButton && (
            <button
              type="button"
              onClick={() => setIsEditMode(!isEditMode)}
              className={`inline-flex items-center gap-2 px-4 py-2 font-oswald text-xs uppercase tracking-[0.28em] comic-border-secondary transition-colors ${
                isEditMode ? "bg-primary text-primary-foreground" : "bg-background text-primary hover:bg-muted"
              }`}
            >
              <Edit size={14} />
              {isEditMode ? "Exit Edit Mode" : "Edit Blogs"}
            </button>
          )}
          <div className="bg-background px-4 py-2 font-oswald text-xs uppercase tracking-[0.28em] text-muted-foreground comic-border-secondary">
            {(page?.totalElements ?? 0)} stories
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-64 animate-pulse bg-background comic-border" />
          ))}
        </div>
      ) : filteredContent.length ? (
        <>
          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredContent.map((post, index) => {
              // Use standard BlogCard for published posts when not editing
              if (post.status === "PUBLISHED" && !isEditMode) {
                return <BlogCard key={post.id} post={post} index={index} onDelete={onDelete} />;
              }

              // Use manual rendering for Drafts or when Edit Mode is active
              return (
                <article
                  key={post.id}
                  className={`overflow-hidden bg-background comic-border-secondary transition-transform ${
                    isEditMode
                      ? "hover:scale-[1.02] cursor-pointer ring-2 ring-primary ring-offset-2"
                      : ""
                  }`}
                  onClick={() => {
                    if (isEditMode) {
                      navigateWithFallback(router, `/write/${post.slug}`);
                    }
                  }}
                >
                  <div className="relative aspect-[16/9] overflow-hidden bg-linear-to-br from-orange-800 via-primary/40 to-amber-300">
                    {getRenderableImageUrl(post.thumbnailUrl) ? (
                      <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url("${getRenderableImageUrl(post.thumbnailUrl)}")` }}
                      />
                    ) : null}
                    <div className="absolute inset-0 opacity-20 halftone-bg" />
                    {showStatus && (
                      <div className="absolute top-3 right-3 bg-accent px-2 py-1 font-oswald text-[10px] uppercase tracking-wider text-accent-foreground comic-border">
                        {post.status}
                      </div>
                    )}
                    {isEditMode && (
                      <div className="absolute inset-0 flex items-center justify-center bg-primary/20 backdrop-blur-[2px]">
                        <div className="bg-primary px-4 py-2 font-bangers text-2xl text-primary-foreground comic-border shadow-xl">
                          Click to Edit
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <p className="font-oswald text-xs uppercase tracking-[0.28em] text-muted-foreground">
                      {post.category?.name ?? "Latest"} • {formatDate(post.publishedAt ?? post.createdAt)}
                    </p>
                    <h3 className="mt-3 font-bangers text-3xl leading-none text-primary line-clamp-2 min-h-[3.5rem]">
                      {post.title}
                    </h3>

                    <div className="mt-4 border-t border-border pt-4">
                      <PostActions
                        postId={post.id}
                        initialLikeCount={post.likeCount}
                        initialBookmarkCount={post.bookmarkCount}
                        initialLiked={post.likedByCurrentUser}
                        initialBookmarked={post.bookmarkedByCurrentUser}
                        compact
                      />
                    </div>

                    <div className="mt-6 flex items-center justify-between gap-2">
                      <Link
                        href={isEditMode ? `/write/${post.slug}` : `/posts/${post.slug}`}
                        className="inline-flex items-center gap-2 bg-accent px-4 py-2 font-bangers text-xl text-accent-foreground comic-border"
                      >
                        {isEditMode ? "Edit story" : "Open story"}
                      </Link>
                      {onDelete && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPostToDelete(post.id);
                          }}
                          className="inline-flex h-11 w-11 items-center justify-center bg-destructive text-destructive-foreground transition-all hover:scale-105 active:scale-95 comic-border"
                          title="Delete this blog"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
          <PaginationBar
            page={page!.number}
            totalPages={page!.totalPages}
            onChange={onPageChange}
          />
        </>
      ) : (
        <div className="mt-6 flex flex-col items-center justify-center bg-background p-12 text-center comic-border-secondary">
          <div className="mb-4 h-16 w-16 opacity-20 halftone-bg" />
          <p className="max-w-xs font-oswald text-lg uppercase tracking-wider text-muted-foreground">
            {emptyMessage}
          </p>
          {!statusFilter && (
            <Link
              href="/write"
              className="mt-6 bg-accent px-6 py-2 font-bangers text-xl text-accent-foreground comic-border"
            >
              Start Writing
            </Link>
          )}
        </div>
      )}
    </section>
  );
}

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
  const [uploadMessages, setUploadMessages] = useState<
    Record<ImageField, string | null>
  >({
    profileImage: null,
    coverImage: null,
  });

  const { data: profile, isLoading, isError } = useGetMyProfileQuery(undefined, {
    skip: !isAuthenticated,
  });
  const [updateProfile, { isLoading: isSaving }] = useUpdateProfileMutation();
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();
  const [deletePost] = useDeletePostMutation();

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isTabMenuOpen, setIsTabMenuOpen] = useState(false);

  const profileUsername = profile?.username ?? currentUser?.username;
  const postsQueryArg = profileUsername
    ? { 
        username: profileUsername, 
        page: postsPageIndex, 
        size: 9 
      }
    : skipToken;

  const { data: postsPage, isLoading: postsLoading, refetch: refetchPosts } = useGetUserPostsPageQuery(postsQueryArg);
  const { data: bookmarksPage, isLoading: bookmarksLoading, refetch: refetchBookmarks } = useGetMyBookmarksQuery(
    isAuthenticated ? { page: bookmarksPageIndex, size: 9 } : skipToken,
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!profile) {
      return;
    }

    setForm({
      username: profile.username ?? "",
      fullName: profile.fullName ?? "",
      email: profile.email ?? "",
      profileImage: profile.profileImage ?? "",
      coverImage: profile.coverImage ?? "",
      bio: profile.bio ?? "",
    });
    setUploadMessages({
      profileImage: null,
      coverImage: null,
    });
  }, [profile]);

  useEffect(() => {
    setSaveMessage(null);
    setSaveError(null);

    if (activeTab !== "posts") {
      setStatusFilter("");
      setPostsPageIndex(0);
    }
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
        <div className="mx-auto max-w-3xl bg-card p-6 text-center comic-border-secondary sm:p-8">
          <p className="font-oswald text-xs uppercase tracking-[0.35em] text-muted-foreground">Profile unavailable</p>
          <h1 className="mt-3 font-bangers text-4xl text-primary sm:text-5xl md:text-6xl">Unable to load profile</h1>
          <p className="mt-4 font-sans text-base text-muted-foreground">
            The current user profile could not be loaded from the API.
          </p>
        </div>
      </main>
    );
  }

  const isUploadingImage = uploadingField !== null;
  const previewFullName = form.fullName || profile.fullName;
  const previewUsername = form.username || profile.username;
  const previewBio = form.bio;
  const previewProfileImage = form.profileImage.trim();
  const previewCoverImage = form.coverImage.trim();
  const previewProfileImageUrl = getRenderableImageUrl(previewProfileImage);
  const previewCoverImageUrl = getRenderableImageUrl(previewCoverImage);

  function clearFieldError(field: keyof typeof form) {
    setFieldErrors((current) => {
      if (!(field in current)) {
        return current;
      }

      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  async function handleImageUpload(
    field: ImageField,
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    setSaveMessage(null);
    setSaveError(null);
    clearFieldError(field);
    setUploadMessages((current) => ({
      ...current,
      [field]: null,
    }));
    setUploadingField(field);

    try {
      const uploadedFile = await uploadImageFile(file);
      setForm((current) => ({
        ...current,
        [field]: uploadedFile.location,
      }));
      setUploadMessages((current) => ({
        ...current,
        [field]: `Uploaded "${file.name}". Save the profile to persist this image.`,
      }));
    } catch (error) {
      setFieldErrors((current) => ({
        ...current,
        [field]: getFileUploadErrorMessage(error),
      }));
    } finally {
      setUploadingField((current) => (current === field ? null : current));
    }
  }

  function validateProfileForm() {
    const errors: Record<string, string> = {};

    if (!form.username.trim()) {
      errors.username = "Username is required";
    } else if (form.username.length < 3 || form.username.length > 30) {
      errors.username = "Username must be 3-30 characters";
    } else if (!/^[A-Za-z0-9_]+$/.test(form.username)) {
      errors.username = "Username can only contain letters, numbers, and underscores";
    }

    if (!form.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = "Invalid email format";
    }

    if (form.fullName.length > 100) {
      errors.fullName = "Full name must be at most 100 characters";
    }

    if (form.bio.length > 500) {
      errors.bio = "Bio must be at most 500 characters";
    }

    if (form.profileImage && !/^https?:\/\/.+$/i.test(form.profileImage)) {
      errors.profileImage = "Profile image must be a valid URL (http/https)";
    }

    if (form.coverImage && !/^https?:\/\/.+$/i.test(form.coverImage)) {
      errors.coverImage = "Cover image must be a valid URL (http/https)";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSaveProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaveMessage(null);
    setSaveError(null);

    if (isUploadingImage) {
      setSaveError("Wait for the image upload to finish before saving.");
      return;
    }

    if (!validateProfileForm()) {
      return;
    }
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
      setSaveError(getGeneralErrorMessage(error));
    }
  }

  async function handlePasswordChange(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPasswordMessage(null);
    setPasswordError(null);

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters.");
      return;
    } else if (!/[A-Z]/.test(passwordForm.newPassword)) {
      setPasswordError("Password must contain at least one uppercase letter.");
      return;
    } else if (!/[a-z]/.test(passwordForm.newPassword)) {
      setPasswordError("Password must contain at least one lowercase letter.");
      return;
    } else if (!/\d/.test(passwordForm.newPassword)) {
      setPasswordError("Password must contain at least one number.");
      return;
    }

    try {
      await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      }).unwrap();
      setPasswordMessage("Password changed successfully.");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      setPasswordError(getGeneralErrorMessage(error));
    }
  }

  async function handleDeletePost(id: string) {
        try {
      await deletePost(id).unwrap();
      setDeletionResult({ success: true, message: "Your story has been permanently removed from the archives." });
      refetchPosts();
      refetchBookmarks();
    } catch (error) {
      setDeletionResult({ success: false, message: getGeneralErrorMessage(error) });
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <AlertDialog open={!!deletionResult} onOpenChange={(open) => !open && setDeletionResult(null)}>
        <AlertDialogContent className="comic-border-secondary">
          <AlertDialogHeader>
            <AlertDialogTitle className={`font-bangers text-3xl uppercase ${deletionResult?.success ? "text-primary" : "text-destructive"}`}>
              {deletionResult?.success ? "Mission Accomplished!" : "System Error!"}
            </AlertDialogTitle>
            <AlertDialogDescription className="font-oswald text-lg uppercase tracking-wide">
              {deletionResult?.message}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogAction
              onClick={() => setDeletionResult(null)}
              className="bg-primary text-primary-foreground font-bangers text-xl hover:bg-primary/90 comic-border"
            >
              Acknowledged
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
                  onClick={() => {
                    dispatch(logout());
                    navigateWithFallback(router, "/");
                  }}
                  className="mt-4 flex w-full items-center justify-center gap-2 bg-destructive/10 px-4 py-3 font-bangers text-2xl text-destructive transition-all hover:bg-destructive hover:text-destructive-foreground comic-border-secondary"
                >
                  <LogOut size={20} /> LOGOUT
                </button>
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
                      {fieldErrors.fullName && <p className="text-sm text-red-500 mt-1">{fieldErrors.fullName}</p>}
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
                      {fieldErrors.username && <p className="text-sm text-red-500 mt-1">{fieldErrors.username}</p>}

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
                      {fieldErrors.email && <p className="text-sm text-red-500 mt-1">{fieldErrors.email}</p>}

                    </label>
                    <div className="space-y-2">
                      <span className="inline-flex items-center gap-2 font-oswald text-xs uppercase tracking-[0.28em] text-muted-foreground">
                        <ImagePlus size={14} />
                        Profile image
                      </span>
                      <Input
                        value={form.profileImage}
                        onChange={(event) => {
                          setForm((current) => ({
                            ...current,
                            profileImage: event.target.value,
                          }));
                          clearFieldError("profileImage");
                          setUploadMessages((current) => ({
                            ...current,
                            profileImage: null,
                          }));
                        }}
                        className="h-11 bg-background comic-border-secondary"
                        placeholder="Paste a URL or upload an image below"
                      />
                      <div className="flex flex-wrap items-center gap-2">
                        <label className={`inline-flex cursor-pointer items-center gap-2 px-4 py-2 font-oswald text-xs uppercase tracking-[0.28em] comic-border-secondary ${uploadingField === "profileImage" ? "bg-primary text-primary-foreground" : "bg-background text-primary"}`}>
                          {uploadingField === "profileImage" ? (
                            <LoaderCircle size={14} className="animate-spin" />
                          ) : (
                            <ImagePlus size={14} />
                          )}
                          {uploadingField === "profileImage" ? "Uploading..." : "Upload image"}
                          <input
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={(event) =>
                              void handleImageUpload("profileImage", event)
                            }
                            disabled={isUploadingImage}
                          />
                        </label>
                        {form.profileImage ? (
                          <button
                            type="button"
                            onClick={() => {
                              setForm((current) => ({
                                ...current,
                                profileImage: "",
                              }));
                              clearFieldError("profileImage");
                              setUploadMessages((current) => ({
                                ...current,
                                profileImage: null,
                              }));
                            }}
                            className="px-4 py-2 font-oswald text-xs uppercase tracking-[0.28em] comic-border-secondary"
                          >
                            Clear
                          </button>
                        ) : null}
                      </div>
                      {uploadMessages.profileImage ? (
                        <p className="text-sm text-green-600">
                          {uploadMessages.profileImage}
                        </p>
                      ) : null}
                      {fieldErrors.profileImage && <p className="text-sm text-red-500 mt-1">{fieldErrors.profileImage}</p>}
                    </div>

                    <div className="space-y-2">
                      <span className="inline-flex items-center gap-2 font-oswald text-xs uppercase tracking-[0.28em] text-muted-foreground">
                        <ImagePlus size={14} />
                        Cover image
                      </span>
                      <Input
                        value={form.coverImage}
                        onChange={(event) => {
                          setForm((current) => ({
                            ...current,
                            coverImage: event.target.value,
                          }));
                          clearFieldError("coverImage");
                          setUploadMessages((current) => ({
                            ...current,
                            coverImage: null,
                          }));
                        }}
                        className="h-11 bg-background comic-border-secondary"
                        placeholder="Paste a URL or upload an image below"
                      />
                      <div className="flex flex-wrap items-center gap-2">
                        <label className={`inline-flex cursor-pointer items-center gap-2 px-4 py-2 font-oswald text-xs uppercase tracking-[0.28em] comic-border-secondary ${uploadingField === "coverImage" ? "bg-primary text-primary-foreground" : "bg-background text-primary"}`}>
                          {uploadingField === "coverImage" ? (
                            <LoaderCircle size={14} className="animate-spin" />
                          ) : (
                            <ImagePlus size={14} />
                          )}
                          {uploadingField === "coverImage" ? "Uploading..." : "Upload image"}
                          <input
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={(event) =>
                              void handleImageUpload("coverImage", event)
                            }
                            disabled={isUploadingImage}
                          />
                        </label>
                        {form.coverImage ? (
                          <button
                            type="button"
                            onClick={() => {
                              setForm((current) => ({
                                ...current,
                                coverImage: "",
                              }));
                              clearFieldError("coverImage");
                              setUploadMessages((current) => ({
                                ...current,
                                coverImage: null,
                              }));
                            }}
                            className="px-4 py-2 font-oswald text-xs uppercase tracking-[0.28em] comic-border-secondary"
                          >
                            Clear
                          </button>
                        ) : null}
                      </div>
                      {uploadMessages.coverImage ? (
                        <p className="text-sm text-green-600">
                          {uploadMessages.coverImage}
                        </p>
                      ) : null}
                      {fieldErrors.coverImage && <p className="text-sm text-red-500 mt-1">{fieldErrors.coverImage}</p>}
                    </div>
                  </div>

                  <label className="block space-y-2">
                    <span className="font-oswald text-xs uppercase tracking-[0.28em] text-muted-foreground">Bio</span>
                    <Textarea
                      value={form.bio}
                      onChange={(event) => setForm((current) => ({ ...current, bio: event.target.value }))}
                      className="min-h-36 resize-y bg-background comic-border-secondary"
                    />
                  </label>
                    {fieldErrors.bio && <p className="text-sm text-red-500 mt-1">{fieldErrors.bio}</p>}

                  {saveMessage ? <p className="font-sans text-sm text-green-600">{saveMessage}</p> : null}
                  {saveError ? <p className="font-sans text-sm text-red-500">{saveError}</p> : null}

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="submit"
                      disabled={isSaving || isUploadingImage}
                      className="inline-flex items-center gap-2 bg-accent px-5 py-3 font-bangers text-xl text-accent-foreground disabled:cursor-not-allowed disabled:opacity-60 comic-border"
                    >
                      <Save size={16} />
                      {isSaving ? "Saving..." : isUploadingImage ? "Uploading image..." : "Save profile"}
                    </button>
                    <p className="font-sans text-sm text-muted-foreground">
                      Your join date stays fixed and cannot be edited.
                    </p>
                  </div>
                </form>

                <div className="my-10 h-px bg-muted" />

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-oswald text-xs uppercase tracking-[0.35em] text-muted-foreground">Security core</p>
                    <h2 className="mt-2 font-bangers text-4xl text-primary">Change password</h2>
                  </div>
                </div>

                <form onSubmit={handlePasswordChange} className="mt-6 space-y-5">
                  <div className="grid gap-5 md:grid-cols-2">
                    <div className="space-y-2 md:col-span-2">
                      <span className="inline-flex items-center gap-2 font-oswald text-xs uppercase tracking-[0.28em] text-muted-foreground">
                        <Lock size={14} />
                        Current password
                      </span>
                      <div className="relative">
                        <Input
                          type={showCurrentPassword ? "text" : "password"}
                          value={passwordForm.currentPassword}
                          onChange={(e) => setPasswordForm((p) => ({ ...p, currentPassword: e.target.value }))}
                          className="h-11 bg-background pr-10 comic-border-secondary"
                          placeholder="••••••••"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
                        >
                          {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="inline-flex items-center gap-2 font-oswald text-xs uppercase tracking-[0.28em] text-muted-foreground">
                        <Lock size={14} />
                        New password
                      </span>
                      <div className="relative">
                        <Input
                          type={showNewPassword ? "text" : "password"}
                          value={passwordForm.newPassword}
                          onChange={(e) => setPasswordForm((p) => ({ ...p, newPassword: e.target.value }))}
                          className="h-11 bg-background pr-10 comic-border-secondary"
                          placeholder="••••••••"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
                        >
                          {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="inline-flex items-center gap-2 font-oswald text-xs uppercase tracking-[0.28em] text-muted-foreground">
                        <Lock size={14} />
                        Confirm new password
                      </span>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          value={passwordForm.confirmPassword}
                          onChange={(e) => setPasswordForm((p) => ({ ...p, confirmPassword: e.target.value }))}
                          className="h-11 bg-background pr-10 comic-border-secondary"
                          placeholder="••••••••"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
                        >
                          {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {passwordMessage ? <p className="font-sans text-sm text-green-600">{passwordMessage}</p> : null}
                  {passwordError ? <p className="font-sans text-sm text-red-500">{passwordError}</p> : null}

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="submit"
                      disabled={isChangingPassword}
                      className="inline-flex items-center gap-2 bg-accent px-5 py-3 font-bangers text-xl text-accent-foreground disabled:cursor-not-allowed disabled:opacity-60 comic-border"
                    >
                      <Lock size={16} />
                      {isChangingPassword ? "Updating..." : "Update password"}
                    </button>
                  </div>
                </form>
              </section>
            ) : null}

            {activeTab === "posts" ? (
              <PostGrid
                heading="My blogs"
                description={
                  statusFilter 
                    ? `Showing ${statusFilter.toLowerCase()} stories` 
                    : `Stories published by @${profile.username}`
                }
                page={postsPage}
                isLoading={postsLoading}
                emptyMessage={
                  statusFilter === "DRAFT"
                    ? "No draft issues found in your secret archives."
                    : statusFilter === "PUBLISHED"
                    ? "No published issues found. Time to hit the press!"
                    : "Your story arc hasn't started yet. Create your first post!"
                }
                onPageChange={setPostsPageIndex}
                showEditButton={true}
                showStatus={true}
                statusFilter={statusFilter}
                onStatusChange={(status) => {
                  setStatusFilter(status);
                  setPostsPageIndex(0);
                }}
                onDelete={handleDeletePost}
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
                onDelete={handleDeletePost}
              />
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
}
