import { UserProfileView } from "@/components/users/user-profile-view";

export default async function UserProfilePage(props: PageProps<"/users/[username]">) {
  const { username } = await props.params;

  return <UserProfileView username={username} />;
}
