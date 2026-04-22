import type { UploadedFileResponse } from "@/lib/types";

type FileUploadErrorPayload = {
  message?: string;
};

function isUploadedFileResponse(value: unknown): value is UploadedFileResponse {
  if (!value || typeof value !== "object") {
    return false;
  }

  const response = value as Partial<UploadedFileResponse>;
  return (
    typeof response.originalname === "string" &&
    typeof response.filename === "string" &&
    typeof response.location === "string"
  );
}

export function getFileUploadErrorMessage(error: unknown) {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return "Unable to upload the image right now.";
}

export async function uploadImageFile(file: File) {
  if (!file.type.startsWith("image/")) {
    throw new Error("Please choose an image file.");
  }

  const body = new FormData();
  body.append("file", file, file.name);

  const response = await fetch("/api/uploads", {
    method: "POST",
    body,
  });

  const payload = (await response.json().catch(() => null)) as
    | UploadedFileResponse
    | FileUploadErrorPayload
    | null;

  if (!response.ok) {
    throw new Error(
      payload &&
        typeof payload === "object" &&
        "message" in payload &&
        typeof payload.message === "string"
        ? payload.message
        : "Unable to upload the image right now.",
    );
  }

  if (!isUploadedFileResponse(payload)) {
    throw new Error("The upload finished, but the response payload was invalid.");
  }

  return payload;
}
