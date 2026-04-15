"use client";

import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { logout, setCredentials, updateCurrentUser } from "@/lib/features/auth/auth-slice";
import type { AuthUser, PersistedAuthState } from "@/lib/auth-storage";
import type { RootState } from "@/lib/store";

type BackendAuthResponse = {
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

type BackendUserResponse = {
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

type BackendPostResponse = {
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
  };
  category: {
    id: string;
    name: string;
  } | null;
  tags: Array<{ id: string; name: string; slug: string }>;
  likedByCurrentUser?: boolean;
  bookmarkedByCurrentUser?: boolean;
};

type BackendCommentResponse = {
  id: string;
  content: string;
  createdAt: string;
  user: BackendUserResponse;
  parentId: string | null;
  replies: BackendCommentResponse[];
  likeCount: number | null;
  likedByCurrentUser?: boolean;
};

type BackendTagResponse = {
  id: string;
  name: string;
  slug: string;
  postCount: number | null;
};

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

export type UserProfile = AuthUser;

export type BlogComment = {
  id: string;
  content: string;
  createdAt: string;
  user: UserProfile;
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

export type UpdateProfileRequest = {
  username: string;
  fullName: string;
  email: string;
  bio: string | null;
  profileImage: string | null;
  coverImage: string | null;
};

type ToggleLikeResponse = {
  liked: boolean;
  likeCount: number;
};

type ToggleBookmarkResponse = {
  bookmarked: boolean;
  bookmarkCount: number;
};

type LikeStatusResponse = {
  liked: boolean;
};

type BookmarkStatusResponse = {
  bookmarked: boolean;
};

type LoginRequest = {
  identifier: string;
  password: string;
};

type RegisterRequest = {
  username: string;
  fullName: string;
  email: string;
  password: string;
};

function normalizeUser(user: BackendAuthResponse["user"]): AuthUser {
  return {
    id: user.id,
    username: user.username,
    fullName: user.fullName,
    email: user.email,
    bio: user.bio,
    profileImage: user.profileImage,
    coverImage: user.coverImage,
    verified: user.isVerified ?? user.verified ?? false,
    role: user.role,
    createdAt: user.createdAt,
  };
}

function normalizePublicUser(user: BackendUserResponse): UserProfile {
  return {
    id: user.id,
    username: user.username,
    fullName: user.fullName,
    email: user.email,
    bio: user.bio,
    profileImage: user.profileImage,
    coverImage: user.coverImage,
    verified: user.isVerified ?? user.verified ?? false,
    role: user.role,
    createdAt: user.createdAt,
  };
}

function toPersistedAuthState(response: BackendAuthResponse): PersistedAuthState {
  return {
    accessToken: response.accessToken ?? null,
    refreshToken: response.refreshToken ?? null,
    user: normalizeUser(response.user),
    isAuthenticated: Boolean(response.accessToken && response.refreshToken),
  };
}

function normalizePost(post: BackendPostResponse): BlogPost {
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

function normalizeCategory(category: {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  postCount: number | null;
}): BlogCategory {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    postCount: category.postCount ?? 0,
  };
}

function normalizeTag(tag: BackendTagResponse): BlogTag {
  return {
    id: tag.id,
    name: tag.name,
    slug: tag.slug,
    postCount: tag.postCount ?? 0,
  };
}

function normalizeComment(comment: BackendCommentResponse): BlogComment {
  return {
    id: comment.id,
    content: comment.content,
    createdAt: comment.createdAt,
    user: normalizePublicUser(comment.user),
    parentId: comment.parentId,
    replies: comment.replies.map(normalizeComment),
    likeCount: comment.likeCount ?? 0,
    likedByCurrentUser: comment.likedByCurrentUser ?? false,
  };
}

const rawBaseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://plix-blog-api.onrender.com/api/v1",
  prepareHeaders: (headers, { getState, endpoint, type }) => {
    const token = (getState() as RootState).auth.accessToken;
    const endpointsRequiringAuth = new Set([
      "getMyProfile",
      "updateProfile",
      "getMyBookmarks",
      "getPostLikeStatus",
      "getPostBookmarkStatus",
      "createTag",
      "createPost",
      "createComment",
      "togglePostLike",
      "togglePostBookmark",
    ]);
    const endpointsWithJsonBody = new Set([
      "register",
      "login",
      "refresh",
      "updateProfile",
      "createTag",
      "createPost",
      "createComment",
    ]);

    if (token && endpointsRequiringAuth.has(endpoint)) {
      headers.set("authorization", `Bearer ${token}`);
    }
    if (type === "mutation" && endpointsWithJsonBody.has(endpoint)) {
      headers.set("content-type", "application/json");
    }

    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status !== 401) {
    return result;
  }

  const refreshToken = (api.getState() as RootState).auth.refreshToken;
  if (!refreshToken) {
    api.dispatch(logout());
    return result;
  }

  const refreshResult = await rawBaseQuery(
    {
      url: "/auth/refresh",
      method: "POST",
      body: { refreshToken },
    },
    api,
    extraOptions,
  );

  if (!refreshResult.data) {
    api.dispatch(logout());
    return result;
  }

  const refreshedState = toPersistedAuthState(refreshResult.data as BackendAuthResponse);
  api.dispatch(setCredentials(refreshedState));

  result = await rawBaseQuery(args, api, extraOptions);
  return result;
};

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Profile", "Posts", "Tags", "Comments", "Likes", "Categories"],
  endpoints: (builder) => ({
    register: builder.mutation<BackendAuthResponse, RegisterRequest>({
      query: (body) => ({
        url: "/auth/register",
        method: "POST",
        body,
      }),
    }),
    login: builder.mutation<BackendAuthResponse, LoginRequest>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials(toPersistedAuthState(data)));
        } catch {}
      },
    }),
    refresh: builder.mutation<BackendAuthResponse, { refreshToken: string }>({
      query: (body) => ({
        url: "/auth/refresh",
        method: "POST",
        body,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials(toPersistedAuthState(data)));
        } catch {}
      },
    }),
    getMyProfile: builder.query<AuthUser, void>({
      query: () => "/profile",
      transformResponse: (response: BackendAuthResponse["user"]) => normalizeUser(response),
      providesTags: ["Profile"],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(updateCurrentUser(data));
        } catch {}
      },
    }),
    updateProfile: builder.mutation<AuthUser, UpdateProfileRequest>({
      query: (body) => ({
        url: "/profile",
        method: "PUT",
        body: {
          username: body.username.trim(),
          fullName: body.fullName.trim(),
          email: body.email.trim(),
          bio: body.bio?.trim() ? body.bio.trim() : null,
          profileImage: body.profileImage?.trim() ? body.profileImage.trim() : null,
          coverImage: body.coverImage?.trim() ? body.coverImage.trim() : null,
        },
      }),
      transformResponse: (response: BackendUserResponse) => normalizePublicUser(response),
      invalidatesTags: ["Profile"],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(updateCurrentUser(data));
        } catch {}
      },
    }),
    getPublicProfile: builder.query<UserProfile, string>({
      query: (username) => `/profiles/${username}`,
      transformResponse: (response: BackendUserResponse) => normalizePublicUser(response),
      providesTags: (_result, _error, username) => [{ type: "Profile", id: username }],
    }),
    getUserPosts: builder.query<BlogPost[], { username: string; page?: number; size?: number }>({
      query: ({ username, page = 0, size = 12 }) => ({
        url: `/profiles/${username}/posts`,
        params: { page, size },
      }),
      transformResponse: (response: PageResponse<BackendPostResponse>) => response.content.map(normalizePost),
      providesTags: (_result, _error, { username }) => [{ type: "Posts", id: `user-${username}` }],
    }),
    getUserPostsPage: builder.query<PageResponse<BlogPost>, { username: string; page?: number; size?: number }>({
      query: ({ username, page = 0, size = 9 }) => ({
        url: `/profiles/${username}/posts`,
        params: { page, size },
      }),
      transformResponse: (response: PageResponse<BackendPostResponse>) => ({
        ...response,
        content: response.content.map(normalizePost),
      }),
      providesTags: (_result, _error, { username }) => [{ type: "Posts", id: `user-${username}` }],
    }),
    getMyBookmarks: builder.query<PageResponse<BlogPost>, { page?: number; size?: number } | void>({
      query: (params) => ({
        url: "/profile/bookmarks",
        params: {
          page: params?.page ?? 0,
          size: params?.size ?? 9,
        },
      }),
      transformResponse: (response: PageResponse<BackendPostResponse>) => ({
        ...response,
        content: response.content.map(normalizePost),
      }),
      providesTags: ["Posts"],
    }),
    getMostLikedPosts: builder.query<BlogPost[], { page?: number; size?: number } | void>({
      query: (params) => ({
        url: "/posts/most-liked",
        params: {
          page: params?.page ?? 0,
          size: params?.size ?? 10,
        },
      }),
      transformResponse: (response: PageResponse<BackendPostResponse>) => response.content.map(normalizePost),
    }),
    getMostViewedPosts: builder.query<BlogPost[], { page?: number; size?: number } | void>({
      query: (params) => ({
        url: "/posts/most-viewed",
        params: {
          page: params?.page ?? 0,
          size: params?.size ?? 10,
        },
      }),
      transformResponse: (response: PageResponse<BackendPostResponse>) => response.content.map(normalizePost),
    }),
    getLatestPosts: builder.query<BlogPost[], { page?: number; size?: number } | void>({
      query: (params) => ({
        url: "/posts",
        params: {
          page: params?.page ?? 0,
          size: params?.size ?? 4,
          sort: "createdAt,desc",
        },
      }),
      transformResponse: (response: PageResponse<BackendPostResponse>) => response.content.map(normalizePost),
      providesTags: ["Posts"],
    }),
    getPostBySlug: builder.query<BlogPost, string>({
      query: (slug) => `/posts/${slug}`,
      transformResponse: (response: BackendPostResponse) => normalizePost(response),
      providesTags: ["Posts"],
    }),
    getCategories: builder.query<BlogCategory[], void>({
      query: () => "/categories",
      transformResponse: (
        response: Array<{
          id: string;
          name: string;
          slug: string;
          description: string | null;
          postCount: number | null;
        }>,
      ) => response.map(normalizeCategory),
      providesTags: ["Categories"],
    }),
    getTags: builder.query<BlogTag[], void>({
      query: () => "/tags",
      transformResponse: (response: BackendTagResponse[]) => response.map(normalizeTag),
      providesTags: ["Tags"],
    }),
    createTag: builder.mutation<BlogTag, CreateTagRequest>({
      query: (body) => ({
        url: "/tags",
        method: "POST",
        body,
      }),
      transformResponse: (response: BackendTagResponse) => normalizeTag(response),
      invalidatesTags: ["Tags"],
    }),
    createPost: builder.mutation<BlogPost, CreatePostRequest>({
      query: (body) => ({
        url: "/posts",
        method: "POST",
        body: {
          ...body,
          thumbnail: body.thumbnail?.trim() ? body.thumbnail.trim() : null,
          categoryId: body.categoryId || null,
          tagIds: body.tagIds ?? [],
        },
      }),
      transformResponse: (response: BackendPostResponse) => normalizePost(response),
      invalidatesTags: ["Posts", "Categories"],
    }),
    updatePost: builder.mutation<BlogPost, UpdatePostRequest>({
      query: ({ id, ...body }) => ({
        url: `/posts/${id}`,
        method: "PUT",
        body: {
          ...body,
          thumbnail: body.thumbnail?.trim() ? body.thumbnail.trim() : null,
          categoryId: body.categoryId || null,
          tagIds: body.tagIds ?? [],
        },
      }),
      transformResponse: (response: BackendPostResponse) => normalizePost(response),
      invalidatesTags: ["Posts", "Categories"],
    }),
    getPostLikes: builder.query<UserProfile[], { postId: string; page?: number; size?: number }>({
      query: ({ postId, page = 0, size = 50 }) => ({
        url: `/posts/${postId}/likes`,
        params: { page, size },
      }),
      transformResponse: (response: PageResponse<BackendUserResponse>) => response.content.map(normalizePublicUser),
      providesTags: (_result, _error, { postId }) => [{ type: "Likes", id: postId }],
    }),
    getPostComments: builder.query<BlogComment[], { postId: string; page?: number; size?: number }>({
      query: ({ postId, page = 0, size = 50 }) => ({
        url: `/posts/${postId}/comments`,
        params: { page, size },
      }),
      transformResponse: (response: PageResponse<BackendCommentResponse>) => response.content.map(normalizeComment),
      providesTags: (_result, _error, { postId }) => [{ type: "Comments", id: postId }],
    }),
    createComment: builder.mutation<BlogComment, CreateCommentRequest>({
      query: ({ postId, content, parentId }) => ({
        url: `/posts/${postId}/comments`,
        method: "POST",
        body: {
          content,
          parentId: parentId ?? null,
        },
      }),
      transformResponse: (response: BackendCommentResponse) => normalizeComment(response),
      invalidatesTags: (_result, _error, { postId }) => [
        { type: "Comments", id: postId },
        "Posts",
      ],
    }),
    getPostLikeStatus: builder.query<boolean, string>({
      query: (postId) => `/posts/${postId}/like/status`,
      transformResponse: (response: LikeStatusResponse) => response.liked,
    }),
    getPostBookmarkStatus: builder.query<boolean, string>({
      query: (postId) => `/posts/${postId}/bookmark/status`,
      transformResponse: (response: BookmarkStatusResponse) => response.bookmarked,
    }),
    togglePostLike: builder.mutation<ToggleLikeResponse, string>({
      query: (postId) => ({
        url: `/posts/${postId}/like`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, postId) => ["Posts", { type: "Likes", id: postId }],
    }),
    togglePostBookmark: builder.mutation<ToggleBookmarkResponse, string>({
      query: (postId) => ({
        url: `/posts/${postId}/bookmark`,
        method: "POST",
      }),
      invalidatesTags: ["Posts"],
    }),
  }),
});

export const {
  useCreateCommentMutation,
  useCreatePostMutation,
  useUpdatePostMutation,
  useCreateTagMutation,
  useGetCategoriesQuery,
  useGetLatestPostsQuery,
  useGetMyBookmarksQuery,
  useGetPostBySlugQuery,
  useGetPostCommentsQuery,
  useGetPostBookmarkStatusQuery,
  useGetPostLikesQuery,
  useGetPostLikeStatusQuery,
  useGetMyProfileQuery,
  useGetMostLikedPostsQuery,
  useGetMostViewedPostsQuery,
  useGetPublicProfileQuery,
  useGetTagsQuery,
  useGetUserPostsQuery,
  useGetUserPostsPageQuery,
  useLoginMutation,
  useRefreshMutation,
  useRegisterMutation,
  useTogglePostBookmarkMutation,
  useTogglePostLikeMutation,
  useUpdateProfileMutation,
} = authApi;
