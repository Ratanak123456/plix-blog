import { Metadata } from "next";
import { PostDetailView } from "@/components/posts/post-detail-view";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://plix-blog-api.onrender.com/api/v1";

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await props.params;
  
  try {
    const response = await fetch(`${API_BASE_URL}/posts/${slug}`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!response.ok) {
      return {
        title: "Post Not Found | PlixBlog",
      };
    }

    const post = await response.json();
    const title = `${post.title} | PlixBlog`;
    // Remove HTML tags for the description
    const description = post.content ? post.content.replace(/<[^>]*>/g, "").substring(0, 160) + "..." : "";
    
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "article",
        url: `https://plix-blog.vercel.app/posts/${slug}`,
        images: post.thumbnailUrl ? [
          {
            url: post.thumbnailUrl,
            width: 1200,
            height: 630,
            alt: post.title,
          }
        ] : [],
        publishedTime: post.publishedAt || post.createdAt,
        authors: [post.author?.fullName || "PlixBlog Author"],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: post.thumbnailUrl ? [post.thumbnailUrl] : [],
      },
    };
  } catch (error) {
    console.error("Metadata error:", error);
    return {
      title: "PlixBlog",
    };
  }
}

export default async function PostDetailPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;

  return <PostDetailView slug={slug} />;
}
