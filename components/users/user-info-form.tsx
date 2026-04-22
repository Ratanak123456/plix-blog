"use client";

import { User2, Mail, ImagePlus, LoaderCircle, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formatDate } from "./profile-utils";

type ImageField = "profileImage" | "coverImage";

interface UserInfoFormProps {
  form: {
    username: string;
    fullName: string;
    email: string;
    profileImage: string;
    coverImage: string;
    bio: string;
  };
  setForm: React.Dispatch<React.SetStateAction<{
    username: string;
    fullName: string;
    email: string;
    profileImage: string;
    coverImage: string;
    bio: string;
  }>>;
  fieldErrors: Record<string, string>;
  clearFieldError: (field: any) => void;
  uploadingField: string | null;
  uploadMessages: Record<string, string | null>;
  isUploadingImage: boolean;
  isSaving: boolean;
  saveMessage: string | null;
  saveError: string | null;
  handleImageUpload: (field: ImageField, event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSaveProfile: (event: React.FormEvent<HTMLFormElement>) => void;
  joinedDate: string;
}

export function UserInfoForm({
  form,
  setForm,
  fieldErrors,
  clearFieldError,
  uploadingField,
  uploadMessages,
  isUploadingImage,
  isSaving,
  saveMessage,
  saveError,
  handleImageUpload,
  handleSaveProfile,
  joinedDate,
}: UserInfoFormProps) {
  return (
    <section className="bg-card p-6 md:p-8 comic-border-secondary">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-oswald text-xs uppercase tracking-[0.35em] text-muted-foreground">Account editor</p>
          <h2 className="mt-2 font-bangers text-4xl text-primary">User information</h2>
        </div>
        <div className="bg-background px-4 py-2 font-oswald text-xs uppercase tracking-[0.28em] text-muted-foreground comic-border">
          Joined on {formatDate(joinedDate)}
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
              onChange={(event) => setForm((current: any) => ({ ...current, fullName: event.target.value }))}
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
              onChange={(event) => setForm((current: any) => ({ ...current, username: event.target.value }))}
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
              onChange={(event) => setForm((current: any) => ({ ...current, email: event.target.value }))}
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
                setForm((current: any) => ({
                  ...current,
                  profileImage: event.target.value,
                }));
                clearFieldError("profileImage");
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
                    setForm((current: any) => ({
                      ...current,
                      profileImage: "",
                    }));
                    clearFieldError("profileImage");
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
                setForm((current: any) => ({
                  ...current,
                  coverImage: event.target.value,
                }));
                clearFieldError("coverImage");
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
                    setForm((current: any) => ({
                      ...current,
                      coverImage: "",
                    }));
                    clearFieldError("coverImage");
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
            onChange={(event) => setForm((current: any) => ({ ...current, bio: event.target.value }))}
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
    </section>
  );
}
