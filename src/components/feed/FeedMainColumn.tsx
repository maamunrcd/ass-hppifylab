"use client";

import FeedStories from "@/components/feed/FeedStories";
import CreatePost from "@/features/feed/CreatePost";
import FeedList from "@/features/feed/FeedList";
import type { FeedPayload } from "@/features/feed/feed.actions";
import type { CurrentUserProfile } from "@/types/user";

export default function FeedMainColumn({
  initialData,
  currentUserId,
  currentUser,
}: {
  initialData: FeedPayload;
  currentUserId?: string;
  currentUser: CurrentUserProfile | null;
}) {
  return (
    <div className="_layout_middle_wrap _feed_column_scroll">
      <div className="_layout_middle_inner _feed_column_inner">
        <FeedStories />
        <CreatePost currentUser={currentUser} />
        <FeedList
          initialData={initialData}
          currentUserId={currentUserId}
          currentUser={currentUser}
        />
      </div>
    </div>
  );
}
