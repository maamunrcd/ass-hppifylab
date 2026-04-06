"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { getFeedAction, type FeedPayload } from "../feed.actions";

export function useFeed(initialData: FeedPayload) {
  return useInfiniteQuery({
    queryKey: ["feed"],
    queryFn: ({ pageParam }: { pageParam: string | undefined }) =>
      getFeedAction(pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    initialData: { pages: [initialData], pageParams: [undefined] },
    initialDataUpdatedAt: Date.now(),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });
}
