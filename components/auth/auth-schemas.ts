import { z } from "zod";

export const usernamePattern = /^[A-Za-z0-9._-]{3,30}$/;
export const passwordStrengthPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;

export const loginSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(1, "Username is required")
    .regex(usernamePattern, "Username must be 3-30 characters and contain no spaces")
    .refine((val) => !val.includes("@"), "Use your username, not your email, to login."),
  password: z
    .string()
    .min(1, "Password is required"),
});

export const registerSchema = z.object({
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

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
