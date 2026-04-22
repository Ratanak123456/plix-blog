import type { Metadata } from "next";
import AboutContent from "@/components/about/about-content";

export const metadata: Metadata = {
  title: "About Us",
  description: "Meet the mentors and team behind PlixBlog's comic-inspired storytelling.",
  openGraph: {
    title: "About Us | PlixBlog",
    description: "Meet the mentors and team behind PlixBlog's comic-inspired storytelling.",
    url: "https://plix-blog.vercel.app/about",
    type: "website",
    images: [
      {
        url: "https://plix-blog.vercel.app/talk.jpg",
        width: 1200,
        height: 630,
        alt: "PlixBlog About Us",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us | PlixBlog",
    description: "Meet the mentors and team behind PlixBlog's comic-inspired storytelling.",
    images: ["https://plix-blog.vercel.app/talk.jpg"],
  },
};

export default function AboutPage() {
  return <AboutContent />;
}
