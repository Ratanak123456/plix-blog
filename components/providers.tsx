"use client";

import { useEffect, useRef } from "react";
import { Provider } from "react-redux";
import { useAppSelector } from "@/lib/store";
import { loadAuthState } from "@/lib/features/auth/auth-storage";
import { hydrateAuthState } from "@/lib/features/auth/auth-slice";
import { useRefreshMutation } from "@/lib/services/auth-api";
import { ThemeProvider } from "next-themes";
import { store } from "@/lib/store";

const REFRESH_LEEWAY_MS = 60_000;
const MIN_REFRESH_DELAY_MS = 5_000;

function getTokenExpiryTime(token: string | null): number | null {
  if (!token) {
    return null;
  }

  try {
    const [, payload] = token.split(".");
    if (!payload) {
      return null;
    }

    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    const decoded = JSON.parse(window.atob(padded)) as { exp?: number };

    return typeof decoded.exp === "number" ? decoded.exp * 1000 : null;
  } catch {
    return null;
  }
}

function SessionRefreshManager() {
  const { accessToken, refreshToken, isAuthenticated } = useAppSelector((state) => state.auth);
  const [refresh] = useRefreshMutation();
  const refreshInFlightRef = useRef(false);

  useEffect(() => {
    if (!isAuthenticated || !accessToken || !refreshToken) {
      return;
    }

    const runRefresh = async () => {
      if (refreshInFlightRef.current) {
        return;
      }

      refreshInFlightRef.current = true;

      try {
        await refresh({ refreshToken }).unwrap();
      } catch {
        // Failed refresh is handled by the auth flow, which clears session state.
      } finally {
        refreshInFlightRef.current = false;
      }
    };

    const expiryTime = getTokenExpiryTime(accessToken);
    if (!expiryTime) {
      return;
    }

    const refreshDelay = Math.max(expiryTime - Date.now() - REFRESH_LEEWAY_MS, MIN_REFRESH_DELAY_MS);
    const timeoutId = window.setTimeout(() => {
      void runRefresh();
    }, refreshDelay);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [accessToken, isAuthenticated, refresh, refreshToken]);

  useEffect(() => {
    if (!isAuthenticated || !accessToken || !refreshToken) {
      return;
    }

    const runRefresh = async () => {
      if (refreshInFlightRef.current) {
        return;
      }

      refreshInFlightRef.current = true;

      try {
        await refresh({ refreshToken }).unwrap();
      } catch {
        // Failed refresh is handled by the auth flow, which clears session state.
      } finally {
        refreshInFlightRef.current = false;
      }
    };

    const refreshIfNeeded = () => {
      const expiryTime = getTokenExpiryTime(accessToken);
      if (!expiryTime) {
        return;
      }

      if (expiryTime - Date.now() <= REFRESH_LEEWAY_MS) {
        void runRefresh();
      }
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        refreshIfNeeded();
      }
    };

    window.addEventListener("focus", refreshIfNeeded);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.removeEventListener("focus", refreshIfNeeded);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [accessToken, isAuthenticated, refresh, refreshToken]);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    store.dispatch(hydrateAuthState(loadAuthState()));
  }, []);

  return (
    <Provider store={store}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <SessionRefreshManager />
        {children}
      </ThemeProvider>
    </Provider>
  );
}
