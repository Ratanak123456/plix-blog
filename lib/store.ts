"use client";

import { configureStore, type Middleware } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { loadAuthState, saveAuthState } from "@/lib/auth-storage";
import { authReducer } from "@/lib/features/auth/auth-slice";
import { authApi } from "@/lib/services/auth-api";

const authPersistenceMiddleware: Middleware = (storeApi) => (next) => (action) => {
  const result = next(action);
  saveAuthState(storeApi.getState().auth);
  return result;
};

export const store = configureStore({
  preloadedState: {
    auth: loadAuthState(),
  },
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, authPersistenceMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
