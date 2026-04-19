import { Metadata } from "next";
import { UserProfileView } from "@/components/users/user-profile-view";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://plix-blog-api.onrender.com/api/v1";

export async function generateMetadata(props: { params: Promise<{ username: string }> }): Promise<Metadata> {
  const { username } = await props.params;
  
  try {
    const response = await fetch(`${API_BASE_URL}/profiles/${username}`, {
      next: { revalidate: 3600 }
    });
    
    if (!response.ok) {
      return {
        title: "User Not Found | PlixBlog",
      };
    }

    const user = await response.json();
    const title = `${user.fullName || username}'s Profile | PlixBlog`;
    const description = user.bio || `Explore the technical journey and stories from ${user.fullName || username} on PlixBlog.`;
    
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "profile",
        url: `https://plix-blog.vercel.app/users/${username}`,
        images: user.avatarUrl ? [
          {
            url: user.avatarUrl,
            width: 400,
            height: 400,
            alt: user.fullName || username,
          }
        ] : [
          {
            url: "https://plix-blog.vercel.app/talk.jpg",
            width: 1200,
            height: 630,
            alt: "PlixBlog",
          }
        ],
      },
      twitter: {
        card: "summary",
        title,
        description,
        images: user.avatarUrl ? [user.avatarUrl] : ["https://plix-blog.vercel.app/talk.jpg"],
      },
    };
  } catch {
    return {
      title: "User Profile | PlixBlog",
    };
  }
}

export default async function UserProfilePage(props: { params: Promise<{ username: string }> }) {
  const { username } = await props.params;

  return <UserProfileView username={username} />;
}
