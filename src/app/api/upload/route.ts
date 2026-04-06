import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

const MAX_SIZE = 4 * 1024 * 1024; // 4 MB (Vercel Free Tier limit is 4.5MB)
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

/**
 * Image Upload Controller using Vercel Blob Storage.
 */
export async function POST(req: NextRequest) {
  try {
    console.log("Starting cloud upload process...");
    
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
        { error: "File size must be under 4 MB" },
        { status: 400 }
      );
    }

    /* 
     * Explicitly passing the token to ensure it's picked up 
     * correctly in Turbopack/Serverless environments.
     */
    const filename = file.name || `upload-${Date.now()}`;
    const blob = await put(filename, file, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN, // Explicit token detection
    });

    console.log("Cloud upload successful:", blob.url);

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
