"use client";

import { useEffect } from "react";
import { Provider } from "react-redux";
import { loadAuthState } from "@/lib/auth-storage";
import { hydrateAuthState } from "@/lib/features/auth/auth-slice";
import { store } from "@/lib/store";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    store.dispatch(hydrateAuthState(loadAuthState()));
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
