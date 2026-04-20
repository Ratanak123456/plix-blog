"use client";

import { useGetMostLikedPostsQuery } from "@/lib/services/auth-api";
import { BlogCard } from "./blog-card";
import { Loader2 } from "lucide-react";

export function PopularIssues() {
  const { data: posts = [], isLoading } = useGetMostLikedPostsQuery({ page: 0, size: 4 });

  return (
    <section id="blog" className="container mx-auto px-4 py-10 ">
      <div className="mb-8 flex items-center gap-4">
        <h2 className="font-bangers text-3xl text-primary sm:text-4xl md:text-5xl">
          POPULAR ISSUES
        </h2>
        <div className="h-1 flex-1 bg-secondary" />
      </div>
      
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : posts.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {posts.map((post, index) => (
            <BlogCard key={post.id} post={post} index={index} />
          ))}
        </div>
      ) : (
        <div className="flex h-64 items-center justify-center bg-card comic-border">
          <p className="font-bangers text-2xl text-muted-foreground">No popular issues found</p>
        </div>
      )}
    </section>
  );
}
