"use client";

import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "@/lib/api/base-query";
import { apiTagTypes } from "@/lib/api/tag-types";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: [...apiTagTypes],
  endpoints: () => ({}),
});

