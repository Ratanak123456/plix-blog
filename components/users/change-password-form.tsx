"use client";

import { Lock, EyeOff, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

import { PasswordRequest } from "@/lib/types/user";

export interface PasswordFormData extends PasswordRequest {
  confirmPassword: string;
}

interface ChangePasswordFormProps {
  passwordForm: PasswordFormData;
  setPasswordForm: React.Dispatch<React.SetStateAction<PasswordFormData>>;
  handlePasswordChange: (event: React.FormEvent<HTMLFormElement>) => void;
  isChangingPassword: boolean;
  passwordMessage: string | null;
  passwordError: string | null;
}

export function ChangePasswordForm({
  passwordForm,
  setPasswordForm,
  handlePasswordChange,
  isChangingPassword,
  passwordMessage,
  passwordError,
}: ChangePasswordFormProps) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <section className="bg-card p-6 md:p-8 comic-border-secondary">
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
  );
}
