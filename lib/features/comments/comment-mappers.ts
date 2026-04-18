import type { BackendCommentResponse, BlogComment } from "@/lib/types";
import { normalizePublicUser } from "@/lib/features/profile/profile-mappers";

export function normalizeComment(comment: BackendCommentResponse): BlogComment {
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

