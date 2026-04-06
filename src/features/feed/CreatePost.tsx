"use client";

import { useState, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import UserAvatar from "@/components/UserAvatar";
import type { CurrentUserProfile } from "@/types/user";
import { displayName } from "@/types/user";
import { createPostAction } from "./feed.actions";

/** SVG path data from design-assets/feed.html (composer toolbar icons) */
const D = {
  photo:
    "M13.916 0c3.109 0 5.18 2.429 5.18 5.914v8.17c0 3.486-2.072 5.916-5.18 5.916H5.999C2.89 20 .827 17.572.827 14.085v-8.17C.827 2.43 2.897 0 6 0h7.917zm0 1.504H5.999c-2.321 0-3.799 1.735-3.799 4.41v8.17c0 2.68 1.472 4.412 3.799 4.412h7.917c2.328 0 3.807-1.734 3.807-4.411v-8.17c0-2.678-1.478-4.411-3.807-4.411zm.65 8.68l.12.125 1.9 2.147a.803.803 0 01-.016 1.063.642.642 0 01-.894.058l-.076-.074-1.9-2.148a.806.806 0 00-1.205-.028l-.074.087-2.04 2.717c-.722.963-2.02 1.066-2.86.26l-.111-.116-.814-.91a.562.562 0 00-.793-.07l-.075.073-1.4 1.617a.645.645 0 01-.97.029.805.805 0 01-.09-.977l.064-.086 1.4-1.617c.736-.852 1.95-.897 2.734-.137l.114.12.81.905a.587.587 0 00.861.033l.07-.078 2.04-2.718c.81-1.08 2.27-1.19 3.205-.275zM6.831 4.64c1.265 0 2.292 1.125 2.292 2.51 0 1.386-1.027 2.511-2.292 2.511S4.54 8.537 4.54 7.152c0-1.386 1.026-2.51 2.291-2.51zm0 1.504c-.507 0-.918.451-.918 1.007 0 .555.411 1.006.918 1.006.507 0 .919-.451.919-1.006 0-.556-.412-1.007-.919-1.007z",
  video:
    "M11.485 4.5c2.213 0 3.753 1.534 3.917 3.784l2.418-1.082c1.047-.468 2.188.327 2.271 1.533l.005.141v6.64c0 1.237-1.103 2.093-2.155 1.72l-.121-.047-2.418-1.083c-.164 2.25-1.708 3.785-3.917 3.785H5.76c-2.343 0-3.932-1.72-3.932-4.188V8.688c0-2.47 1.589-4.188 3.932-4.188h5.726zm0 1.5H5.76C4.169 6 3.197 7.05 3.197 8.688v7.015c0 1.636.972 2.688 2.562 2.688h5.726c1.586 0 2.562-1.054 2.562-2.688v-.686-6.329c0-1.636-.973-2.688-2.562-2.688zM18.4 8.57l-.062.02-2.921 1.306v4.596l2.921 1.307c.165.073.343-.036.38-.215l.008-.07V8.876c0-.195-.16-.334-.326-.305z",
  event:
    "M14.371 2c.32 0 .585.262.627.603l.005.095v.788c2.598.195 4.188 2.033 4.18 5v8.488c0 3.145-1.786 5.026-4.656 5.026H7.395C4.53 22 2.74 20.087 2.74 16.904V8.486c0-2.966 1.596-4.804 4.187-5v-.788c0-.386.283-.698.633-.698.32 0 .584.262.626.603l.006.095v.771h5.546v-.771c0-.386.284-.698.633-.698zm3.546 8.283H4.004l.001 6.621c0 2.325 1.137 3.616 3.183 3.697l.207.004h7.132c2.184 0 3.39-1.271 3.39-3.63v-6.692zm-3.202 5.853c.349 0 .632.312.632.698 0 .353-.238.645-.546.691l-.086.006c-.357 0-.64-.312-.64-.697 0-.354.237-.645.546-.692l.094-.006zm-3.742 0c.35 0 .632.312.632.698 0 .353-.238.645-.546.691l-.086.006c-.357 0-.64-.312-.64-.697 0-.354.238-.645.546-.692l.094-.006zm-3.75 0c.35 0 .633.312.633.698 0 .353-.238.645-.547.691l-.093.006c-.35 0-.633-.312-.633-.697 0-.354.238-.645.547-.692l.094-.006zm7.492-3.615c.349 0 .632.312.632.697 0 .354-.238.645-.546.692l-.086.006c-.357 0-.64-.312-.64-.698 0-.353.237-.645.546-.691l.094-.006zm-3.742 0c.35 0 .632.312.632.697 0 .354-.238.645-.546.692l-.086.006c-.357 0-.64-.312-.64-.698 0-.353.238-.645.546-.691l.094-.006zm-3.75 0c.35 0 .633.312.633.697 0 .354-.238.645-.547.692l-.093.006c-.35 0-.633-.312-.633-.698 0-.353.238-.645.547-.691l.094-.006zm6.515-7.657H8.192v.895c0 .385-.283.698-.633.698-.32 0-.584-.263-.626-.603l-.006-.095v-.874c-1.886.173-2.922 1.422-2.922 3.6v.402h13.912v-.403c.007-2.181-1.024-3.427-2.914-3.599v.874c0 .385-.283.698-.632.698-.32 0-.585-.263-.627-.603l-.005-.095v-.895z",
  article:
    "M12.49 0c2.92 0 4.665 1.92 4.693 5.132v9.659c0 3.257-1.75 5.209-4.693 5.209H5.434c-.377 0-.734-.032-1.07-.095l-.2-.041C2 19.371.74 17.555.74 14.791V5.209c0-.334.019-.654.055-.96C1.114 1.564 2.799 0 5.434 0h7.056zm-.008 1.457H5.434c-2.244 0-3.381 1.263-3.381 3.752v9.582c0 2.489 1.137 3.752 3.38 3.752h7.049c2.242 0 3.372-1.263 3.372-3.752V5.209c0-2.489-1.13-3.752-3.372-3.752zm-.239 12.053c.36 0 .652.324.652.724 0 .4-.292.724-.652.724H5.656c-.36 0-.652-.324-.652-.724 0-.4.293-.724.652-.724h6.587zm0-4.239a.643.643 0 01.632.339.806.806 0 010 .78.643.643 0 01-.632.339H5.656c-.334-.042-.587-.355-.587-.729s.253-.688.587-.729h6.587zM8.17 5.042c.335.041.588.355.588.729 0 .373-.253.687-.588.728H5.665c-.336-.041-.589-.355-.589-.728 0-.374.253-.688.589-.729H8.17z",
};

function PostPlaneIcon() {
  return (
    <svg
      className="_mar_img"
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="13"
      fill="none"
      viewBox="0 0 14 13"
      aria-hidden
    >
      <path
        fill="#fff"
        fillRule="evenodd"
        d="M6.37 7.879l2.438 3.955a.335.335 0 00.34.162c.068-.01.23-.05.289-.247l3.049-10.297a.348.348 0 00-.09-.35.341.341 0 00-.34-.088L1.75 4.03a.34.34 0 00-.247.289.343.343 0 00.16.347L5.666 7.17 9.2 3.597a.5.5 0 01.712.703L6.37 7.88zM9.097 13c-.464 0-.89-.236-1.14-.641L5.372 8.165l-4.237-2.65a1.336 1.336 0 01-.622-1.331c.074-.536.441-.96.957-1.112L11.774.054a1.347 1.347 0 011.67 1.682l-3.05 10.296A1.332 1.332 0 019.098 13z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function ComposerToolbar({
  withLabels,
  onPhotoClick,
}: {
  withLabels: boolean;
  onPhotoClick: () => void;
}) {
  return (
    <div className="_feed_inner_text_area_item">
      <div className="_feed_inner_text_area_bottom_photo _feed_common">
        <button type="button" className="_feed_inner_text_area_bottom_photo_link" onClick={onPhotoClick}>
          <span className="_feed_inner_text_area_bottom_photo_iamge _mar_img">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 20 20" aria-hidden>
              <path fill="#666" d={D.photo} />
            </svg>
          </span>
          {withLabels ? "Photo" : null}
        </button>
      </div>
      <div className="_feed_inner_text_area_bottom_video _feed_common">
        <button type="button" className="_feed_inner_text_area_bottom_photo_link">
          <span className="_feed_inner_text_area_bottom_photo_iamge _mar_img">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="24" fill="none" viewBox="0 0 22 24" aria-hidden>
              <path fill="#666" d={D.video} />
            </svg>
          </span>
          {withLabels ? "Video" : null}
        </button>
      </div>
      <div className="_feed_inner_text_area_bottom_event _feed_common">
        <button type="button" className="_feed_inner_text_area_bottom_photo_link">
          <span className="_feed_inner_text_area_bottom_photo_iamge _mar_img">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="24" fill="none" viewBox="0 0 22 24" aria-hidden>
              <path fill="#666" d={D.event} />
            </svg>
          </span>
          {withLabels ? "Event" : null}
        </button>
      </div>
      <div className="_feed_inner_text_area_bottom_article _feed_common">
        <button type="button" className="_feed_inner_text_area_bottom_photo_link">
          <span className="_feed_inner_text_area_bottom_photo_iamge _mar_img">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="20" fill="none" viewBox="0 0 18 20" aria-hidden>
              <path fill="#666" d={D.article} />
            </svg>
          </span>
          {withLabels ? "Article" : null}
        </button>
      </div>
    </div>
  );
}

/* ── Image preview with remove button ── */
function ImagePreview({
  src,
  onRemove,
}: {
  src: string;
  onRemove: () => void;
}) {
  return (
    <div
      style={{
        position: "relative",
        margin: "12px 0 4px",
        borderRadius: 8,
        overflow: "hidden",
        maxHeight: 280,
        background: "var(--bg3)",
      }}
    >
      <img
        src={src}
        alt="Selected"
        style={{
          width: "100%",
          maxHeight: 280,
          objectFit: "cover",
          display: "block",
          borderRadius: 8,
        }}
      />
      <button
        type="button"
        onClick={onRemove}
        aria-label="Remove image"
        style={{
          position: "absolute",
          top: 8,
          right: 8,
          width: 28,
          height: 28,
          borderRadius: "50%",
          border: "none",
          background: "rgba(0,0,0,0.55)",
          color: "#fff",
          fontSize: 16,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          lineHeight: 1,
        }}
      >
        ✕
      </button>
    </div>
  );
}

/* ── Globe / Lock icons for visibility toggle ── */
function GlobeIcon({ size = 14 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

function LockIcon({ size = 14 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

export default function CreatePost({
  currentUser,
}: {
  currentUser: CurrentUserProfile | null;
}) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const composerName = currentUser ? displayName(currentUser) : "Member";

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setUploadError(null);
    if (!file) return;

    // Validate on client side
    const allowed = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowed.includes(file.type)) {
      setUploadError("Only JPEG, PNG, GIF, and WebP images are allowed.");
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      setUploadError("Image must be under 4 MB.");
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setUploadError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!text.trim() && !imageFile) return;

    setLoading(true);
    setUploadError(null);

    let imageUrl = "";

    // Upload image first if selected
    if (imageFile) {
      try {
        const uploadForm = new FormData();
        uploadForm.append("file", imageFile);
        const res = await fetch("/api/upload", {
          method: "POST",
          body: uploadForm,
        });
        const data = await res.json();
        if (!res.ok) {
          alert(`UPLOAD ERROR: ${data.error || "Unknown Failure"}`);
          setUploadError(data.error || "Upload failed");
          setLoading(false);
          return;
        }
        imageUrl = data.url;
      } catch (err: any) {
        alert(`NETWORK ERROR: ${err?.message || "Failed to reach upload API"}`);
        setUploadError("Upload failed. Please try again.");
        setLoading(false);
        return;
      }
    }

    // Create the post with text + image URL
    const formData = new FormData();
    formData.set("text", text.trim() || " "); // server requires text
    formData.set("imageUrl", imageUrl);
    formData.set("isPublic", isPublic ? "true" : "false");

    const result = await createPostAction(formData);

    if (result.success) {
      setText("");
      setIsPublic(true);
      removeImage();
      await queryClient.invalidateQueries({ queryKey: ["feed"] });
      router.refresh();
    }
    setLoading(false);
  };

  const canPost = text.trim() || imageFile;

  return (
    <form onSubmit={handleSubmit}>
      <div className="_feed_inner_text_area _b_radious6 _padd_b24 _padd_t24 _padd_r24 _padd_l24 _mar_b16">
        <div className="_feed_inner_text_area_box">
          <UserAvatar
            className="_feed_inner_text_area_box_image"
            imgClassName="_txt_img user-avatar-img"
            src={currentUser?.avatarUrl}
            name={composerName}
          />
          <div className="form-floating _feed_inner_text_area_box_form">
            <textarea
              name="text"
              className="form-control _textarea"
              placeholder="Leave a comment here"
              id="feedCreateTextarea"
              rows={3}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <label className="_feed_textarea_label" htmlFor="feedCreateTextarea">
              Write something ...
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="23"
                height="24"
                fill="none"
                viewBox="0 0 23 24"
                aria-hidden
              >
                <path
                  fill="#666"
                  d="M19.504 19.209c.332 0 .601.289.601.646 0 .326-.226.596-.52.64l-.081.005h-6.276c-.332 0-.602-.289-.602-.645 0-.327.227-.597.52-.64l.082-.006h6.276zM13.4 4.417c1.139-1.223 2.986-1.223 4.125 0l1.182 1.268c1.14 1.223 1.14 3.205 0 4.427L9.82 19.649a2.619 2.619 0 01-1.916.85h-3.64c-.337 0-.61-.298-.6-.66l.09-3.941a3.019 3.019 0 01.794-1.982l8.852-9.5zm-.688 2.562l-7.313 7.85a1.68 1.68 0 00-.441 1.101l-.077 3.278h3.023c.356 0 .698-.133.968-.376l.098-.096 7.35-7.887-3.608-3.87zm3.962-1.65a1.633 1.633 0 00-2.423 0l-.688.737 3.606 3.87.688-.737c.631-.678.666-1.755.105-2.477l-.105-.124-1.183-1.268z"
                />
              </svg>
            </label>
          </div>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />

        {/* Image preview */}
        {imagePreview && (
          <ImagePreview src={imagePreview} onRemove={removeImage} />
        )}

        {/* Upload error */}
        {uploadError && (
          <p style={{ color: "#e74c3c", fontSize: 13, margin: "8px 0 0" }}>
            {uploadError}
          </p>
        )}

        {/* Visibility toggle */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          margin: "10px 0 0",
        }}>
          <button
            type="button"
            onClick={() => setIsPublic((v) => !v)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "5px 12px",
              borderRadius: 20,
              border: "1px solid var(--bcolor2)",
              background: isPublic ? "var(--bg3)" : "#fff3e0",
              color: isPublic ? "var(--color4)" : "#e65100",
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
              transition: ".2s all ease",
            }}
          >
            {isPublic ? <GlobeIcon /> : <LockIcon />}
            {isPublic ? "Public" : "Private"}
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          <span style={{ fontSize: 12, color: "var(--color7)" }}>
            {isPublic ? "Anyone can see this post" : "Only you can see this post"}
          </span>
        </div>

        {/* Desktop toolbar */}
        <div className="_feed_inner_text_area_bottom d-none d-lg-flex align-items-lg-center">
          <ComposerToolbar withLabels onPhotoClick={handlePhotoClick} />
          <div className="_feed_inner_text_area_btn">
            <button
              type="submit"
              className="_feed_inner_text_area_btn_link"
              disabled={loading || !canPost}
            >
              <PostPlaneIcon />
              <span>{loading ? "Posting…" : "Post"}</span>
            </button>
          </div>
        </div>

        {/* Mobile toolbar */}
        <div className="_feed_inner_text_area_bottom_mobile d-lg-none">
          <div className="_feed_inner_text_mobile">
            <ComposerToolbar withLabels={false} onPhotoClick={handlePhotoClick} />
            <div className="_feed_inner_text_area_btn">
              <button
                type="submit"
                className="_feed_inner_text_area_btn_link"
                disabled={loading || !canPost}
              >
                <PostPlaneIcon />
                <span>{loading ? "Posting…" : "Post"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
