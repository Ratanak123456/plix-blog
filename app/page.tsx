import type { Metadata } from "next";
import { HomeContent } from "@/components/home/home-content";

export const metadata: Metadata = {
  title: "Home | PlixBlog",
  description: "Where silicon meets sequels. PlixBlog covers the arc of technology — from the first commit to the final panel.",
  openGraph: {
    title: "PlixBlog - The Tech Comic Blog",
    description: "Where silicon meets sequels. PlixBlog covers the arc of technology — from the first commit to the final panel.",
    url: "https://plix-blog.vercel.app",
    type: "website",
    images: [
      {
        url: "https://api.escuelajs.co/api/v1/files/d367.png",
        width: 1200,
        height: 630,
        alt: "PlixBlog Home",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PlixBlog - The Tech Comic Blog",
    description: "Where silicon meets sequels. PlixBlog covers the arc of technology — from the first commit to the final panel.",
    images: ["https://api.escuelajs.co/api/v1/files/d367.png"],
  },
};

export default function Page() {
  return <HomeContent />;
}
