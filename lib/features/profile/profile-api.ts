"use client";

import { authApi } from "@/lib/api/base-api";
import { updateCurrentUser } from "@/lib/features/auth/auth-slice";
import { normalizePublicUser, normalizeUser } from "@/lib/features/profile/profile-mappers";
import type { AuthUser, BackendAuthResponse, BackendUserResponse, PasswordRequest, UpdateProfileRequest, UserProfile } from "@/lib/types";

const extendedProfileApi = authApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyProfile: builder.query<AuthUser, void>({
      query: () => "/profile",
      transformResponse: (response: BackendAuthResponse["user"]) => normalizeUser(response),
      providesTags: ["Profile"],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(updateCurrentUser(data));
        } catch {}
      },
    }),
    updateProfile: builder.mutation<AuthUser, UpdateProfileRequest>({
      query: (body) => ({
        url: "/profile",
        method: "PUT",
        body: {
          username: body.username.trim(),
          fullName: body.fullName.trim(),
          email: body.email.trim(),
          bio: body.bio?.trim() ? body.bio.trim() : null,
          profileImage: body.profileImage?.trim() ? body.profileImage.trim() : null,
          coverImage: body.coverImage?.trim() ? body.coverImage.trim() : null,
        },
      }),
      transformResponse: (response: BackendUserResponse) => normalizePublicUser(response),
      invalidatesTags: ["Profile"],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(updateCurrentUser(data));
        } catch {}
      },
    }),
    changePassword: builder.mutation<{message: string}, PasswordRequest>({
      query: (body) => ({
        url: "/profile/change-password",
        method: "PATCH",
        body,
      }),
    }),
    getPublicProfile: builder.query<UserProfile, string>({
      query: (username) => `/profiles/${username}`,
      transformResponse: (response: BackendUserResponse) => normalizePublicUser(response),
      providesTags: (_result, _error, username) => [{ type: "Profile", id: username }],
    }),
  }),
});

export const {
  useGetMyProfileQuery,
  useGetPublicProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
} = extendedProfileApi;

