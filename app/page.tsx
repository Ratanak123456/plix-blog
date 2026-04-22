"use client";

import { Hero } from "@/components/home/hero";
import { MostRead } from "@/components/home/most-read";
import { OriginStories } from "@/components/home/origin-stories";
import { Categories } from "@/components/home/categories";
import { PopularIssues } from "@/components/home/popular-issues";
import { AboutSummary } from "@/components/home/about-summary";
import { FAQ } from "@/components/home/faq";
import { Reviews } from "@/components/home/reviews";
import { FeedbackForm } from "@/components/home/feedback-form";

export default function Page() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground transition-colors duration-300">
      <main>
        <Hero />
        <MostRead />
        <OriginStories />
        <Categories />
        <PopularIssues />
        <AboutSummary />
        <FAQ />
        <Reviews />
        {/* <FeedbackForm /> */}
      </main>
    </div>
  );
}
