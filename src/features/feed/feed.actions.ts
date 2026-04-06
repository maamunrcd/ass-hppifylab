"use server";

import { PostService } from "@/services/post.service";
import { CommentService } from "@/services/comment.service";
import { cookies } from "next/headers";
import { verifyAccessToken } from "@/lib/jwt";
import { revalidatePath } from "next/cache";
import { createCommentSchema, createPostSchema } from "@/lib/schemas";
import { z } from "zod";

async function getUserId() {
  const token = (await cookies()).get("token")?.value;
  if (!token) throw new Error("Unauthorized");
  const payload = await verifyAccessToken(token);
  if (!payload) throw new Error("Unauthorized");
  return payload.userId;
}

export type FeedPayload = {
  posts: Awaited<ReturnType<typeof PostService.getFeed>>["posts"];
  nextCursor: string | null;
};

const cuidSchema = z.string().cuid();

export async function getFeedAction(cursor?: string): Promise<FeedPayload> {
  let safeCursor: string | undefined;
  if (cursor) {
    const parsed = cuidSchema.safeParse(cursor);
    if (parsed.success) safeCursor = parsed.data;
  }

  // Get current user for visibility filtering (private posts)
  let currentUserId: string | undefined;
  try {
    const token = (await cookies()).get("token")?.value;
    if (token) {
      const payload = await verifyAccessToken(token);
      currentUserId = payload?.userId;
    }
  } catch { /* not logged in — only public posts */ }

  try {
    return await PostService.getFeed(safeCursor, 10, currentUserId);
  } catch {
    return { posts: [], nextCursor: null };
  }
}

export async function createPostAction(formData: FormData) {
  try {
    const userId = await getUserId();
    const raw = {
      text: formData.get("text"),
      imageUrl: formData.get("imageUrl") ?? "",
      isPublic: formData.get("isPublic") === "true",
    };
    const parsed = createPostSchema.safeParse(raw);
    if (!parsed.success) {
      const msg = parsed.error.issues[0]?.message ?? "Invalid post";
      return { success: false as const, error: msg };
    }

    const { text, imageUrl, isPublic } = parsed.data;
    await PostService.createPost(userId, {
      text,
      imageUrl: imageUrl || undefined,
      isPublic: isPublic ?? true,
    });
    revalidatePath("/feed");
    return { success: true as const };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create post";
    return { success: false as const, error: message };
  }
}

export async function toggleCommentLikeAction(commentId: string) {
  const idParse = cuidSchema.safeParse(commentId);
  if (!idParse.success) {
    return { error: "Invalid comment" as const };
  }
  try {
    const userId = await getUserId();
    const result = await CommentService.toggleLike(userId, idParse.data);
    return result;
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to toggle like";
    return { error: message };
  }
}

export async function toggleLikeAction(postId: string) {
  const idParse = cuidSchema.safeParse(postId);
  if (!idParse.success) {
    return { error: "Invalid post" as const };
  }
  try {
    const userId = await getUserId();
    const result = await PostService.toggleLike(userId, idParse.data);
    revalidatePath("/feed");
    return result;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to toggle like";
    return { error: message };
  }
}

export async function getCommentsAction(postId: string) {
  const idParse = cuidSchema.safeParse(postId);
  if (!idParse.success) {
    return { ok: false as const, error: "Invalid post", comments: [] };
  }
  try {
    const comments = await CommentService.getComments(idParse.data);
    return { ok: true as const, comments };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load comments";
    return { ok: false as const, error: message, comments: [] };
  }
}

export async function createCommentAction(raw: unknown) {
  try {
    const userId = await getUserId();
    const parsed = createCommentSchema.safeParse(raw);
    if (!parsed.success) {
      const msg = parsed.error.issues[0]?.message ?? "Invalid comment";
      return { success: false as const, error: msg };
    }

    await CommentService.createComment(userId, {
      postId: parsed.data.postId,
      content: parsed.data.content,
      parentId: parsed.data.parentId,
    });
    revalidatePath("/feed");
    return { success: true as const };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to comment";
    return { success: false as const, error: message };
  }
}
