"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, ArrowRight, CheckCircle2, Eye, EyeOff, Loader2, Sparkles } from "lucide-react";
import { useRegisterMutation } from "@/lib/services/auth-api";
import { 
  registerSchema, 
  type RegisterFormValues 
} from "./auth-schemas";
import { 
  getErrorPayload, 
  getGeneralErrorMessage 
} from "@/lib/utils/auth-utils";

type RegisterFormProps = {
  onSuccess: (email: string) => void;
  onModeChange: (mode: "login" | "register") => void;
};

const defaultRegisterValues: RegisterFormValues = {
  username: "",
  fullName: "",
  email: "",
  password: "",
};

export function RegisterForm({ onSuccess, onModeChange }: RegisterFormProps) {
  const [feedback, setFeedback] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [register, { isLoading: isRegistering }] = useRegisterMutation();

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: defaultRegisterValues,
    mode: "onBlur",
  });

  async function submitRegister(values: RegisterFormValues) {
    setFeedback(null);
    try {
      await register(values).unwrap();
      onSuccess(values.email);
    } catch (error) {
      const payload = getErrorPayload(error);
      if (payload?.validationErrors) {
        for (const [field, message] of Object.entries(payload.validationErrors)) {
          if (field in values) {
            registerForm.setError(field as keyof RegisterFormValues, {
              type: "server",
              message,
            });
          }
        }
      }
      setFeedback(getGeneralErrorMessage(error));
    }
  }

  const activeRegisterErrors = registerForm.formState.errors;

  return (
<form className="flex flex-col gap-5" onSubmit={registerForm.handleSubmit(submitRegister)}>
  {/* Username Field */}
  <div>
    <label className="mb-2 inline-block bg-primary border-2 border-foreground px-3 py-1 font-oswald text-xs uppercase tracking-wider text-white shadow-[2px_2px_0px_0px_hsl(var(--foreground))]">
      Hero Name
    </label>
    <input
      type="text"
      placeholder="SuperReader99"
      className="w-full bg-muted border-3 border-foreground px-4 py-3 font-bangers text-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:shadow-[4px_4px_0px_0px_hsl(var(--foreground))] transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)]"
      {...registerForm.register("username")}
    />
    {activeRegisterErrors.username && (
      <div className="mt-2 flex items-center gap-2 bg-red-500/10 border-2 border-red-500 px-3 py-2">
        <AlertCircle size={14} className="text-red-500 shrink-0" strokeWidth={3} />
        <p className="font-oswald text-sm text-red-600 font-bold">{activeRegisterErrors.username.message}</p>
      </div>
    )}
  </div>

  {/* Full Name Field */}
  <div>
    <label className="mb-2 inline-block bg-secondary border-2 border-foreground px-3 py-1 font-oswald text-xs uppercase tracking-wider text-white shadow-[2px_2px_0px_0px_hsl(var(--foreground))]">
      Secret Identity
    </label>
    <input
      type="text"
      placeholder="Peter Parker"
      className="w-full bg-muted border-3 border-foreground px-4 py-3 font-bangers text-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:shadow-[4px_4px_0px_0px_hsl(var(--foreground))] transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)]"
      {...registerForm.register("fullName")}
    />
    {activeRegisterErrors.fullName && (
      <div className="mt-2 flex items-center gap-2 bg-red-500/10 border-2 border-red-500 px-3 py-2">
        <AlertCircle size={14} className="text-red-500 shrink-0" strokeWidth={3} />
        <p className="font-oswald text-sm text-red-600 font-bold">{activeRegisterErrors.fullName.message}</p>
      </div>
    )}
  </div>

  {/* Email Field */}
  <div>
    <label className="mb-2 inline-block bg-accent border-2 border-foreground px-3 py-1 font-oswald text-xs uppercase tracking-wider text-white shadow-[2px_2px_0px_0px_hsl(var(--foreground))]">
      Bat-Signal Email
    </label>
    <input
      type="email"
      placeholder="hero@plixblog.com"
      className="w-full bg-muted border-3 border-foreground px-4 py-3 font-bangers text-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:shadow-[4px_4px_0px_0px_hsl(var(--foreground))] transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)]"
      {...registerForm.register("email")}
    />
    {activeRegisterErrors.email && (
      <div className="mt-2 flex items-center gap-2 bg-red-500/10 border-2 border-red-500 px-3 py-2">
        <AlertCircle size={14} className="text-red-500 shrink-0" strokeWidth={3} />
        <p className="font-oswald text-sm text-red-600 font-bold">{activeRegisterErrors.email.message}</p>
      </div>
    )}
  </div>

  {/* Password Field */}
  <div>
    <label className="mb-2 inline-block bg-primary border-2 border-foreground px-3 py-1 font-oswald text-xs uppercase tracking-wider text-white shadow-[2px_2px_0px_0px_hsl(var(--foreground))]">
      Secret Code
    </label>
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        placeholder="••••••••"
        className="w-full bg-muted border-3 border-foreground px-4 py-3 pr-14 font-bangers text-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:shadow-[4px_4px_0px_0px_hsl(var(--foreground))] transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)]"
        {...registerForm.register("password")}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-1/2 -translate-y-1/2 bg-card border-2 border-foreground p-1.5 shadow-[2px_2px_0px_0px_hsl(var(--foreground))] transition-all hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_hsl(var(--foreground))] active:translate-y-0 active:shadow-none"
        aria-label={showPassword ? "Hide password" : "Show password"}
      >
        {showPassword ? <EyeOff size={18} strokeWidth={3} /> : <Eye size={18} strokeWidth={3} />}
      </button>
    </div>
    {activeRegisterErrors.password && (
      <div className="mt-2 flex items-center gap-2 bg-red-500/10 border-2 border-red-500 px-3 py-2">
        <AlertCircle size={14} className="text-red-500 shrink-0" strokeWidth={3} />
        <p className="font-oswald text-sm text-red-600 font-bold">{activeRegisterErrors.password.message}</p>
      </div>
    )}
  </div>

  {/* Feedback Message */}
  {feedback && (
    <div className={`flex items-center gap-2 border-3 px-4 py-3 shadow-[4px_4px_0px_0px_hsl(var(--foreground))] ${
      feedback.startsWith("Registration completed") 
        ? "bg-emerald-500/10 border-emerald-500" 
        : "bg-red-500/10 border-red-500"
    }`}>
      {feedback.startsWith("Registration completed") ? (
        <CheckCircle2 size={18} className="text-emerald-500 shrink-0" strokeWidth={3} />
      ) : (
        <AlertCircle size={18} className="text-red-500 shrink-0" strokeWidth={3} />
      )}
      <p className={`font-oswald text-sm font-bold uppercase tracking-wider ${
        feedback.startsWith("Registration completed") ? "text-emerald-600" : "text-red-600"
      }`}>
        {feedback}
      </p>
    </div>
  )}

  {/* Submit Button */}
  <button
    type="submit"
    disabled={isRegistering}
    className="mt-2 w-full bg-accent border-4 border-foreground py-4 font-bangers text-2xl text-white shadow-[6px_6px_0px_0px_hsl(var(--foreground))] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[3px_3px_0px_0px_hsl(var(--foreground))] hover:bg-primary disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[6px_6px_0px_0px_hsl(var(--foreground))] relative overflow-hidden group"
  >
    {/* Shine effect */}
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500"/>
    <span className="relative z-10 flex items-center justify-center gap-2">
      {isRegistering ? (
        <>
          <Loader2 size={24} className="animate-spin" strokeWidth={3} />
          PROCESSING...
        </>
      ) : (
        <>
          <Sparkles size={24} strokeWidth={3} />
          JOIN THE UNIVERSE!
        </>
      )}
    </span>
  </button>

  {/* Login Link */}
  <p className="text-center font-oswald text-sm text-muted-foreground uppercase tracking-wider flex items-center justify-center gap-2 flex-wrap">
    Already a hero?
    <button
      type="button"
      onClick={() => onModeChange("login")}
      className="inline-flex items-center gap-1 bg-primary border-2 border-foreground px-3 py-1 font-bangers text-base text-white shadow-[3px_3px_0px_0px_hsl(var(--foreground))] transition-all hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_hsl(var(--foreground))] hover:bg-secondary ml-2"
    >
      Login Here
      <ArrowRight size={14} strokeWidth={3} />
    </button>
  </p>
</form>

  );
}
