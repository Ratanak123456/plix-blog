import { FILES_API_BASE_URL } from "@/lib/config/env";

const filesApiPrefix = `${FILES_API_BASE_URL}/`;

export function getRenderableImageUrl(imageUrl: string | null | undefined) {
  const normalizedUrl = imageUrl?.trim();

  if (!normalizedUrl) {
    return null;
  }

  if (normalizedUrl.startsWith(filesApiPrefix)) {
    return `/api/image-proxy?url=${encodeURIComponent(normalizedUrl)}`;
  }

  return normalizedUrl;
}
