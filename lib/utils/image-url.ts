export function getRenderableImageUrl(imageUrl: string | null | undefined) {
  const normalizedUrl = imageUrl?.trim();

  if (!normalizedUrl) {
    return null;
  }

  // Route external HTTPS URLs through proxy to avoid CORS issues
  if (normalizedUrl.startsWith("https://")) {
    return `/api/image-proxy?url=${encodeURIComponent(normalizedUrl)}`;
  }

  return normalizedUrl;
}
