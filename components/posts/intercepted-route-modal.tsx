"use client";

import { useRouter } from "next/navigation";

export function InterceptedRouteModal({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <div className="fixed inset-0 z-[90] flex items-start justify-center overflow-y-auto bg-background/75 p-4 backdrop-blur-sm md:p-8">
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0"
        onClick={() => router.back()}
      />
      <div className="relative z-10 w-full max-w-4xl">{children}</div>
    </div>
  );
}
