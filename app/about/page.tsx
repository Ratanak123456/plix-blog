import type { Metadata } from "next";
import AboutContent from "@/components/about/about-content";

export const metadata: Metadata = {
  title: "About Us",
  description: "Meet the mentors and team behind PlixBlog's comic-inspired storytelling.",
};

export default function AboutPage() {
  return <AboutContent />;
}
