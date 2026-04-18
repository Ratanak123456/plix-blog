import type { BackendTagResponse, BlogTag } from "@/lib/types";

export function normalizeTag(tag: BackendTagResponse): BlogTag {
  return {
    id: tag.id,
    name: tag.name,
    slug: tag.slug,
    postCount: tag.postCount ?? 0,
  };
}

