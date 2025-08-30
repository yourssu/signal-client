import { useAtom } from "jotai";
import { useEffect, useCallback } from "react";
import { toast } from "sonner";
import { useRegister, useRefreshToken } from "@/hooks/queries/auth";
import {
  accessTokenAtom,
  refreshTokenAtom,
  isAuthenticatedAtom,
  setTokensAtom,
  tokenExpiryAtom,
} from "@/atoms/authTokens";
import { TokenResponse } from "@/types/auth";

export const useAuth = () => {
  const [accessToken] = useAtom(accessTokenAtom);
  const [refreshToken] = useAtom(refreshTokenAtom);
  const [isAuthenticated] = useAtom(isAuthenticatedAtom);
  const [, setTokens] = useAtom(setTokensAtom);
  const [tokenExpiry] = useAtom(tokenExpiryAtom);

  const registerMutation = useRegister({
    onSuccess: (data: TokenResponse) => {
      setTokens(data);
    },
    onError: (error) => {
      toast.error(`회원가입 실패: ${error.message}`);
    },
  });

  const refreshMutation = useRefreshToken({
    onSuccess: (data: TokenResponse) => {
      setTokens(data);
    },
    onError: () => {
      // If refresh fails, try to register
      registerMutation.mutate();
    },
  });

  const tryRefreshToken = useCallback(async () => {
    if (!refreshToken) {
      return false;
    }

    // Check if refresh token is expired
    const now = Date.now();
    if (
      tokenExpiry.refreshTokenExpiresAt &&
      tokenExpiry.refreshTokenExpiresAt <= now
    ) {
      return false;
    }

    try {
      await refreshMutation.mutateAsync({ refreshToken });
      return true;
    } catch {
      return false;
    }
  }, [refreshToken, refreshMutation, tokenExpiry.refreshTokenExpiresAt]);

  const initializeAuth = useCallback(async () => {
    // If no tokens exist, register automatically
    if (!accessToken && !refreshToken) {
      registerMutation.mutate();
      return;
    }

    // If tokens exist but not authenticated (expired access token), try refresh
    if (!isAuthenticated && refreshToken) {
      const refreshSuccess = await tryRefreshToken();
      if (!refreshSuccess) {
        // If refresh failed, register new account
        registerMutation.mutate();
      }
    }
  }, [
    accessToken,
    refreshToken,
    isAuthenticated,
    registerMutation,
    tryRefreshToken,
  ]);

  // Auto-register or auto-refresh on mount
  useEffect(() => {
    initializeAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  return {
    // State
    accessToken,
    refreshToken,
    isAuthenticated,
    tokenExpiry,

    // Mutation states
    isRegistering: registerMutation.isPending,
    isRefreshing: refreshMutation.isPending,
    registerError: registerMutation.error,
    refreshError: refreshMutation.error,
  };
};
