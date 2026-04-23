import type { NextConfig } from "next";

const filesApiUrl = new URL(
  process.env.NEXT_PUBLIC_FILES_API_BASE_URL ??
    "https://api.escuelajs.co/api/v1/files",
);
const filesApiProtocol = filesApiUrl.protocol === "http:" ? "http" : "https";

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      {
        pathname: "/api/image-proxy",
        search: "?url=**",
      },
      {
        pathname: "/**",
      },
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.pinimg.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.fbcdn.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "share.google",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "static0.dualshockersimages.com",
        pathname: "/**",
      },
      {
        protocol: filesApiProtocol,
        hostname: filesApiUrl.hostname,
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
