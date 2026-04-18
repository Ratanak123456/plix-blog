"use client";

import { authApi } from "@/lib/api/base-api";
import { normalizeComment } from "@/lib/features/comments/comment-mappers";
import type { BackendCommentResponse, BlogComment, CreateCommentRequest, PageResponse } from "@/lib/types";

const extendedCommentsApi = authApi.injectEndpoints({
  endpoints: (builder) => ({
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
      invalidatesTags: (_result, _error, { postId }) => [{ type: "Comments", id: postId }, "Posts"],
    }),
  }),
});

export const { useCreateCommentMutation, useGetPostCommentsQuery } = extendedCommentsApi;

