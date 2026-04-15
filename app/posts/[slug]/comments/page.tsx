import { PostFeedbackView } from "@/components/posts/post-feedback-view";

export default async function PostCommentsPage(props: PageProps<"/posts/[slug]/comments">) {
  const { slug } = await props.params;

  return (
    <main className="min-h-screen bg-background px-4 py-10 text-foreground md:py-14">
      <div className="container mx-auto max-w-4xl">
        <PostFeedbackView slug={slug} mode="comments" />
      </div>
    </main>
  );
}
