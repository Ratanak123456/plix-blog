import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { ApiErrorPayload } from "@/lib/types/auth";

export function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
  return typeof error === "object" && error !== null && "status" in error;
}

export function getErrorPayload(error: unknown): ApiErrorPayload | null {
  if (!isFetchBaseQueryError(error)) {
    return null;
  }

  return (error.data as ApiErrorPayload | undefined) ?? null;
}

export function getGeneralErrorMessage(error: unknown): string {
  const payload = getErrorPayload(error);
  if (payload?.validationErrors) {
    return Object.values(payload.validationErrors)[0] ?? payload.message ?? "Validation failed.";
  }

  return payload?.message ?? "Request failed. Please try again.";
}
