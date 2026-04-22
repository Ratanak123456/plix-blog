"use client";

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { UploadedFileResponse } from "@/lib/types";
import { FILES_API_BASE_URL } from "@/lib/config/env";

export const filesApi = createApi({
  reducerPath: "filesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: FILES_API_BASE_URL,
  }),
  endpoints: (builder) => ({
    uploadImage: builder.mutation<UploadedFileResponse, File>({
      query: (file) => {
        const body = new FormData();
        body.append("file", file, file.name);
        return {
          url: "/upload",
          method: "POST",
          body,
        };
      },
    }),
  }),
});

export const { useUploadImageMutation } = filesApi;
