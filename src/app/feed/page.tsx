import { getFeedAction } from "@/features/feed/feed.actions";
import FeedMainColumn from "@/components/feed/FeedMainColumn";
import FeedHeader from "@/components/feed/FeedHeader";
import FeedLeftSidebar from "@/components/feed/FeedLeftSidebar";
import FeedRightSidebar from "@/components/feed/FeedRightSidebar";
import FeedLayoutShell from "@/components/feed/FeedLayoutShell";
import { cookies } from "next/headers";
import { verifyAccessToken } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import type { CurrentUserProfile } from "@/types/user";

async function getCurrentUserProfile(
  userId: string | undefined
): Promise<CurrentUserProfile | null> {
  if (!userId) return null;
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      username: true,
      avatarUrl: true,
    },
  });
}

export default async function FeedPage() {
  const token = (await cookies()).get("token")?.value;
  const payload = token ? await verifyAccessToken(token) : null;
  const currentUserId = payload?.userId;

  const [initialFeed, currentUser] = await Promise.all([
    getFeedAction(),
    getCurrentUserProfile(currentUserId),
  ]);

  return (
    <FeedLayoutShell>
      <div className="_main_layout">
        <FeedHeader currentUser={currentUser} />
        <div className="container _custom_container">
          <div className="_layout_inner_wrap">
            <div className="row">
              <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12">
                <FeedLeftSidebar />
              </div>
              <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                <FeedMainColumn
                  initialData={initialFeed}
                  currentUserId={currentUserId}
                  currentUser={currentUser}
                />
              </div>
              <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12">
                <FeedRightSidebar />
              </div>
            </div>
          </div>
        </div>
      </div>
    </FeedLayoutShell>
  );
}
