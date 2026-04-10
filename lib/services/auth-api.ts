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
    verified?: boolean;
    isVerified?: boolean;
    role: string;
    createdAt: string;
  };
};

type BackendPostResponse = {
  id: string;
  title: string;
  slug: string;
  content: string;
  thumbnailUrl: string | null;
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
  likedByCurrentUser?: boolean;
  bookmarkedByCurrentUser?: boolean;
};

type BackendTagResponse = {
  id: string;
  name: string;
  slug: string;
  postCount: number | null;
};

type PageResponse<T> = {
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

export type CreatePostRequest = {
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
    viewCount: post.viewCount ?? 0,
    likeCount: post.likeCount ?? 0,
    commentCount: post.commentCount ?? 0,
    bookmarkCount: post.bookmarkCount ?? 0,
    publishedAt: post.publishedAt,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    author: post.author,
    category: post.category,
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

const rawBaseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://plix-blog-api.onrender.com/api/v1",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    headers.set("content-type", "application/json");
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
  tagTypes: ["Profile", "Posts", "Tags"],
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
      invalidatesTags: ["Posts"],
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
      invalidatesTags: ["Posts"],
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
  useCreatePostMutation,
  useCreateTagMutation,
  useGetCategoriesQuery,
  useGetLatestPostsQuery,
  useGetPostBookmarkStatusQuery,
  useGetPostLikeStatusQuery,
  useGetMyProfileQuery,
  useGetMostLikedPostsQuery,
  useGetTagsQuery,
  useLoginMutation,
  useRefreshMutation,
  useRegisterMutation,
  useTogglePostBookmarkMutation,
  useTogglePostLikeMutation,
} = authApi;
