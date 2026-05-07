import { getDefaultStore } from "jotai";
import {
  accessTokenAtom,
  clearTokensAtom,
  refreshTokenAtom,
  setTokensAtom,
  tokenExpiryAtom,
} from "@/atoms/authTokens";
import { API_BASE_URL } from "@/env";
import { SignalError } from "@/lib/error";
import { ErrorResponse, SignalResponse } from "@/types/common";
import { TokenResponse } from "@/types/auth";

const store = getDefaultStore();

let refreshPromise: Promise<boolean> | null = null;

async function refreshAccessToken(): Promise<boolean> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const refreshToken = store.get(refreshTokenAtom);
      if (!refreshToken) return false;

      const tokenExpiry = store.get(tokenExpiryAtom);
      if (
        tokenExpiry.refreshTokenExpiresAt &&
        tokenExpiry.refreshTokenExpiresAt <= Date.now()
      ) {
        return false;
      }

      const response = await fetch(`${API_BASE_URL ?? ""}/api/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) return false;

      const res = (await response.json()) as SignalResponse<TokenResponse>;
      if (!("result" in res)) return false;

      const { accessToken, refreshToken: newRefresh } = res.result;
      if (!accessToken || !newRefresh) return false;

      store.set(setTokensAtom, { tokenResponse: res.result });
      return true;
    } catch {
      return false;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

async function fetchWithAuth<T>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  const accessToken = store.get(accessTokenAtom);

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      ...options.headers,
    },
  });

  if (response.status === 401) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      const newToken = store.get(accessTokenAtom);
      const retryResponse = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...(newToken && { Authorization: `Bearer ${newToken}` }),
          ...options.headers,
        },
      });

      if (
        retryResponse.headers
          .get("Content-Type")
          ?.includes("application/json") !== true
      ) {
        return undefined as T;
      }

      const retryRes = (await retryResponse.json()) as SignalResponse<T>;

      if (!("result" in retryRes) || retryResponse.status >= 400) {
        const errorRes = retryRes as ErrorResponse;
        throw new SignalError(
          errorRes.message ?? "알 수 없는 오류",
          errorRes.status ?? retryResponse.status,
          errorRes.timestamp ?? new Date().toISOString(),
        );
      }

      return retryRes.result;
    }

    store.set(clearTokensAtom);
    throw new SignalError(
      "인증이 만료되었습니다. 다시 로그인해주세요.",
      401,
      new Date().toISOString(),
    );
  }

  if (
    response.headers.get("Content-Type")?.includes("application/json") !== true
  ) {
    return undefined as T;
  }

  const res = (await response.json()) as SignalResponse<T>;

  if (!("result" in res) || response.status >= 400) {
    const errorRes = res as ErrorResponse;
    throw new SignalError(
      errorRes.message ?? "알 수 없는 오류",
      errorRes.status ?? response.status,
      errorRes.timestamp ?? new Date().toISOString(),
    );
  }

  return res.result;
}

export const authedFetch = fetchWithAuth;
