import { PostDetailView } from "@/components/posts/post-detail-view";

export default async function PostDetailPage(props: PageProps<"/posts/[slug]">) {
  const { slug } = await props.params;

  return <PostDetailView slug={slug} />;
}
