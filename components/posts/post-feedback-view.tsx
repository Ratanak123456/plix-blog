"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useGetPostBySlugQuery } from "@/lib/services/auth-api";
import { PostCommentsPanel, PostLikesPanel } from "@/components/posts/post-detail-shared";
import { PostSharePanel } from "@/components/posts/post-share-panel";

type PostFeedbackViewProps = {
  slug: string;
  mode: "likes" | "comments" | "share";
  modal?: boolean;
};

export function PostFeedbackView({ slug, mode, modal = false }: PostFeedbackViewProps) {
  const router = useRouter();
  const { data: post, isLoading, isError } = useGetPostBySlugQuery(slug);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-40 animate-pulse bg-card comic-border-secondary" />
        <div className="h-40 animate-pulse bg-card comic-border" />
        <div className="h-40 animate-pulse bg-card comic-border-accent" />
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="bg-card p-8 text-center comic-border-secondary">
        <p className="font-oswald text-xs uppercase tracking-[0.35em] text-muted-foreground">404 issue</p>
        <h1 className="mt-3 font-bangers text-4xl text-primary">Post not found</h1>
        <p className="mt-4 font-sans text-sm text-muted-foreground">This reaction panel could not be loaded.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {modal ? (
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 bg-card px-4 py-2 font-oswald text-xs uppercase tracking-[0.28em] text-primary comic-border-secondary"
          >
            <ArrowLeft size={14} />
            Back to story
          </button>
        ) : (
          <Link
            href={`/posts/${slug}`}
            className="inline-flex items-center gap-2 bg-card px-4 py-2 font-oswald text-xs uppercase tracking-[0.28em] text-primary comic-border-secondary"
          >
            <ArrowLeft size={14} />
            Back to story
          </Link>
        )}
        <div className="text-right">
          <p className="font-oswald text-xs uppercase tracking-[0.35em] text-muted-foreground">Story panel</p>
          <h1 className="mt-1 font-bangers text-3xl text-primary md:text-4xl">{post.title}</h1>
        </div>
      </div>

      {mode === "likes" ? <PostLikesPanel postId={post.id} replaceProfileNavigation={modal} /> : null}
      {mode === "comments" ? <PostCommentsPanel postId={post.id} replaceProfileNavigation={modal} /> : null}
      {mode === "share" ? <PostSharePanel slug={post.slug} title={post.title} /> : null}
    </div>
  );
}
