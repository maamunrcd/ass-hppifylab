"use client";

import { useEffect, useRef, useCallback } from "react";
import PostCard from "./PostCard";
import { useFeed } from "./hooks/useFeed";
import type { FeedPayload } from "./feed.actions";
import type { CurrentUserProfile } from "@/types/user";

export default function FeedList({
  initialData,
  currentUserId,
  currentUser,
}: {
  initialData: FeedPayload;
  currentUserId?: string;
  currentUser: CurrentUserProfile | null;
}) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useFeed(initialData);

  const sentinelRef = useRef<HTMLDivElement>(null);

  const allPosts = data.pages.flatMap((page) => page.posts);

  /**
   * IntersectionObserver-based infinite scroll.
   * When the sentinel element at the bottom becomes visible, fetch the next page.
   */
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(handleObserver, {
      rootMargin: "200px",
    });

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [handleObserver]);

  return (
    <div className="_feed_list">
      {allPosts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          currentUserId={currentUserId}
          currentUser={currentUser}
        />
      ))}

      {/* Sentinel element for infinite scroll trigger */}
      <div ref={sentinelRef} style={{ height: 1 }} />

      {isFetchingNextPage && (
        <div
          className="text-center _padd_t24 _padd_b24"
          style={{ color: "var(--color3)" }}
        >
          Loading more posts...
        </div>
      )}

      {!hasNextPage && allPosts.length > 0 && (
        <p
          className="text-center _padd_t24 _padd_b24"
          style={{ color: "var(--color3)", fontSize: 14 }}
        >
          You&apos;re all caught up!
        </p>
      )}
    </div>
  );
}
