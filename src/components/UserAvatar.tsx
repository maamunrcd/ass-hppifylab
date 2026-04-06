"use client";

import { useState } from "react";

function initialsFromName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
}

type UserAvatarProps = {
  /** Absolute URL or path to image; empty → placeholder */
  src?: string | null;
  /** Used for initials fallback and alt text */
  name: string;
  /** Wrapper class (e.g. `_header_nav_profile_image`) */
  className?: string;
  /** Class on img or placeholder span */
  imgClassName?: string;
};

/**
 * Shows profile image when `src` loads; on missing URL or load error, shows initials.
 * Password is never passed here or shown in the UI.
 */
export default function UserAvatar({
  src,
  name,
  className = "",
  imgClassName = "",
}: UserAvatarProps) {
  const [imgFailed, setImgFailed] = useState(false);
  const showImage = Boolean(src?.trim()) && !imgFailed;
  const initials = initialsFromName(name);

  return (
    <div className={className}>
      {showImage ? (
        <img
          src={src!}
          alt=""
          className={imgClassName}
          onError={() => setImgFailed(true)}
        />
      ) : (
        <span
          className={imgClassName}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #1890ff 0%, #69c0ff 100%)",
            color: "#fff",
            fontWeight: 600,
            fontSize: "0.75em",
            lineHeight: 1,
          }}
          aria-hidden
        >
          {initials}
        </span>
      )}
    </div>
  );
}
