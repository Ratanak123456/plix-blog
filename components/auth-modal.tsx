"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useLoginMutation, useRegisterMutation } from "@/lib/services/auth-api";

type AuthModalProps = {
  open: boolean;
  mode: "login" | "register";
  onClose: () => void;
  onModeChange: (mode: "login" | "register") => void;
};

type ApiErrorPayload = {
  message?: string;
  validationErrors?: Record<string, string>;
};

const usernamePattern = /^[A-Za-z0-9._-]{3,30}$/;
const passwordStrengthPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;

const loginSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(1, "Username or email is required"),
  password: z
    .string()
    .min(1, "Password is required"),
});

const registerSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, "Username is required")
    .regex(usernamePattern, "Username must be 3-30 characters and contain no spaces"),
  fullName: z
    .string()
    .trim()
    .min(1, "Full name is required"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Invalid email format"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters")
    .regex(
      passwordStrengthPattern,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    ),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

const defaultLoginValues: LoginFormValues = {
  identifier: "",
  password: "",
};

const defaultRegisterValues: RegisterFormValues = {
  username: "",
  fullName: "",
  email: "",
  password: "",
};

function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
  return typeof error === "object" && error !== null && "status" in error;
}

function getErrorPayload(error: unknown): ApiErrorPayload | null {
  if (!isFetchBaseQueryError(error)) {
    return null;
  }

  return (error.data as ApiErrorPayload | undefined) ?? null;
}

function getGeneralErrorMessage(error: unknown): string {
  const payload = getErrorPayload(error);
  if (payload?.validationErrors) {
    return Object.values(payload.validationErrors)[0] ?? payload.message ?? "Validation failed.";
  }

  return payload?.message ?? "Request failed. Please try again.";
}

export function AuthModal({ open, mode, onClose, onModeChange }: AuthModalProps) {
  const [feedback, setFeedback] = useState<string | null>(null);
  const [login, { isLoading: isLoggingIn }] = useLoginMutation();
  const [register, { isLoading: isRegistering }] = useRegisterMutation();

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: defaultLoginValues,
    mode: "onBlur",
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: defaultRegisterValues,
    mode: "onBlur",
  });

  useEffect(() => {
    if (!open) {
      loginForm.reset(defaultLoginValues);
      registerForm.reset(defaultRegisterValues);
    }
  }, [loginForm, open, registerForm]);

  function handleClose() {
    loginForm.reset(defaultLoginValues);
    registerForm.reset(defaultRegisterValues);
    setFeedback(null);
    onClose();
  }

  function handleModeChange(nextMode: "login" | "register") {
    setFeedback(null);
    onModeChange(nextMode);
  }

  async function submitLogin(values: LoginFormValues) {
    setFeedback(null);
    try {
      await login(values).unwrap();
      handleClose();
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

  async function submitRegister(values: RegisterFormValues) {
    setFeedback(null);
    try {
      await register(values).unwrap();
      loginForm.reset({
        identifier: values.email,
        password: "",
      });
      registerForm.reset(defaultRegisterValues);
      setFeedback("Registration completed. Sign in with your new account.");
      onModeChange("login");
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

  const isSubmitting = isLoggingIn || isRegistering;
  const activeLoginErrors = loginForm.formState.errors;
  const activeRegisterErrors = registerForm.formState.errors;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 30 }}
            transition={{ type: "spring", bounce: 0.3 }}
            className="relative z-10 w-full max-w-md bg-card p-8 shadow-2xl comic-border"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-muted-foreground transition-colors hover:text-accent"
              aria-label="Close authentication modal"
            >
              <X size={24} />
            </button>
            <span className="font-bangers text-3xl logo-gradient">PLIXBLOG</span>
            <h2 className="mt-1 mb-1 font-bangers text-4xl">
              {mode === "login" ? "ENTER THE UNIVERSE" : "JOIN THE HEROES"}
            </h2>
            <p className="mb-6 font-oswald text-sm uppercase tracking-wide text-muted-foreground">
              {mode === "login" ? "Sign in to your account" : "Create your secret identity"}
            </p>

            {mode === "login" ? (
              <form className="flex flex-col gap-4" onSubmit={loginForm.handleSubmit(submitLogin)}>
                <div>
                  <label className="mb-1 block font-oswald text-xs uppercase tracking-wider text-muted-foreground">
                    Username or Email
                  </label>
                  <input
                    type="text"
                    placeholder="hero@plixblog.com or SuperReader99"
                    className="w-full bg-background px-4 py-3 font-oswald text-lg text-foreground transition-colors placeholder:text-muted-foreground/60 focus:border-accent focus:outline-none comic-border"
                    {...loginForm.register("identifier")}
                  />
                  {activeLoginErrors.identifier && (
                    <p className="mt-1 font-oswald text-sm text-red-500">{activeLoginErrors.identifier.message}</p>
                  )}
                </div>

                <div>
                  <label className="mb-1 block font-oswald text-xs uppercase tracking-wider text-muted-foreground">
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-background px-4 py-3 font-oswald text-lg text-foreground transition-colors placeholder:text-muted-foreground/60 focus:border-accent focus:outline-none comic-border"
                    {...loginForm.register("password")}
                  />
                  {activeLoginErrors.password && (
                    <p className="mt-1 font-oswald text-sm text-red-500">{activeLoginErrors.password.message}</p>
                  )}
                </div>

                {feedback && <p className="font-oswald text-sm text-red-500">{feedback}</p>}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-2 w-full bg-accent py-3 font-bangers text-2xl text-background transition-colors hover:bg-primary disabled:cursor-not-allowed disabled:opacity-60 comic-border"
                >
                  {isSubmitting ? "PROCESSING..." : "LOGIN"}
                </button>

                <p className="text-center font-oswald text-sm text-muted-foreground">
                  No account?{" "}
                  <button
                    type="button"
                    onClick={() => handleModeChange("register")}
                    className="text-accent underline transition-colors hover:text-primary"
                  >
                    Join the universe
                  </button>
                </p>
              </form>
            ) : (
              <form className="flex flex-col gap-4" onSubmit={registerForm.handleSubmit(submitRegister)}>
                <div>
                  <label className="mb-1 block font-oswald text-xs uppercase tracking-wider text-muted-foreground">
                    Username
                  </label>
                  <input
                    type="text"
                    placeholder="SuperReader99"
                    className="w-full bg-background px-4 py-3 font-oswald text-lg text-foreground transition-colors placeholder:text-muted-foreground/60 focus:border-accent focus:outline-none comic-border"
                    {...registerForm.register("username")}
                  />
                  {activeRegisterErrors.username && (
                    <p className="mt-1 font-oswald text-sm text-red-500">{activeRegisterErrors.username.message}</p>
                  )}
                </div>

                <div>
                  <label className="mb-1 block font-oswald text-xs uppercase tracking-wider text-muted-foreground">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Peter Parker"
                    className="w-full bg-background px-4 py-3 font-oswald text-lg text-foreground transition-colors placeholder:text-muted-foreground/60 focus:border-accent focus:outline-none comic-border"
                    {...registerForm.register("fullName")}
                  />
                  {activeRegisterErrors.fullName && (
                    <p className="mt-1 font-oswald text-sm text-red-500">{activeRegisterErrors.fullName.message}</p>
                  )}
                </div>

                <div>
                  <label className="mb-1 block font-oswald text-xs uppercase tracking-wider text-muted-foreground">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="hero@plixblog.com"
                    className="w-full bg-background px-4 py-3 font-oswald text-lg text-foreground transition-colors placeholder:text-muted-foreground/60 focus:border-accent focus:outline-none comic-border"
                    {...registerForm.register("email")}
                  />
                  {activeRegisterErrors.email && (
                    <p className="mt-1 font-oswald text-sm text-red-500">{activeRegisterErrors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="mb-1 block font-oswald text-xs uppercase tracking-wider text-muted-foreground">
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-background px-4 py-3 font-oswald text-lg text-foreground transition-colors placeholder:text-muted-foreground/60 focus:border-accent focus:outline-none comic-border"
                    {...registerForm.register("password")}
                  />
                  {activeRegisterErrors.password && (
                    <p className="mt-1 font-oswald text-sm text-red-500">{activeRegisterErrors.password.message}</p>
                  )}
                </div>

                {feedback && (
                  <p
                    className={`font-oswald text-sm ${
                      feedback.startsWith("Registration completed") ? "text-emerald-500" : "text-red-500"
                    }`}
                  >
                    {feedback}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-2 w-full bg-accent py-3 font-bangers text-2xl text-background transition-colors hover:bg-primary disabled:cursor-not-allowed disabled:opacity-60 comic-border"
                >
                  {isSubmitting ? "PROCESSING..." : "REGISTER"}
                </button>

                <p className="text-center font-oswald text-sm text-muted-foreground">
                  Already a hero?{" "}
                  <button
                    type="button"
                    onClick={() => handleModeChange("login")}
                    className="text-accent underline transition-colors hover:text-primary"
                  >
                    Login here
                  </button>
                </p>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
