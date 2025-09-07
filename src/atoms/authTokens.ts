import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { TokenResponse } from "@/types/auth";

// Storage atoms that persist to localStorage
export const accessTokenAtom = atomWithStorage<string | null>(
  "auth.accessToken",
  null,
  undefined,
  { getOnInit: true },
);
export const refreshTokenAtom = atomWithStorage<string | null>(
  "auth.refreshToken",
  null,
  undefined,
  { getOnInit: true },
);

// Provider atom to track authentication method
export const providerAtom = atomWithStorage<"google" | "local" | null>(
  "auth.provider",
  null,
  undefined,
  { getOnInit: true },
);

// Derived atom for token expiry times
export const tokenExpiryAtom = atomWithStorage<{
  accessTokenExpiresAt: number | null;
  refreshTokenExpiresAt: number | null;
}>(
  "auth.tokenExpiry",
  {
    accessTokenExpiresAt: null,
    refreshTokenExpiresAt: null,
  },
  undefined,
  { getOnInit: true },
);

// Computed atom to check if tokens are valid
export const isAuthenticatedAtom = atom((get) => {
  const accessToken = get(accessTokenAtom);
  const tokenExpiry = get(tokenExpiryAtom);

  if (!accessToken || !tokenExpiry.accessTokenExpiresAt) {
    return false;
  }

  // Check if access token is still valid (with 30 second buffer)
  const now = Date.now();
  return tokenExpiry.accessTokenExpiresAt > now + 30000;
});

// Action atom to set all tokens at once
export const setTokensAtom = atom(
  null,
  (
    _get,
    set,
    params: { tokenResponse: TokenResponse; provider?: "google" | "local" },
  ) => {
    const now = Date.now();

    set(accessTokenAtom, params.tokenResponse.accessToken);
    set(refreshTokenAtom, params.tokenResponse.refreshToken);
    set(tokenExpiryAtom, {
      accessTokenExpiresAt: now + params.tokenResponse.accessTokenExpiresIn,
      refreshTokenExpiresAt: now + params.tokenResponse.refreshTokenExpiresIn,
    });
    set(providerAtom, params.provider || "local");
  },
);

// Action atom to clear all tokens
export const clearTokensAtom = atom(null, (_get, set) => {
  set(accessTokenAtom, null);
  set(refreshTokenAtom, null);
  set(tokenExpiryAtom, {
    accessTokenExpiresAt: null,
    refreshTokenExpiresAt: null,
  });
  set(providerAtom, null);
});
