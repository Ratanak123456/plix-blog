import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { emptyAuthState, type PersistedAuthState } from "@/lib/auth-storage";

const authSlice = createSlice({
  name: "auth",
  initialState: emptyAuthState,
  reducers: {
    hydrateAuthState: (_state, action: PayloadAction<PersistedAuthState>) => action.payload,
    setCredentials: (_state, action: PayloadAction<PersistedAuthState>) => ({
      ...action.payload,
      isAuthenticated: Boolean(action.payload.accessToken && action.payload.refreshToken),
    }),
    updateCurrentUser: (state, action: PayloadAction<PersistedAuthState["user"]>) => {
      state.user = action.payload;
    },
    logout: () => emptyAuthState,
  },
});

export const { hydrateAuthState, setCredentials, updateCurrentUser, logout } = authSlice.actions;
export const authReducer = authSlice.reducer;
