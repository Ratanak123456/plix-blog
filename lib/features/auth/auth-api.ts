"use client";

import { authApi } from "@/lib/api/base-api";
import { setCredentials } from "@/lib/features/auth/auth-slice";
import type { BackendAuthResponse, LoginRequest, RegisterRequest } from "@/lib/types";

const extendedAuthApi = authApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<BackendAuthResponse, RegisterRequest>({
      query: (body) => ({
        url: "/auth/register",
        method: "POST",
        body,
      }),
    }),
    login: builder.mutation<BackendAuthResponse, LoginRequest>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            setCredentials({
              accessToken: data.accessToken ?? null,
              refreshToken: data.refreshToken ?? null,
              user: {
                id: data.user.id,
                username: data.user.username,
                fullName: data.user.fullName,
                email: data.user.email,
                bio: data.user.bio,
                profileImage: data.user.profileImage,
                coverImage: data.user.coverImage,
                verified: data.user.isVerified ?? data.user.verified ?? false,
                role: data.user.role,
                createdAt: data.user.createdAt,
              },
              isAuthenticated: Boolean(data.accessToken && data.refreshToken),
            }),
          );
        } catch {}
      },
    }),
    refresh: builder.mutation<BackendAuthResponse, { refreshToken: string }>({
      query: (body) => ({
        url: "/auth/refresh",
        method: "POST",
        body,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            setCredentials({
              accessToken: data.accessToken ?? null,
              refreshToken: data.refreshToken ?? null,
              user: {
                id: data.user.id,
                username: data.user.username,
                fullName: data.user.fullName,
                email: data.user.email,
                bio: data.user.bio,
                profileImage: data.user.profileImage,
                coverImage: data.user.coverImage,
                verified: data.user.isVerified ?? data.user.verified ?? false,
                role: data.user.role,
                createdAt: data.user.createdAt,
              },
              isAuthenticated: Boolean(data.accessToken && data.refreshToken),
            }),
          );
        } catch {}
      },
    }),
  }),
});

export const { useLoginMutation, useRefreshMutation, useRegisterMutation } = extendedAuthApi;

