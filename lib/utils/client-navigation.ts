type RouterLike = {
  back: () => void;
  push: (href: string) => void;
  replace: (href: string) => void;
};

function isBrokenPushStateError(error: unknown) {
  if (!(error instanceof Error)) {
    return false;
  }

  const stack = error.stack ?? "";
  return error.message.includes("dispatchEvent") && stack.includes("pushState");
}

function assignHref(href: string, replace = false) {
  if (typeof window === "undefined") {
    return;
  }

  if (replace) {
    window.location.replace(href);
    return;
  }

  window.location.assign(href);
}

export function navigateWithFallback(
  router: RouterLike,
  href: string,
  options?: { replace?: boolean },
) {
  try {
    if (options?.replace) {
      router.replace(href);
      return;
    }

    router.push(href);
  } catch (error) {
    if (!isBrokenPushStateError(error)) {
      throw error;
    }

    assignHref(href, options?.replace);
  }
}

export function goBackWithFallback(router: RouterLike, fallbackHref: string) {
  try {
    if (typeof window !== "undefined" && window.history.length <= 1) {
      assignHref(fallbackHref);
      return;
    }

    router.back();
  } catch (error) {
    if (!isBrokenPushStateError(error)) {
      throw error;
    }

    assignHref(fallbackHref);
  }
}

export function isIgnorableNavigationError(error: unknown) {
  return isBrokenPushStateError(error);
}
