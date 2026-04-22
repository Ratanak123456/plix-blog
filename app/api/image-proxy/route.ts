export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get("url");

  if (!imageUrl) {
    return new Response("Image URL is required", { status: 400 });
  }

  try {
    // Allow localhost for development
    const isLocalhost = imageUrl.includes("localhost") || imageUrl.includes("127.0.0.1");
    if (!imageUrl.startsWith("https://") && !isLocalhost) {
      return new Response("Only HTTPS and localhost URLs are allowed", { status: 400 });
    }
    
    const upstreamResponse = await fetch(imageUrl);

    if (!upstreamResponse.ok) {
      return new Response("Unable to fetch image", { status: upstreamResponse.status });
    }

    const contentType = upstreamResponse.headers.get("content-type") ?? "application/octet-stream";

    if (!contentType.startsWith("image/")) {
      return new Response("Not an image", { status: 415 });
    }

    const headers = new Headers();
    headers.set("content-type", contentType);
    headers.set("access-control-allow-origin", "*");
    headers.set("cache-control", "public, max-age=31536000, immutable");

    return new Response(upstreamResponse.body, {
      status: upstreamResponse.status,
      headers,
    });
  } catch {
    return new Response("Unable to reach image host", { status: 502 });
  }
}

export async function OPTIONS() {
  return new Response(null, {
    headers: {
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "GET",
      "access-control-allow-headers": "content-type",
    },
  });
}
