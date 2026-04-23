"use client";

import { authApi } from "@/lib/api/base-api";
import { setCredentials } from "@/lib/features/auth/auth-slice";
import { normalizeUser } from "@/lib/features/profile/profile-mappers";
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
              user: data.user ? normalizeUser(data.user) : null,
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
              user: data.user ? normalizeUser(data.user) : null,
              isAuthenticated: Boolean(data.accessToken && data.refreshToken),
            }),
          );
        } catch {}
      },
    }),
  }),
});

export const { useLoginMutation, useRefreshMutation, useRegisterMutation } = extendedAuthApi;

