import { type AuthUser, type PersistedAuthState } from "@/lib/types";

export type { AuthUser, PersistedAuthState };

const ACCESS_TOKEN_COOKIE = "plixblog-access-token";
const REFRESH_TOKEN_COOKIE = "plixblog-refresh-token";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

export const emptyAuthState: PersistedAuthState = {
  accessToken: null,
  refreshToken: null,
  user: null,
  isAuthenticated: false,
};

function getCookie(name: string): string | null {
  if (typeof document === "undefined") {
    return null;
  }

  const cookie = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${name}=`));

  if (!cookie) {
    return null;
  }

  return decodeURIComponent(cookie.split("=").slice(1).join("="));
}

function setCookie(name: string, value: string) {
  if (typeof document === "undefined") {
    return;
  }

  const secure = window.location.protocol === "https:" ? "; secure" : "";
  document.cookie =
    `${name}=${encodeURIComponent(value)}; path=/; max-age=${COOKIE_MAX_AGE}; samesite=lax${secure}`;
}

function clearCookie(name: string) {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${name}=; path=/; max-age=0; samesite=lax`;
}

export function loadAuthState(): PersistedAuthState {
  if (typeof window === "undefined") {
    return emptyAuthState;
  }

  const accessToken = getCookie(ACCESS_TOKEN_COOKIE);
  const refreshToken = getCookie(REFRESH_TOKEN_COOKIE);

  return {
    accessToken,
    refreshToken,
    user: null,
    isAuthenticated: Boolean(accessToken && refreshToken),
  };
}

export function saveAuthState(state: PersistedAuthState) {
  if (typeof window === "undefined") {
    return;
  }

  if (state.accessToken) {
    setCookie(ACCESS_TOKEN_COOKIE, state.accessToken);
  } else {
    clearCookie(ACCESS_TOKEN_COOKIE);
  }

  if (state.refreshToken) {
    setCookie(REFRESH_TOKEN_COOKIE, state.refreshToken);
  } else {
    clearCookie(REFRESH_TOKEN_COOKIE);
  }
}

