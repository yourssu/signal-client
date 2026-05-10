import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";
import { useRegister, useRefreshToken } from "@/hooks/queries/auth";
import {
  accessTokenAtom,
  clearTokensAtom,
  refreshTokenAtom,
  isAuthenticatedAtom,
  setTokensAtom,
  tokenExpiryAtom,
} from "@/atoms/authTokens";
import { TokenResponse } from "@/types/auth";
import { API_BASE_URL } from "@/env";

const MAX_REFRESH_RETRIES = 3;
const RETRY_DELAYS = [1000, 3000, 5000];

async function rawRefresh(refreshToken: string): Promise<TokenResponse | null> {
  try {
    const response = await fetch(`${API_BASE_URL ?? ""}/api/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) return null;

    const res = await response.json();
    if (!res.result?.accessToken || !res.result?.refreshToken) return null;
    return res.result as TokenResponse;
  } catch {
    return null;
  }
}

export const useAuth = () => {
  const accessToken = useAtomValue(accessTokenAtom);
  const refreshToken = useAtomValue(refreshTokenAtom);
  const isAuthenticated = useAtomValue(isAuthenticatedAtom);
  const setTokens = useSetAtom(setTokensAtom);
  const tokenExpiry = useAtomValue(tokenExpiryAtom);
  const clearTokens = useSetAtom(clearTokensAtom);
  const hasInitialized = useRef(false);

  const registerMutation = useRegister({
    onSuccess: (data: TokenResponse) => {
      setTokens({ tokenResponse: data, provider: "local" });
    },
    onError: (error) => {
      toast.error("회원가입 실패", { description: error.message });
    },
  });

  const refreshMutation = useRefreshToken({
    onSuccess: (data: TokenResponse) => {
      if (data.accessToken && data.refreshToken) {
        setTokens({ tokenResponse: data, provider: "local" });
      } else {
        toast.error("토큰 갱신 실패", {
          description:
            "토큰 정보를 받아오는 데 실패했습니다. 새로고침 해주세요.",
        });
      }
    },
    onError: () => {},
  });

  const tryRefreshWithRetry = useCallback(
    async (token: string): Promise<TokenResponse | null> => {
      const tokenExpiryData = tokenExpiry;
      if (
        tokenExpiryData.refreshTokenExpiresAt &&
        tokenExpiryData.refreshTokenExpiresAt <= Date.now()
      ) {
        return null;
      }

      for (let i = 0; i < MAX_REFRESH_RETRIES; i++) {
        const result = await rawRefresh(token);
        if (result) {
          setTokens({ tokenResponse: result, provider: "local" });
          return result;
        }
        if (i < MAX_REFRESH_RETRIES - 1) {
          await new Promise((r) => setTimeout(r, RETRY_DELAYS[i]));
        }
      }
      return null;
    },
    [tokenExpiry, setTokens],
  );

  const initializeAuth = useCallback(async () => {
    if (!accessToken && !refreshToken) {
      registerMutation.mutate();
      return;
    }

    if (!isAuthenticated && refreshToken) {
      const result = await tryRefreshWithRetry(refreshToken);
      if (!result) {
        clearTokens();
        registerMutation.mutate();
      }
    }
  }, [
    accessToken,
    refreshToken,
    isAuthenticated,
    registerMutation,
    tryRefreshWithRetry,
    clearTokens,
  ]);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;
    initializeAuth();
  }, [initializeAuth]);

  return {
    accessToken,
    refreshToken,
    isAuthenticated,
    tokenExpiry,

    isRegistering: registerMutation.isPending,
    isRefreshing: refreshMutation.isPending,
    registerError: registerMutation.error,
    refreshError: refreshMutation.error,
    clearTokens,
  };
};
