"use client";

import { Lock, EyeOff, Eye, Shield, Zap, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
    <section className="bg-card border-4 border-foreground shadow-[8px_8px_0px_0px_hsl(var(--foreground))] relative p-6 md:p-8">
      {/* Inner dashed border */}
      <div className="absolute inset-3 border-2 border-dashed border-muted-border pointer-events-none"/>

      {/* Corner accents */}
      <div className="absolute -top-3 -left-3 w-8 h-8 bg-primary border-3 border-foreground shadow-[2px_2px_0px_0px_hsl(var(--foreground))]"/>
      <div className="absolute -bottom-3 -right-3 w-8 h-8 bg-accent border-3 border-foreground shadow-[2px_2px_0px_0px_hsl(var(--foreground))]"/>

      {/* Header */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-secondary border-2 border-foreground p-1.5 shadow-[2px_2px_0px_0px_hsl(var(--foreground))]">
              <Shield size={14} className="text-white" strokeWidth={3} />
            </div>
            <p className="font-oswald text-xs uppercase tracking-[0.35em] text-muted-foreground font-bold">Security Core</p>
          </div>
          <h2 className="font-bangers text-4xl text-foreground tracking-wide"
            style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.1)' }}
          >
            Change Password
          </h2>
        </div>
        <div className="hidden sm:block bg-yellow-400 border-3 border-foreground px-3 py-1 font-bangers text-sm text-black shadow-[3px_3px_0px_0px_hsl(var(--foreground))] rotate-3">
          PROTECTED!
        </div>
      </div>

      <form onSubmit={handlePasswordChange} className="relative z-10 space-y-5">
        <div className="grid gap-5 md:grid-cols-2">
          {/* Current Password */}
          <div className="space-y-2 md:col-span-2">
            <label className="inline-flex items-center gap-2 bg-primary border-2 border-foreground px-3 py-1 font-oswald text-xs uppercase tracking-[0.28em] text-white shadow-[2px_2px_0px_0px_hsl(var(--foreground))]">
              <Lock size={12} strokeWidth={3} />
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm((p) => ({ ...p, currentPassword: e.target.value }))}
                className="w-full bg-muted border-3 border-foreground px-4 py-3 pr-14 font-bangers text-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:shadow-[4px_4px_0px_0px_hsl(var(--foreground))] transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)]"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-card border-2 border-foreground p-1.5 shadow-[2px_2px_0px_0px_hsl(var(--foreground))] transition-all hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_hsl(var(--foreground))] active:translate-y-0 active:shadow-none"
              >
                {showCurrentPassword ? <EyeOff size={16} strokeWidth={3} /> : <Eye size={16} strokeWidth={3} />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="space-y-2">
            <label className="inline-flex items-center gap-2 bg-secondary border-2 border-foreground px-3 py-1 font-oswald text-xs uppercase tracking-[0.28em] text-white shadow-[2px_2px_0px_0px_hsl(var(--foreground))]">
              <Zap size={12} strokeWidth={3} />
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm((p) => ({ ...p, newPassword: e.target.value }))}
                className="w-full bg-muted border-3 border-foreground px-4 py-3 pr-14 font-bangers text-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:shadow-[4px_4px_0px_0px_hsl(var(--foreground))] transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)]"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-card border-2 border-foreground p-1.5 shadow-[2px_2px_0px_0px_hsl(var(--foreground))] transition-all hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_hsl(var(--foreground))] active:translate-y-0 active:shadow-none"
              >
                {showNewPassword ? <EyeOff size={16} strokeWidth={3} /> : <Eye size={16} strokeWidth={3} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label className="inline-flex items-center gap-2 bg-accent border-2 border-foreground px-3 py-1 font-oswald text-xs uppercase tracking-[0.28em] text-white shadow-[2px_2px_0px_0px_hsl(var(--foreground))]">
              <Shield size={12} strokeWidth={3} />
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm((p) => ({ ...p, confirmPassword: e.target.value }))}
                className="w-full bg-muted border-3 border-foreground px-4 py-3 pr-14 font-bangers text-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:shadow-[4px_4px_0px_0px_hsl(var(--foreground))] transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)]"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-card border-2 border-foreground p-1.5 shadow-[2px_2px_0px_0px_hsl(var(--foreground))] transition-all hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_hsl(var(--foreground))] active:translate-y-0 active:shadow-none"
              >
                {showConfirmPassword ? <EyeOff size={16} strokeWidth={3} /> : <Eye size={16} strokeWidth={3} />}
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <AnimatePresence mode="wait">
          {passwordMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="flex items-center gap-2 bg-emerald-500/10 border-3 border-emerald-500 px-4 py-3 shadow-[4px_4px_0px_0px_hsl(var(--foreground))]"
            >
              <CheckCircle2 size={18} className="text-emerald-500 shrink-0" strokeWidth={3} />
              <p className="font-oswald text-sm text-emerald-600 font-bold uppercase tracking-wider">{passwordMessage}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {passwordError && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="flex items-center gap-2 bg-red-500/10 border-3 border-red-500 px-4 py-3 shadow-[4px_4px_0px_0px_hsl(var(--foreground))]"
            >
              <AlertCircle size={18} className="text-red-500 shrink-0" strokeWidth={3} />
              <p className="font-oswald text-sm text-red-600 font-bold uppercase tracking-wider">{passwordError}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit Button */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={isChangingPassword}
            className="inline-flex items-center gap-2 bg-accent border-4 border-foreground px-6 py-3 font-bangers text-xl text-white shadow-[6px_6px_0px_0px_hsl(var(--foreground))] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[3px_3px_0px_0px_hsl(var(--foreground))] hover:bg-primary disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[6px_6px_0px_0px_hsl(var(--foreground))] relative overflow-hidden group"
          >
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500"/>
            <span className="relative z-10 flex items-center gap-2">
              {isChangingPassword ? (
                <>
                  <Loader2 size={20} className="animate-spin" strokeWidth={3} />
                  UPDATING...
                </>
              ) : (
                <>
                  <Lock size={20} strokeWidth={3} />
                  UPDATE PASSWORD
                </>
              )}
            </span>
          </button>
        </div>
      </form>
    </section>
  );
}