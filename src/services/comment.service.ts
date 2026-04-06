import { prisma } from "@/lib/prisma";

const authorSelect = {
  id: true,
  firstName: true,
  lastName: true,
} as const;

const likeSelect = {
  take: 6,
  select: { userId: true },
} as const;

const replyLeaf = {
  author: { select: authorSelect },
  _count: { select: { likes: true } },
  likes: likeSelect,
} as const;

export class CommentService {
  static async getComments(postId: string) {
    return prisma.comment.findMany({
      where: {
        postId,
        parentId: null,
      },
      include: {
        author: { select: authorSelect },
        _count: {
          select: {
            likes: true,
          },
        },
        likes: likeSelect,
        replies: {
          include: {
            ...replyLeaf,
            replies: {
              include: replyLeaf,
              orderBy: { createdAt: "asc" },
            },
          },
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  static async createComment(
    userId: string,
    data: { postId: string; content: string; parentId?: string }
  ) {
    return prisma.comment.create({
      data: {
        ...data,
        authorId: userId,
      },
    });
  }

  static async toggleLike(userId: string, commentId: string) {
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_commentId: {
          userId,
          commentId,
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
    }
    await prisma.like.create({
      data: {
        userId,
        commentId,
      },
    });
    return { liked: true };
  }
}
