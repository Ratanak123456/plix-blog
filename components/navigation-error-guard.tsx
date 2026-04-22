"use client";

import { useEffect } from "react";
import { isIgnorableNavigationError } from "@/lib/utils/client-navigation";

export function NavigationErrorGuard() {
  useEffect(() => {
    const originalPushState = window.history.pushState.bind(window.history);
    const originalReplaceState = window.history.replaceState.bind(window.history);

    const resolveHref = (url: string | URL | null | undefined) => {
      if (!url) {
        return null;
      }

      return typeof url === "string" ? url : url.toString();
    };

    const installHistoryGuard = (
      method: "pushState" | "replaceState",
      originalMethod: History["pushState"] | History["replaceState"],
    ) => {
      const guardedMethod: History["pushState"] = function guardedHistoryMethod(
        data: unknown,
        unused: string,
        url?: string | URL | null,
      ) {
        try {
          return originalMethod(data, unused, url);
        } catch (error) {
          if (!isIgnorableNavigationError(error)) {
            throw error;
          }

          const href = resolveHref(url);
          if (!href) {
            return;
          }

          if (method === "replaceState") {
            window.location.replace(href);
            return;
          }

          window.location.assign(href);
        }
      };

      window.history[method] = guardedMethod;
      return () => {
        window.history[method] = originalMethod;
      };
    };

    const restorePushState = installHistoryGuard("pushState", originalPushState);
    const restoreReplaceState = installHistoryGuard("replaceState", originalReplaceState);

    const handleError = (event: ErrorEvent) => {
      if (!isIgnorableNavigationError(event.error)) {
        return;
      }

      event.preventDefault();
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (!isIgnorableNavigationError(event.reason)) {
        return;
      }

      event.preventDefault();
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      restorePushState();
      restoreReplaceState();
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
    };
  }, []);

  return null;
}
