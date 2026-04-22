"use client";

import { useEffect } from "react";
import { isIgnorableNavigationError } from "@/lib/utils/client-navigation";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (isIgnorableNavigationError(error)) {
      return;
    }

    console.error(error);
  }, [error]);

  if (isIgnorableNavigationError(error)) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-2xl bg-card p-8 text-center comic-border-secondary">
          <p className="font-oswald text-xs uppercase tracking-[0.35em] text-muted-foreground">
            Navigation recovered
          </p>
          <h1 className="mt-3 font-bangers text-4xl text-primary">
            Browser extension blocked client navigation
          </h1>
          <p className="mt-4 font-sans text-sm text-muted-foreground">
            The page can still continue with a hard reload. Try again to continue.
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-6 inline-flex items-center justify-center bg-accent px-5 py-3 font-bangers text-xl text-accent-foreground comic-border"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-2xl bg-card p-8 text-center comic-border-secondary">
        <p className="font-oswald text-xs uppercase tracking-[0.35em] text-muted-foreground">
          Unexpected failure
        </p>
        <h1 className="mt-3 font-bangers text-4xl text-primary">Something went wrong</h1>
        <p className="mt-4 font-sans text-sm text-muted-foreground">
          Please retry the last action.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 inline-flex items-center justify-center bg-accent px-5 py-3 font-bangers text-xl text-accent-foreground comic-border"
        >
          Retry
        </button>
      </div>
    </div>
  );
}
