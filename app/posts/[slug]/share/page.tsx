import { PostFeedbackView } from "@/components/posts/post-feedback-view";

export default async function PostSharePage(props: PageProps<"/posts/[slug]/share">) {
  const { slug } = await props.params;

  return (
    <main className="min-h-screen bg-background px-4 py-10 text-foreground md:py-14">
      <div className="container mx-auto max-w-4xl">
        <PostFeedbackView slug={slug} mode="share" />
      </div>
    </main>
  );
}
