import { InterceptedRouteModal } from "@/components/posts/intercepted-route-modal";
import { PostFeedbackView } from "@/components/posts/post-feedback-view";

export default async function InterceptedPostSharePage(props: PageProps<"/posts/[slug]/share">) {
  const { slug } = await props.params;

  return (
    <InterceptedRouteModal>
      <PostFeedbackView slug={slug} mode="share" modal />
    </InterceptedRouteModal>
  );
}
