const DEFAULT_API_BASE_URL = "https://plix-blog-api.onrender.com/api/v1";
const DEFAULT_FILES_API_BASE_URL = "https://api.escuelajs.co/api/v1/files";

function normalizeBaseUrl(value: string | undefined, fallback: string) {
  return (value?.trim() || fallback).replace(/\/+$/, "");
}

export const API_BASE_URL = normalizeBaseUrl(
  process.env.NEXT_PUBLIC_API_BASE_URL,
  DEFAULT_API_BASE_URL,
);

export const FILES_API_BASE_URL = normalizeBaseUrl(
  process.env.NEXT_PUBLIC_FILES_API_BASE_URL,
  DEFAULT_FILES_API_BASE_URL,
);

export const FILE_UPLOAD_URL = `${FILES_API_BASE_URL}/upload`;
