import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

/**
 * Image Upload Controller using Vercel Blob Storage.
 * This replaces local filesystem writes (fs) for serverless compatibility.
 */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Only JPEG, PNG, GIF, and WebP images are allowed" },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File size must be under 5 MB" },
        { status: 400 }
      );
    }

    /* 
     * Vercel Blob 'put' automatically handles storage, naming, 
     * and generates a secure public URL.
     */
    const blob = await put(file.name, file, {
      access: 'public',
    });

    // Return the secure cloud URL path
    return NextResponse.json({ url: blob.url });
  } catch (error) {
    console.error("Vercel Blob upload error:", error);
    return NextResponse.json(
      { error: "Cloud upload failed" },
      { status: 500 }
    );
  }
}
