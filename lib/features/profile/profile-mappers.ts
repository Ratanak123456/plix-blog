import type { AuthUser, BackendAuthResponse, BackendUserResponse, UserProfile } from "@/lib/types";

export function normalizeUser(user: BackendAuthResponse["user"]): AuthUser {
  return {
    id: user.id,
    username: user.username,
    fullName: user.fullName,
    email: user.email,
    bio: user.bio,
    profileImage: user.profileImage,
    coverImage: user.coverImage,
    verified: user.isVerified ?? user.verified ?? false,
    role: user.role,
    createdAt: user.createdAt,
  };
}

export function normalizePublicUser(user: BackendUserResponse): UserProfile {
  return {
    id: user.id,
    username: user.username,
    fullName: user.fullName,
    email: user.email,
    bio: user.bio,
    profileImage: user.profileImage,
    coverImage: user.coverImage,
    verified: user.isVerified ?? user.verified ?? false,
    role: user.role,
    createdAt: user.createdAt,
  };
}

