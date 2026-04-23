"use client";

import { User2, Mail, ImagePlus, LoaderCircle, Save, Zap, CheckCircle2, XCircle, PenTool } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formatDate } from "./profile-utils";

type ImageField = "profileImage" | "coverImage";

export interface UserInfoFormData {
  username: string;
  fullName: string;
  email: string;
  profileImage: string;
  coverImage: string;
  bio: string;
}

interface UserInfoFormProps {
  form: UserInfoFormData;
  setForm: React.Dispatch<React.SetStateAction<UserInfoFormData>>;
  fieldErrors: Record<string, string>;
  clearFieldError: (field: keyof UserInfoFormData) => void;
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

// ─── Comic Components ──────────────────────────────────────────

function ThickBorder({ children, className = "" }: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`border-[4px] border-foreground ${className}`}
      style={{ boxShadow: "6px 6px 0px 0px hsl(var(--foreground))" }}
    >
      {children}
    </div>
  );
}

function BenDayDots({ className = "", size = 8 }: {
  className?: string;
  size?: number;
}) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 opacity-[0.08] ${className}`}
      style={{
        backgroundImage: `radial-gradient(circle, hsl(var(--foreground)) 2px, transparent 2px)`,
        backgroundSize: `${size}px ${size}px`,
      }}
    />
  );
}

function ComicInput({ icon: Icon, label, error, children }: {
  icon: React.ElementType;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="inline-flex items-center gap-2 font-oswald text-xs uppercase tracking-[0.28em] text-muted-foreground">
        <Icon size={14} className="text-accent" />
        {label}
      </span>
      {children}
      {error && (
        <div className="flex items-center gap-1.5 font-oswald text-sm uppercase tracking-wide text-destructive">
          <XCircle size={14} />
          {error}
        </div>
      )}
    </label>
  );
}

function UploadZone({ field, label, form, setForm, uploadingField, uploadMessages, isUploadingImage, handleImageUpload, clearFieldError, fieldErrors }: {
  field: ImageField;
  label: string;
  form: UserInfoFormData;
  setForm: React.Dispatch<React.SetStateAction<UserInfoFormData>>;
  uploadingField: string | null;
  uploadMessages: Record<string, string | null>;
  isUploadingImage: boolean;
  handleImageUpload: (field: ImageField, event: React.ChangeEvent<HTMLInputElement>) => void;
  clearFieldError: (field: keyof UserInfoFormData) => void;
  fieldErrors: Record<string, string>;
}) {
  const isUploading = uploadingField === field;
  const hasValue = form[field];
  const uploadMsg = uploadMessages[field];
  const error = fieldErrors[field];

  return (
    <div className="space-y-2">
      <span className="inline-flex items-center gap-2 font-oswald text-xs uppercase tracking-[0.28em] text-muted-foreground">
        <ImagePlus size={14} className="text-accent" />
        {label}
      </span>
      
      <Input
        value={hasValue}
        onChange={(event) => {
          setForm((current) => ({ ...current, [field]: event.target.value }));
          clearFieldError(field);
        }}
        className="h-11 bg-background border-[3px] border-foreground focus-visible:ring-accent focus-visible:ring-offset-0"
        placeholder="Paste image URL or upload below"
        style={{ boxShadow: "3px 3px 0px 0px hsl(var(--foreground))" }}
      />

      <div className="flex flex-wrap items-center gap-2">
        <label
          className={`inline-flex cursor-pointer items-center gap-2 border-[3px] border-foreground px-4 py-2 font-oswald text-xs uppercase tracking-[0.28em] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none ${
            isUploading
              ? "bg-primary text-primary-foreground"
              : "bg-background text-primary"
          }`}
          style={!isUploading ? { boxShadow: "3px 3px 0px 0px hsl(var(--foreground))" } : {}}
        >
          {isUploading ? (
            <LoaderCircle size={14} className="animate-spin" />
          ) : (
            <Zap size={14} className="fill-accent text-accent" />
          )}
          {isUploading ? "Uploading..." : "Upload"}
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(event) => void handleImageUpload(field, event)}
            disabled={isUploadingImage}
          />
        </label>

        {hasValue ? (
          <button
            type="button"
            onClick={() => {
              setForm((current) => ({ ...current, [field]: "" }));
              clearFieldError(field);
            }}
            className="border-[3px] border-foreground bg-background px-4 py-2 font-oswald text-xs uppercase tracking-[0.28em] text-muted-foreground transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
            style={{ boxShadow: "3px 3px 0px 0px hsl(var(--foreground))" }}
          >
            Clear
          </button>
        ) : null}
      </div>

      {uploadMsg && (
        <div className="flex items-center gap-1.5 font-oswald text-sm uppercase tracking-wide text-primary">
          <CheckCircle2 size={14} />
          {uploadMsg}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-1.5 font-oswald text-sm uppercase tracking-wide text-destructive">
          <XCircle size={14} />
          {error}
        </div>
      )}
    </div>
  );
}

// ─── Main Form ─────────────────────────────────────────────────

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
    <ThickBorder className="relative bg-card">
      <BenDayDots size={10} />

      <div className="relative z-10 p-6 md:p-8">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-oswald text-xs uppercase tracking-[0.35em] text-muted-foreground">
              Account Editor
            </p>
            <h2
              className="mt-2 font-bangers text-4xl uppercase text-primary sm:text-5xl"
              style={{ textShadow: "3px 3px 0px hsl(var(--secondary))" }}
            >
              User Info
            </h2>
          </div>
          <ThickBorder className="bg-background px-4 py-2">
            <span className="font-oswald text-xs uppercase tracking-[0.28em] text-muted-foreground">
              Joined{" "}
              <span className="font-bangers text-lg text-accent">
                {formatDate(joinedDate)}
              </span>
            </span>
          </ThickBorder>
        </div>

        {/* Form */}
        <form onSubmit={handleSaveProfile} className="mt-8 space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Full Name */}
            <ComicInput
              icon={User2}
              label="Full Name"
              error={fieldErrors.fullName}
            >
              <Input
                value={form.fullName}
                onChange={(event) => {
                  setForm((current) => ({ ...current, fullName: event.target.value }));
                  clearFieldError("fullName");
                }}
                className="h-12 bg-background border-[3px] border-foreground focus-visible:ring-accent focus-visible:ring-offset-0"
                style={{ boxShadow: "3px 3px 0px 0px hsl(var(--foreground))" }}
              />
            </ComicInput>

            {/* Username */}
            <ComicInput
              icon={User2}
              label="Username"
              error={fieldErrors.username}
            >
              <Input
                value={form.username}
                onChange={(event) => {
                  setForm((current) => ({ ...current, username: event.target.value }));
                  clearFieldError("username");
                }}
                className="h-12 bg-background border-[3px] border-foreground focus-visible:ring-accent focus-visible:ring-offset-0"
                style={{ boxShadow: "3px 3px 0px 0px hsl(var(--foreground))" }}
              />
            </ComicInput>

            {/* Email */}
            <ComicInput
              icon={Mail}
              label="Email"
              error={fieldErrors.email}
            >
              <Input
                type="email"
                value={form.email}
                onChange={(event) => {
                  setForm((current) => ({ ...current, email: event.target.value }));
                  clearFieldError("email");
                }}
                className="h-12 bg-background border-[3px] border-foreground focus-visible:ring-accent focus-visible:ring-offset-0 md:col-span-2"
                style={{ boxShadow: "3px 3px 0px 0px hsl(var(--foreground))" }}
              />
            </ComicInput>

            {/* Profile Image */}
            <UploadZone
              field="profileImage"
              label="Profile Image"
              form={form}
              setForm={setForm}
              uploadingField={uploadingField}
              uploadMessages={uploadMessages}
              isUploadingImage={isUploadingImage}
              handleImageUpload={handleImageUpload}
              clearFieldError={clearFieldError}
              fieldErrors={fieldErrors}
            />

            {/* Cover Image */}
            <UploadZone
              field="coverImage"
              label="Cover Image"
              form={form}
              setForm={setForm}
              uploadingField={uploadingField}
              uploadMessages={uploadMessages}
              isUploadingImage={isUploadingImage}
              handleImageUpload={handleImageUpload}
              clearFieldError={clearFieldError}
              fieldErrors={fieldErrors}
            />
          </div>

          {/* Bio */}
          <label className="block space-y-2">
            <span className="inline-flex items-center gap-2 font-oswald text-xs uppercase tracking-[0.28em] text-muted-foreground">
              <PenTool size={14} className="text-accent" />
              Bio
            </span>
            <Textarea
              value={form.bio}
              onChange={(event) => {
                setForm((current) => ({ ...current, bio: event.target.value }));
                clearFieldError("bio");
              }}
              className="min-h-40 resize-y bg-background border-[3px] border-foreground focus-visible:ring-accent focus-visible:ring-offset-0"
              style={{ boxShadow: "4px 4px 0px 0px hsl(var(--foreground))" }}
            />
            {fieldErrors.bio && (
              <div className="flex items-center gap-1.5 font-oswald text-sm uppercase tracking-wide text-destructive">
                <XCircle size={14} />
                {fieldErrors.bio}
              </div>
            )}
          </label>

          {/* Messages */}
          {saveMessage && (
            <ThickBorder className="bg-primary/10 border-primary">
              <div className="flex items-center gap-2 p-3">
                <CheckCircle2 size={18} className="text-primary" />
                <span className="font-oswald text-sm uppercase tracking-wide text-primary">
                  {saveMessage}
                </span>
              </div>
            </ThickBorder>
          )}

          {saveError && (
            <ThickBorder className="bg-destructive/10 border-destructive">
              <div className="flex items-center gap-2 p-3">
                <XCircle size={18} className="text-destructive" />
                <span className="font-oswald text-sm uppercase tracking-wide text-destructive">
                  {saveError}
                </span>
              </div>
            </ThickBorder>
          )}

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              type="submit"
              disabled={isSaving || isUploadingImage}
              className="inline-flex items-center gap-2 border-[4px] border-foreground bg-accent px-6 py-3 font-bangers text-xl uppercase text-accent-foreground transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none disabled:cursor-not-allowed disabled:opacity-50"
              style={{ boxShadow: "6px 6px 0px 0px hsl(var(--foreground))" }}
            >
              {isSaving ? (
                <LoaderCircle size={18} className="animate-spin" />
              ) : (
                <Save size={18} />
              )}
              {isSaving ? "Saving..." : isUploadingImage ? "Uploading..." : "Save Profile"}
            </button>

            <ThickBorder className="bg-background px-4 py-2">
              <p className="font-oswald text-xs uppercase tracking-[0.28em] text-muted-foreground">
                Join date is locked in the archives
              </p>
            </ThickBorder>
          </div>
        </form>
      </div>
    </ThickBorder>
  );
}