"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type ChangeEvent, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
} from "lucide-react";
import { skipToken } from "@reduxjs/toolkit/query";
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
import {
  getFileUploadErrorMessage,
} from "@/lib/utils/file-upload";
import { getRenderableImageUrl } from "@/lib/utils/image-url";
import { ProfileSidebar } from "./profile-sidebar";
import { UserInfoForm } from "./user-info-form";
import { ChangePasswordForm } from "./change-password-form";
import { formatDate } from "./profile-utils";

type ProfileTab = "info" | "posts" | "bookmarks";
type ImageField = "profileImage" | "coverImage";

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

  // uploadingField tracks which field is being uploaded for UI styling
  // Sidebar always shows saved profile data - updates only after Save Profile is clicked
  const previewFullName = profile.fullName;
  const previewUsername = profile.username;
  const previewBio = profile.bio;
  const previewProfileImage = (profile.profileImage || "").trim();
  const previewCoverImage = (profile.coverImage || "").trim();
  const previewCoverImageUrl = getRenderableImageUrl(previewCoverImage);
  const previewProfileImageUrl = getRenderableImageUrl(previewProfileImage);

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
      const uploadedFile = await uploadImage(file).unwrap();
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

    if (!form.fullName.trim()) {
      errors.fullName = "Full name is required";
    } else if (form.fullName.trim().length < 3 || form.fullName.trim().length > 100) {
      errors.fullName = "Full name must be 3-100 characters";
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

          <div className="space-y-6">
            {activeTab === "info" ? (
              <>
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

                <div className="my-10 h-px bg-muted" />

                <ChangePasswordForm
                  passwordForm={passwordForm}
                  setPasswordForm={setPasswordForm}
                  handlePasswordChange={handlePasswordChange}
                  isChangingPassword={isChangingPassword}
                  passwordMessage={passwordMessage}
                  passwordError={passwordError}
                />
              </>
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
                showStatus={true}
                showEditButton={true}
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
