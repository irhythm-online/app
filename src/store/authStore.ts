import * as SecureStore from "expo-secure-store";
import { create } from "zustand";
import { signOutLocalCognitoUser, type AuthTokens } from "../auth/cognito";
import { decodeJwtPayload } from "../utils/jwt";

const STORAGE_KEY = "irhythm_auth_tokens";

export interface AuthUser {
  sub: string;
  email: string;
  displayName: string;
}

interface CognitoIdTokenClaims {
  sub: string;
  email?: string;
  name?: string;
}

type AuthStatus = "hydrating" | "signedOut" | "signedIn";

interface AuthState {
  status: AuthStatus;
  tokens: AuthTokens | null;
  user: AuthUser | null;
  hydrate: () => Promise<void>;
  completeSignIn: (tokens: AuthTokens) => Promise<void>;
  signOut: () => Promise<void>;
}

function userFromTokens(tokens: AuthTokens): AuthUser | null {
  const claims = decodeJwtPayload<CognitoIdTokenClaims>(tokens.idToken);
  if (!claims) return null;
  return {
    sub: claims.sub,
    email: claims.email ?? "",
    displayName: claims.name ?? claims.email ?? "IRhythm listener",
  };
}

export const useAuthStore = create<AuthState>((set, get) => ({
  status: "hydrating",
  tokens: null,
  user: null,

  hydrate: async () => {
    try {
      const raw = await SecureStore.getItemAsync(STORAGE_KEY);
      if (!raw) {
        set({ status: "signedOut" });
        return;
      }
      const tokens = JSON.parse(raw) as AuthTokens;
      const user = userFromTokens(tokens);
      if (!user) {
        set({ status: "signedOut" });
        return;
      }
      set({ status: "signedIn", tokens, user });
    } catch {
      set({ status: "signedOut" });
    }
  },

  completeSignIn: async (tokens: AuthTokens) => {
    const user = userFromTokens(tokens);
    await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(tokens));
    set({ status: "signedIn", tokens, user });
  },

  signOut: async () => {
    signOutLocalCognitoUser(get().user?.email);
    await SecureStore.deleteItemAsync(STORAGE_KEY);
    set({ status: "signedOut", tokens: null, user: null });
  },
}));

/** Non-reactive accessor for the current access token, used by the API client. */
export function getAccessToken(): string | null {
  return useAuthStore.getState().tokens?.accessToken ?? null;
}
