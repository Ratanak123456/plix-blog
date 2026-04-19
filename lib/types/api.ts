export type PageResponse<T> = {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
};

export type BackendAuthResponse = {
  accessToken?: string;
  refreshToken?: string;
  tokenType?: string;
  user: {
    id: string;
    username: string;
    fullName: string;
    email: string;
    bio: string | null;
    profileImage: string | null;
    coverImage: string | null;
    verified?: boolean;
    isVerified?: boolean;
    role: string;
    createdAt: string;
  };
};

export type BackendUserResponse = {
  id: string;
  username: string;
  fullName: string;
  email: string;
  bio: string | null;
  profileImage: string | null;
  coverImage: string | null;
  verified?: boolean;
  isVerified?: boolean;
  role: string;
  createdAt: string;
};

export type BackendPostResponse = {
  id: string;
  title: string;
  slug: string;
  content: string;
  thumbnailUrl: string | null;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  viewCount: number | null;
  likeCount: number | null;
  commentCount: number | null;
  bookmarkCount: number | null;
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
  likedByCurrentUser?: boolean;
  bookmarkedByCurrentUser?: boolean;
};

export type BackendCommentResponse = {
  id: string;
  content: string;
  createdAt: string;
  user: BackendUserResponse;
  parentId: string | null;
  replies: BackendCommentResponse[];
  likeCount: number | null;
  likedByCurrentUser?: boolean;
};

export type BackendTagResponse = {
  id: string;
  name: string;
  slug: string;
  postCount: number | null;
};

export type ToggleLikeResponse = {
  liked: boolean;
  likeCount: number;
};

export type ToggleBookmarkResponse = {
  bookmarked: boolean;
  bookmarkCount: number;
};

export type LikeStatusResponse = {
  liked: boolean;
};

export type BookmarkStatusResponse = {
  bookmarked: boolean;
};
