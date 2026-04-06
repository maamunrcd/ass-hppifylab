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
    const filename = file.name || `upload-${Date.now()}`;
    const blob = await put(filename, file, {
      access: 'public',
    });

    console.log("Vercel Blob success:", blob.url);

    // Return the secure cloud URL path
    return NextResponse.json({ url: blob.url });
  } catch (error: any) {
    console.error("Vercel Blob upload failed:", error?.message || error);
    
    // Check if the token is missing
    if (error?.message?.includes("token")) {
      return NextResponse.json(
        { error: "Vercel Blob Storage is not connected. Please connect it in the Vercel Dashboard under the 'Storage' tab." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Cloud upload failed. Check server logs." },
      { status: 500 }
    );
  }
}
