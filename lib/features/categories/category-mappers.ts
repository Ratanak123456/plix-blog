import type { BlogCategory } from "@/lib/types";

type BackendCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  postCount: number | null;
};

export function normalizeCategory(category: BackendCategory): BlogCategory {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    postCount: category.postCount ?? 0,
  };
}

