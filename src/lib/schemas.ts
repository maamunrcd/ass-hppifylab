import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(100),
  lastName: z.string().trim().min(1, "Last name is required").max(100),
  email: z.string().trim().email("Enter a valid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128),
});

/** Absolute http(s) URLs or app-relative paths (e.g. /assets/...) */
const optionalPostImageUrl = z.preprocess(
  (v) => {
    if (v === null || v === undefined) return undefined;
    if (typeof v === "string" && v.trim() === "") return undefined;
    return typeof v === "string" ? v.trim() : v;
  },
  z
    .string()
    .refine(
      (s) => s.startsWith("/") || /^https?:\/\//i.test(s),
      { message: "Invalid image URL" }
    )
    .optional()
);

export const createPostSchema = z
  .object({
    text: z.string().trim().max(10_000).default(""),
    imageUrl: optionalPostImageUrl,
    isPublic: z.boolean().optional(),
  })
  .refine((d) => d.text.length > 0 || !!d.imageUrl, {
    message: "Post must have text or an image",
    path: ["text"],
  });

export const createCommentSchema = z.object({
  postId: z.string().cuid(),
  content: z.string().trim().min(1, "Comment cannot be empty").max(5_000),
  parentId: z.string().cuid().optional(),
});
