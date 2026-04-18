import type { BackendPostResponse, BlogPost } from "@/lib/types";

export function normalizePost(post: BackendPostResponse): BlogPost {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    content: post.content,
    thumbnailUrl: post.thumbnailUrl,
    status: post.status,
    viewCount: post.viewCount ?? 0,
    likeCount: post.likeCount ?? 0,
    commentCount: post.commentCount ?? 0,
    bookmarkCount: post.bookmarkCount ?? 0,
    publishedAt: post.publishedAt,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    author: post.author,
    category: post.category,
    tags: post.tags ?? [],
    likedByCurrentUser: post.likedByCurrentUser ?? false,
    bookmarkedByCurrentUser: post.bookmarkedByCurrentUser ?? false,
  };
}

