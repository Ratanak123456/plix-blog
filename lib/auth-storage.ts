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

const AUTH_STORAGE_KEY = "plixblog-auth";

export const emptyAuthState: PersistedAuthState = {
  accessToken: null,
  refreshToken: null,
  user: null,
  isAuthenticated: false,
};

export function loadAuthState(): PersistedAuthState {
  if (typeof window === "undefined") {
    return emptyAuthState;
  }

  const rawState = window.localStorage.getItem(AUTH_STORAGE_KEY);
  if (!rawState) {
    return emptyAuthState;
  }

  try {
    const parsedState = JSON.parse(rawState) as Partial<PersistedAuthState>;
    return {
      accessToken: parsedState.accessToken ?? null,
      refreshToken: parsedState.refreshToken ?? null,
      user: parsedState.user ?? null,
      isAuthenticated: Boolean(parsedState.accessToken && parsedState.refreshToken),
    };
  } catch {
    return emptyAuthState;
  }
}

export function saveAuthState(state: PersistedAuthState) {
  if (typeof window === "undefined") {
    return;
  }

  if (!state.accessToken || !state.refreshToken) {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(state));
}
