"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
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
    <form className="flex flex-col gap-4" onSubmit={loginForm.handleSubmit(submitLogin)}>
      <div>
        <label className="mb-1 block font-oswald text-xs uppercase tracking-wider text-muted-foreground">
          Username
        </label>
        <input
          type="text"
          placeholder="SuperReader99"
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
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className="w-full bg-background px-4 py-3 pr-12 font-oswald text-lg text-foreground transition-colors placeholder:text-muted-foreground/60 focus:border-accent focus:outline-none comic-border"
            {...loginForm.register("password")}
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
        {activeLoginErrors.password && (
          <p className="mt-1 font-oswald text-sm text-red-500">{activeLoginErrors.password.message}</p>
        )}
      </div>

      {feedback && <p className="font-oswald text-sm text-red-500">{feedback}</p>}

      <button
        type="submit"
        disabled={isLoggingIn}
        className="mt-2 w-full bg-accent py-3 font-bangers text-2xl text-background transition-colors hover:bg-primary disabled:cursor-not-allowed disabled:opacity-60 comic-border"
      >
        {isLoggingIn ? "PROCESSING..." : "LOGIN"}
      </button>

      <p className="text-center font-oswald text-sm text-muted-foreground">
        No account?{" "}
        <button
          type="button"
          onClick={() => onModeChange("register")}
          className="text-accent underline transition-colors hover:text-primary"
        >
          Join the universe
        </button>
      </p>
    </form>
  );
}
