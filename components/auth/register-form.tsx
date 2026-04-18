"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
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
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className="w-full bg-background px-4 py-3 pr-12 font-oswald text-lg text-foreground transition-colors placeholder:text-muted-foreground/60 focus:border-accent focus:outline-none comic-border"
            {...registerForm.register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-accent focus:outline-none"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
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
        disabled={isRegistering}
        className="mt-2 w-full bg-accent py-3 font-bangers text-2xl text-background transition-colors hover:bg-primary disabled:cursor-not-allowed disabled:opacity-60 comic-border"
      >
        {isRegistering ? "PROCESSING..." : "REGISTER"}
      </button>

      <p className="text-center font-oswald text-sm text-muted-foreground">
        Already a hero?{" "}
        <button
          type="button"
          onClick={() => onModeChange("login")}
          className="text-accent underline transition-colors hover:text-primary"
        >
          Login here
        </button>
      </p>
    </form>
  );
}
