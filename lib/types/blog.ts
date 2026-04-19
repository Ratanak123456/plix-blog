import { AuthUser } from "./auth";

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  content: string;
  thumbnailUrl: string | null;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  viewCount: number;
  likeCount: number;
  commentCount: number;
  bookmarkCount: number;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    username: string;
    fullName: string;
    profileImage: string | null;
  };
  category: {
    id: string;
    name: string;
  } | null;
  tags: Array<{ id: string; name: string; slug: string }>;
  likedByCurrentUser: boolean;
  bookmarkedByCurrentUser: boolean;
};

export type BlogCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  postCount: number;
};

export type BlogTag = {
  id: string;
  name: string;
  slug: string;
  postCount: number;
};

export type BlogComment = {
  id: string;
  content: string;
  createdAt: string;
  user: AuthUser;
  parentId: string | null;
  replies: BlogComment[];
  likeCount: number;
  likedByCurrentUser: boolean;
};

export type CreatePostRequest = {
  title: string;
  content: string;
  thumbnail?: string | null;
  categoryId?: string | null;
  tagIds?: string[];
  status: "DRAFT" | "PUBLISHED";
};

export type UpdatePostRequest = {
  id: string;
  title: string;
  content: string;
  thumbnail?: string | null;
  categoryId?: string | null;
  tagIds?: string[];
  status: "DRAFT" | "PUBLISHED";
};

export type CreateTagRequest = {
  name: string;
};

export type CreateCommentRequest = {
  postId: string;
  content: string;
  parentId?: string | null;
};
