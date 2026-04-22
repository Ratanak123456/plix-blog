import { InterceptedRouteModal } from "@/components/posts/intercepted-route-modal";
import { PostFeedbackView } from "@/components/posts/post-feedback-view";

export default async function InterceptedPostLikesPage(props: PageProps<"/posts/[slug]/likes">) {
  const { slug } = await props.params;

  return (
    <InterceptedRouteModal fallbackHref={`/posts/${slug}`}>
      <PostFeedbackView slug={slug} mode="likes" modal />
    </InterceptedRouteModal>
  );
}
