"use client";

import { useParams } from "next/navigation";
import { WritePostForm } from "@/components/write/write-post-form";
import { useGetPostBySlugQuery } from "@/lib/services/auth-api";
import { LoaderCircle } from "lucide-react";
import { ProtectedRoute } from "@/components/auth/protected-route";

export default function EditPostPage() {
  const { slug } = useParams();
  const { data: post, isLoading, isError } = useGetPostBySlugQuery(slug as string, {
    skip: !slug,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <LoaderCircle size={48} className="animate-spin text-primary" />
          <p className="font-bangers text-2xl text-primary">Loading your story...</p>
        </div>
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="bg-card p-8 text-center comic-border">
          <h1 className="font-bangers text-5xl text-destructive">Story not found</h1>
          <p className="mt-4 font-sans text-muted-foreground">
            We couldn&apos;t find the blog post you&apos;re looking for. It may have been deleted or moved.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <WritePostForm initialData={post} isEditing={true} />
    </ProtectedRoute>
  );
}
