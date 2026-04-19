export { authApi } from "@/lib/api/base-api";

export {
  useLoginMutation,
  useRefreshMutation,
  useRegisterMutation,
} from "@/lib/features/auth/auth-api";
export {
  useGetMyProfileQuery,
  useGetPublicProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
} from "@/lib/features/profile/profile-api";
export {
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
} from "@/lib/features/posts/posts-api";
export { useCreateCommentMutation, useGetPostCommentsQuery, useDeleteCommentMutation } from "@/lib/features/comments/comments-api";
export {
  useGetPostBookmarkStatusQuery,
  useGetPostLikesQuery,
  useGetPostLikeStatusQuery,
  useTogglePostBookmarkMutation,
  useTogglePostLikeMutation,
} from "@/lib/features/posts/post-engagement-api";

export type {
  BlogComment,
  BlogCategory,
  BlogPost,
  BlogTag,
  PageResponse,
  UserProfile,
} from "@/lib/types";

