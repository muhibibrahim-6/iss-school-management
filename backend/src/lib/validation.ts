
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
    .max(254)
    .transform((value) => value.toLowerCase()),
  username: z
    .string()
    .trim()
    .min(3)
    .max(30)
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can contain letters, numbers, and underscores."
    )
    .optional(),
  password: z
    .string()
    .min(12, "Password must be at least 12 characters.")
    .max(128),
});

export const createSchoolSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "School name is required.")
    .max(150),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .min(3)
    .max(60)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Use lowercase letters, numbers, and single hyphens."
    ),
  email: z
    .string()
    .trim()
    .email()
    .max(254)
    .optional(),
});
