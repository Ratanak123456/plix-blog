import { NextResponse } from "next/server";
import { FILE_UPLOAD_URL } from "@/lib/config/env";
import type { UploadedFileResponse } from "@/lib/types";

type UpstreamUploadError = {
  message?: string;
  error?: string;
};

export const runtime = "nodejs";

async function readJsonPayload<T>(response: Response) {
  return (await response.json().catch(() => null)) as T | null;
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json(
      { message: "Image file is required." },
      { status: 400 },
    );
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json(
      { message: "Only image uploads are supported." },
      { status: 400 },
    );
  }

  const uploadBody = new FormData();
  uploadBody.append("file", file, file.name);

  try {
    const response = await fetch(FILE_UPLOAD_URL, {
      method: "POST",
      body: uploadBody,
    });

    if (!response.ok) {
      const payload = await readJsonPayload<UpstreamUploadError>(response);
      return NextResponse.json(
        {
          message:
            payload?.message ??
            payload?.error ??
            "Unable to upload the image right now.",
        },
        { status: response.status },
      );
    }

    const payload = await readJsonPayload<UploadedFileResponse>(response);

    if (!payload?.location) {
      return NextResponse.json(
        { message: "Upload succeeded, but no file location was returned." },
        { status: 502 },
      );
    }

    return NextResponse.json(payload);
  } catch {
    return NextResponse.json(
      { message: "Unable to reach the upload service right now." },
      { status: 502 },
    );
  }
}
