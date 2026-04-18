export type AuthUser = {
  id: string;
  username: string;
  fullName: string;
  email: string;
  bio: string | null;
  profileImage: string | null;
  coverImage: string | null;
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

export type LoginRequest = {
  identifier: string;
  password: string;
};

export type RegisterRequest = {
  username: string;
  fullName: string;
  email: string;
  password: string;
};

export type ApiErrorPayload = {
  message?: string;
  validationErrors?: Record<string, string>;
};
