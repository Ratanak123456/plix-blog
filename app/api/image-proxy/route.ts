import { NextResponse } from "next/server";
import { FILES_API_BASE_URL } from "@/lib/config/env";

export const runtime = "nodejs";

const allowedBaseUrl = new URL(FILES_API_BASE_URL);
const allowedPathPrefix = `${allowedBaseUrl.pathname.replace(/\/+$/, "")}/`;

function isAllowedRemoteUrl(value: string) {
  try {
    const requestedUrl = new URL(value);

    return (
      requestedUrl.protocol === allowedBaseUrl.protocol &&
      requestedUrl.hostname === allowedBaseUrl.hostname &&
      requestedUrl.port === allowedBaseUrl.port &&
      requestedUrl.pathname.startsWith(allowedPathPrefix)
    );
  } catch {
    return false;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get("url");

  if (!imageUrl) {
    return NextResponse.json(
      { message: "Image URL is required." },
      { status: 400 },
    );
  }

  if (!isAllowedRemoteUrl(imageUrl)) {
    return NextResponse.json(
      { message: "Image URL is not allowed." },
      { status: 400 },
    );
  }

  try {
    const upstreamResponse = await fetch(imageUrl);

    if (!upstreamResponse.ok) {
      return NextResponse.json(
        { message: "Unable to fetch the image right now." },
        { status: upstreamResponse.status },
      );
    }

    const contentType =
      upstreamResponse.headers.get("content-type") ?? "application/octet-stream";

    if (!contentType.startsWith("image/")) {
      return NextResponse.json(
        { message: "The requested resource is not an image." },
        { status: 415 },
      );
    }

    const headers = new Headers();
    headers.set("content-type", contentType);
    headers.set(
      "cache-control",
      upstreamResponse.headers.get("cache-control") ??
        "public, max-age=31536000, immutable",
    );

    const contentLength = upstreamResponse.headers.get("content-length");
    if (contentLength) {
      headers.set("content-length", contentLength);
    }

    const etag = upstreamResponse.headers.get("etag");
    if (etag) {
      headers.set("etag", etag);
    }

    const lastModified = upstreamResponse.headers.get("last-modified");
    if (lastModified) {
      headers.set("last-modified", lastModified);
    }

    return new NextResponse(upstreamResponse.body, {
      status: upstreamResponse.status,
      headers,
    });
  } catch {
    return NextResponse.json(
      { message: "Unable to reach the image host right now." },
      { status: 502 },
    );
  }
}
