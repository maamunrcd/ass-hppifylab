import { prisma } from '@/lib/prisma';

export class PostService {
  static async getFeed(cursor?: string, limit: number = 10, currentUserId?: string) {
    const posts = await prisma.post.findMany({
      take: limit,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      where: {
        OR: [
          { isPublic: true },
          ...(currentUserId ? [{ authorId: currentUserId }] : []),
        ],
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
        likes: {
          take: 6,
          orderBy: { createdAt: "desc" },
          select: {
            userId: true,
            user: {
              select: {
                firstName: true,
                lastName: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });

    const nextCursor = posts.length === limit ? posts[posts.length - 1].id : null;

    return {
      posts,
      nextCursor,
    };
  }

  static async createPost(userId: string, data: { text: string; imageUrl?: string; isPublic?: boolean }) {
    return prisma.post.create({
      data: {
        ...data,
        authorId: userId,
      },
    });
  }

  static async toggleLike(userId: string, postId: string) {
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (existingLike) {
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      });
      return { liked: false };
    } else {
      await prisma.like.create({
        data: {
          userId,
          postId,
        },
      });
      return { liked: true };
    }
  }
}
