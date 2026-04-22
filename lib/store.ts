"use client";

import { configureStore, type Middleware } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { emptyAuthState, saveAuthState } from "@/lib/features/auth/auth-storage";
import { authReducer } from "@/lib/features/auth/auth-slice";
import { authApi } from "@/lib/services/auth-api";
import { filesApi } from "@/lib/features/uploads/files-api";

const authPersistenceMiddleware: Middleware = (storeApi) => (next) => (action) => {
  const result = next(action);

  if (typeof action === "object" && action !== null && "type" in action) {
    const actionType = String(action.type);
    if (actionType.startsWith("auth/")) {
      saveAuthState(storeApi.getState().auth);
    }
  }

  return result;
};

export const store = configureStore({
  preloadedState: {
    auth: emptyAuthState,
  },
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [filesApi.reducerPath]: filesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, filesApi.middleware, authPersistenceMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
