"use client";

import {
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { logout, setCredentials } from "@/lib/features/auth/auth-slice";
import type { BackendAuthResponse } from "@/lib/types";
import type { RootState } from "@/lib/store";

function toPersistedAuthState(response: BackendAuthResponse) {
  return {
    accessToken: response.accessToken ?? null,
    refreshToken: response.refreshToken ?? null,
    user: {
      id: response.user.id,
      username: response.user.username,
      fullName: response.user.fullName,
      email: response.user.email,
      bio: response.user.bio,
      profileImage: response.user.profileImage,
      coverImage: response.user.coverImage,
      verified: response.user.isVerified ?? response.user.verified ?? false,
      role: response.user.role,
      createdAt: response.user.createdAt,
    },
    isAuthenticated: Boolean(response.accessToken && response.refreshToken),
  };
}

const endpointsRequiringAuth = new Set([
  "getMyProfile",
  "updateProfile",
  "getMyBookmarks",
  "getPostLikeStatus",
  "getPostBookmarkStatus",
  "createTag",
  "createPost",
  "updatePost",
  "createComment",
  "togglePostLike",
  "togglePostBookmark",
  "deletePost",
  "deleteComment",
]);

const endpointsWithJsonBody = new Set([
  "register",
  "login",
  "refresh",
  "updateProfile",
  "createTag",
  "createPost",
  "updatePost",
  "createComment",
]);

const rawBaseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://plix-blog-api.onrender.com/api/v1",
  prepareHeaders: (headers, { getState, endpoint, type }) => {
    const token = (getState() as RootState).auth.accessToken;

    if (token && endpointsRequiringAuth.has(endpoint)) {
      headers.set("authorization", `Bearer ${token}`);
    }
    if (type === "mutation" && endpointsWithJsonBody.has(endpoint)) {
      headers.set("content-type", "application/json");
    }

    return headers;
  },
});

export const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status !== 401) {
    return result;
  }

  const refreshToken = (api.getState() as RootState).auth.refreshToken;
  if (!refreshToken) {
    api.dispatch(logout());
    return result;
  }

  const refreshResult = await rawBaseQuery(
    {
      url: "/auth/refresh",
      method: "POST",
      body: { refreshToken },
    },
    api,
    extraOptions,
  );

  if (!refreshResult.data) {
    api.dispatch(logout());
    return result;
  }

  api.dispatch(setCredentials(toPersistedAuthState(refreshResult.data as BackendAuthResponse)));

  result = await rawBaseQuery(args, api, extraOptions);
  return result;
};

