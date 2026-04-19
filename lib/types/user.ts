import { AuthUser } from "./auth";

export type UserProfile = AuthUser;

export type UpdateProfileRequest = {
  username: string;
  fullName: string;
  email: string;
  bio: string | null;
  profileImage: string | null;
  coverImage: string | null;
};

export type PasswordRequest = {
  currentPassword: string;
  newPassword: string;
};
