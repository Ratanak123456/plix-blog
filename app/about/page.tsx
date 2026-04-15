import { Metadata } from "next";
import { AboutCard } from "@/components/home/about-card";
import { AboutSummary } from "@/components/home/about-summary";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about PlixBlog, where silicon meets sequels.",
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <AboutCard />
      <div className="mt-12">
        <AboutSummary />
      </div>
    </div>
  );
}
