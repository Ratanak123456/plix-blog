"use client";

import { WritePostForm } from "@/components/write/write-post-form";
import { ProtectedRoute } from "@/components/auth/protected-route";

export default function WritePage() {
  return (
    <ProtectedRoute>
      <WritePostForm />
    </ProtectedRoute>
  );
}
