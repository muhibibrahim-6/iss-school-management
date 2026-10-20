
import { z } from "zod";

export const loginSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(1, "Email or username is required.")
    .max(254, "Identifier is too long."),
  password: z
    .string()
    .min(1, "Password is required.")
    .max(128, "Password is too long."),
});

export const registerSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(100, "Name is too long."),
  email: z
    .string()
    .trim()
    .email("Enter a valid email address.")
    .max(254, "Email is too long.")
    .transform((value) => value.toLowerCase()),
  username: z.preprocess(
    (value) =>
      typeof value === "string" && value.trim() === ""
        ? undefined
        : value,
    z
      .string()
      .trim()
      .min(3, "Username must be at least 3 characters.")
      .max(30, "Username must be at most 30 characters.")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can contain letters, numbers, and underscores."
      )
      .optional()
  ),
  password: z
    .string()
    .min(12, "Password must be at least 12 characters.")
    .max(128, "Password must be at most 128 characters."),
});

export const createSchoolSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "School name is required.")
    .max(150, "School name is too long."),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .min(3, "School URL must be at least 3 characters.")
    .max(60, "School URL must be at most 60 characters.")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Use lowercase letters, numbers, and single hyphens."
    ),
  email: z
    .string()
    .trim()
    .email("Enter a valid email address.")
    .max(254, "Email is too long.")
    .transform((value) => value.toLowerCase())
    .optional(),
});
