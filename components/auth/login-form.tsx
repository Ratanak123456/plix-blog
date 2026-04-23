"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, ArrowRight, Eye, EyeOff, Loader2, Zap } from "lucide-react";
import { useLoginMutation } from "@/lib/services/auth-api";
import { 
  loginSchema, 
  type LoginFormValues 
} from "./auth-schemas";
import { 
  getErrorPayload, 
  getGeneralErrorMessage 
} from "@/lib/utils/auth-utils";

type LoginFormProps = {
  onSuccess: () => void;
  onModeChange: (mode: "login" | "register") => void;
};

const defaultLoginValues: LoginFormValues = {
  identifier: "",
  password: "",
};

export function LoginForm({ onSuccess, onModeChange }: LoginFormProps) {
  const router = useRouter();
  const [feedback, setFeedback] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading: isLoggingIn }] = useLoginMutation();

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: defaultLoginValues,
    mode: "onBlur",
  });

  async function submitLogin(values: LoginFormValues) {
    setFeedback(null);
    try {
      await login(values).unwrap();
      onSuccess();
      router.push("/");
    } catch (error) {
      const payload = getErrorPayload(error);
      if (payload?.validationErrors?.identifier) {
        loginForm.setError("identifier", {
          type: "server",
          message: payload.validationErrors.identifier,
        });
      }
      if (payload?.validationErrors?.password) {
        loginForm.setError("password", {
          type: "server",
          message: payload.validationErrors.password,
        });
      }
      setFeedback(getGeneralErrorMessage(error));
    }
  }

  const activeLoginErrors = loginForm.formState.errors;

  return (
<form className="flex flex-col gap-5" onSubmit={loginForm.handleSubmit(submitLogin)}>
  {/* Username Field */}
  <div>
    <label className="mb-2 inline-block bg-primary border-2 border-foreground px-3 py-1 font-oswald text-xs uppercase tracking-wider text-white shadow-[2px_2px_0px_0px_hsl(var(--foreground))]">
      Username
    </label>
    <input
      type="text"
      placeholder="SuperReader99"
      className="w-full bg-muted border-3 border-foreground px-4 py-3 font-bangers text-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:shadow-[4px_4px_0px_0px_hsl(var(--foreground))] transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)]"
      {...loginForm.register("identifier")}
    />
    {activeLoginErrors.identifier && (
      <div className="mt-2 flex items-center gap-2 bg-red-500/10 border-2 border-red-500 px-3 py-2">
        <AlertCircle size={14} className="text-red-500" strokeWidth={3} />
        <p className="font-oswald text-sm text-red-600 font-bold">{activeLoginErrors.identifier.message}</p>
      </div>
    )}
  </div>

  {/* Password Field */}
  <div>
    <label className="mb-2 inline-block bg-secondary border-2 border-foreground px-3 py-1 font-oswald text-xs uppercase tracking-wider text-white shadow-[2px_2px_0px_0px_hsl(var(--foreground))]">
      Password
    </label>
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        placeholder="••••••••"
        className="w-full bg-muted border-3 border-foreground px-4 py-3 pr-14 font-bangers text-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:shadow-[4px_4px_0px_0px_hsl(var(--foreground))] transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)]"
        {...loginForm.register("password")}
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
    {activeLoginErrors.password && (
      <div className="mt-2 flex items-center gap-2 bg-red-500/10 border-2 border-red-500 px-3 py-2">
        <AlertCircle size={14} className="text-red-500" strokeWidth={3} />
        <p className="font-oswald text-sm text-red-600 font-bold">{activeLoginErrors.password.message}</p>
      </div>
    )}
  </div>

  {/* Feedback Message */}
  {feedback && (
    <div className="flex items-center gap-2 bg-red-500/10 border-3 border-red-500 px-4 py-3 shadow-[4px_4px_0px_0px_hsl(var(--foreground))]">
      <AlertCircle size={18} className="text-red-500 shrink-0" strokeWidth={3} />
      <p className="font-oswald text-sm text-red-600 font-bold uppercase tracking-wider">{feedback}</p>
    </div>
  )}

  {/* Submit Button */}
  <button
    type="submit"
    disabled={isLoggingIn}
    className="mt-2 w-full bg-accent border-4 border-foreground py-4 font-bangers text-2xl text-white shadow-[6px_6px_0px_0px_hsl(var(--foreground))] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[3px_3px_0px_0px_hsl(var(--foreground))] hover:bg-primary disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[6px_6px_0px_0px_hsl(var(--foreground))] relative overflow-hidden group"
  >
    {/* Shine effect */}
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500"/>
    <span className="relative z-10 flex items-center justify-center gap-2">
      {isLoggingIn ? (
        <>
          <Loader2 size={24} className="animate-spin" strokeWidth={3} />
          PROCESSING...
        </>
      ) : (
        <>
          <Zap size={24} strokeWidth={3} />
          LOGIN
        </>
      )}
    </span>
  </button>

  {/* Register Link */}
  <p className="text-center font-oswald text-sm text-muted-foreground uppercase tracking-wider">
    No account?{" "}
    <button
      type="button"
      onClick={() => onModeChange("register")}
      className="inline-flex items-center gap-1 bg-primary border-2 border-foreground px-3 py-1 font-bangers text-base text-white shadow-[3px_3px_0px_0px_hsl(var(--foreground))] transition-all hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_hsl(var(--foreground))] hover:bg-accent ml-2"
    >
      Join the Universe!
      <ArrowRight size={14} strokeWidth={3} />
    </button>
  </p>
</form>
  );
}
