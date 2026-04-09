export type AuthUser = {
  id: string;
  username: string;
  fullName: string;
  email: string;
  bio: string | null;
  profileImage: string | null;
  verified: boolean;
  role: string;
  createdAt: string;
};

export type PersistedAuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
};

const AUTH_USER_STORAGE_KEY = "plixblog-auth-user";
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
  const rawUser = window.localStorage.getItem(AUTH_USER_STORAGE_KEY);

  try {
    const parsedUser = rawUser ? (JSON.parse(rawUser) as AuthUser) : null;
    return {
      accessToken,
      refreshToken,
      user: parsedUser,
      isAuthenticated: Boolean(accessToken && refreshToken),
    };
  } catch {
    return emptyAuthState;
  }
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

  if (state.user) {
    window.localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(state.user));
  } else {
    window.localStorage.removeItem(AUTH_USER_STORAGE_KEY);
  }
}
