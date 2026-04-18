"use client";

import { authApi } from "@/lib/api/base-api";
import { normalizePublicUser } from "@/lib/features/profile/profile-mappers";
import type {
  BackendUserResponse,
  BookmarkStatusResponse,
  LikeStatusResponse,
  PageResponse,
  ToggleBookmarkResponse,
  ToggleLikeResponse,
  UserProfile,
} from "@/lib/types";

const extendedPostEngagementApi = authApi.injectEndpoints({
  endpoints: (builder) => ({
    getPostLikes: builder.query<UserProfile[], { postId: string; page?: number; size?: number }>({
      query: ({ postId, page = 0, size = 50 }) => ({
        url: `/posts/${postId}/likes`,
        params: { page, size },
      }),
      transformResponse: (response: PageResponse<BackendUserResponse>) => response.content.map(normalizePublicUser),
      providesTags: (_result, _error, { postId }) => [{ type: "Likes", id: postId }],
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
  useGetPostBookmarkStatusQuery,
  useGetPostLikesQuery,
  useGetPostLikeStatusQuery,
  useTogglePostBookmarkMutation,
  useTogglePostLikeMutation,
} = extendedPostEngagementApi;

