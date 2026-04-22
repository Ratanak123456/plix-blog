import { InterceptedRouteModal } from "@/components/posts/intercepted-route-modal";
import { PostFeedbackView } from "@/components/posts/post-feedback-view";

export default async function InterceptedPostCommentsPage(props: PageProps<"/posts/[slug]/comments">) {
  const { slug } = await props.params;

  return (
    <InterceptedRouteModal fallbackHref={`/posts/${slug}`}>
      <PostFeedbackView slug={slug} mode="comments" modal />
    </InterceptedRouteModal>
  );
}
