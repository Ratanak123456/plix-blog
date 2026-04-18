import { Metadata } from "next";
import { ProfileDashboard } from "@/components/users/profile-dashboard";
import { ProtectedRoute } from "@/components/auth/protected-route";

export const metadata: Metadata = {
  title: "My Profile",
  description: "Manage your PlixBlog profile, bookmarks, and stories.",
};

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileDashboard />
    </ProtectedRoute>
  );
}
