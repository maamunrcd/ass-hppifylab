"use client";

import { useMemo } from "react";
import UserAvatar from "@/components/UserAvatar";
import type { CurrentUserProfile } from "@/types/user";
import { displayName } from "@/types/user";

export type LikePreview = {
  userId: string;
  user: {
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
  };
};

const MAX_AVATARS_WHEN_ALL = 6;
/** When total likes exceed threshold, show this many faces + numeric badge */
const AVATARS_BEFORE_BADGE = 5;

type LikeFacepileProps = {
  likeCount: number;
  likes: LikePreview[];
  liked: boolean;
  currentUserId?: string;
  currentUser: CurrentUserProfile | null;
};

export default function LikeFacepile({
  likeCount,
  likes,
  liked,
  currentUserId,
  currentUser,
}: LikeFacepileProps) {
  const merged = useMemo(() => {
    let rows: LikePreview[] = likes.map((l) => ({
      userId: l.userId,
      user: { ...l.user },
    }));

    if (
      liked &&
      currentUserId &&
      currentUser &&
      !rows.some((r) => r.userId === currentUserId)
    ) {
      rows = [
        {
          userId: currentUserId,
          user: {
            firstName: currentUser.firstName,
            lastName: currentUser.lastName,
            avatarUrl: currentUser.avatarUrl,
          },
        },
        ...rows,
      ];
    }

    if (!liked && currentUserId) {
      rows = rows.filter((r) => r.userId !== currentUserId);
    }

    const seen = new Set<string>();
    return rows.filter((r) => {
      if (seen.has(r.userId)) return false;
      seen.add(r.userId);
      return true;
    });
  }, [likes, liked, currentUserId, currentUser]);

  if (likeCount <= 0) return null;

  let toRender: LikePreview[];
  let overflow = 0;

  if (likeCount <= MAX_AVATARS_WHEN_ALL) {
    toRender = merged.slice(0, likeCount);
  } else {
    toRender = merged.slice(0, AVATARS_BEFORE_BADGE);
    overflow = likeCount - AVATARS_BEFORE_BADGE;
  }

  return (
    <div
      className="_like_facepile"
      aria-label={`${likeCount} ${likeCount === 1 ? "like" : "likes"}`}
    >
      {toRender.map((l, i) => (
        <div
          key={l.userId}
          className="_like_facepile_avatar_slot"
          style={{ zIndex: i + 1 }}
        >
          <UserAvatar
            src={l.user.avatarUrl}
            name={displayName(l.user)}
            className="_like_facepile_avatar"
            imgClassName="_like_facepile_avatar_img"
          />
        </div>
      ))}
      {overflow > 0 ? (
        <span className="_like_facepile_more" aria-hidden>
          {overflow > 99 ? "99+" : overflow}
        </span>
      ) : null}
    </div>
  );
}
