"use client";

import { authApi } from "@/lib/api/base-api";
import { normalizeCategory } from "@/lib/features/categories/category-mappers";
import { normalizePost } from "@/lib/features/posts/post-mappers";
import { normalizeTag } from "@/lib/features/tags/tag-mappers";
import type {
  BackendPostResponse,
  BackendTagResponse,
  BlogCategory,
  BlogPost,
  BlogTag,
  CreatePostRequest,
  CreateTagRequest,
  PageResponse,
  UpdatePostRequest,
} from "@/lib/types";

type UserPostsArg = { username: string; status?: string; page?: number; size?: number };
type PaginationArg = { page?: number; size?: number } | void;

const extendedPostsApi = authApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserPosts: builder.query<BlogPost[], UserPostsArg>({
      query: ({ username, status, page = 0, size = 12 }) => ({
        url: `/profiles/${username}/posts`,
        params: { status, page, size },
      }),
      transformResponse: (response: PageResponse<BackendPostResponse>) => response.content.map(normalizePost),
      providesTags: (_result, _error, { username }) => [{ type: "Posts", id: `user-${username}` }],
    }),
    getUserPostsPage: builder.query<PageResponse<BlogPost>, UserPostsArg>({
      query: ({ username, status, page = 0, size = 9 }) => ({
        url: `/profiles/${username}/posts`,
        params: { status, page, size },
      }),
      transformResponse: (response: PageResponse<BackendPostResponse>) => ({
        ...response,
        content: response.content.map(normalizePost),
      }),
      providesTags: (_result, _error, { username }) => [{ type: "Posts", id: `user-${username}` }],
    }),
    getMyBookmarks: builder.query<PageResponse<BlogPost>, PaginationArg>({
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
    getMostLikedPosts: builder.query<BlogPost[], PaginationArg>({
      query: (params) => ({
        url: "/posts/most-liked",
        params: {
          page: params?.page ?? 0,
          size: params?.size ?? 10,
        },
      }),
      transformResponse: (response: PageResponse<BackendPostResponse>) => response.content.map(normalizePost),
    }),
    getMostViewedPosts: builder.query<BlogPost[], PaginationArg>({
      query: (params) => ({
        url: "/posts/most-viewed",
        params: {
          page: params?.page ?? 0,
          size: params?.size ?? 10,
        },
      }),
      transformResponse: (response: PageResponse<BackendPostResponse>) => response.content.map(normalizePost),
    }),
    getLatestPosts: builder.query<BlogPost[], PaginationArg>({
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
    deletePost: builder.mutation<void, string>({
      query: (id) => ({
        url: `/posts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Posts", "Categories"],
    }),
  }),
});

export const {
  useCreatePostMutation,
  useCreateTagMutation,
  useGetCategoriesQuery,
  useGetLatestPostsQuery,
  useGetMyBookmarksQuery,
  useGetMostLikedPostsQuery,
  useGetMostViewedPostsQuery,
  useGetPostBySlugQuery,
  useGetTagsQuery,
  useGetUserPostsPageQuery,
  useGetUserPostsQuery,
  useUpdatePostMutation,
  useDeletePostMutation,
} = extendedPostsApi;

