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

/**
 * 갱신 결과. "rejected"만 세션이 끝난 것이고, "unavailable"은 서버에 못 닿았을 뿐이라
 * 토큰을 지우면 안 된다. 둘을 같이 취급하면 서버가 잠깐 흔들릴 때 계정을 잃는다(#9).
 */
export type RefreshOutcome = "ok" | "rejected" | "unavailable" | "none";

let refreshPromise: Promise<RefreshOutcome> | null = null;

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** 동시에 여러 요청이 401을 받아도 갱신은 한 번만 나간다. */
export async function refreshAccessToken(): Promise<RefreshOutcome> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const refreshToken = store.get(refreshTokenAtom);
      if (!refreshToken) return "none";

      const tokenExpiry = store.get(tokenExpiryAtom);
      if (
        tokenExpiry.refreshTokenExpiresAt &&
        tokenExpiry.refreshTokenExpiresAt <= Date.now()
      ) {
        return "rejected";
      }

      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          const response = await fetch(
            `${API_BASE_URL ?? ""}/api/auth/refresh`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ refreshToken }),
            },
          );

          // 서버가 토큰을 보고 거절한 것은 다시 물어도 같은 답이다.
          if (response.status === 401 || response.status === 403) {
            return "rejected";
          }
          if (!response.ok) {
            if (attempt < 2) {
              await wait(1000 * (attempt + 1));
              continue;
            }
            return "unavailable";
          }

          const res = (await response.json()) as SignalResponse<TokenResponse>;
          if (
            !("result" in res) ||
            !res.result.accessToken ||
            !res.result.refreshToken
          ) {
            if (attempt < 2) continue;
            return "unavailable";
          }

          store.set(setTokensAtom, { tokenResponse: res.result });
          return "ok";
        } catch {
          if (attempt < 2) {
            await wait(1000 * (attempt + 1));
            continue;
          }
          return "unavailable";
        }
      }
      return "unavailable";
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
    const outcome = await refreshAccessToken();
    if (outcome === "ok") {
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
        // 204처럼 본문이 없는 성공만 통과시킨다. 에러 페이지(HTML)나 빈 5xx가
        // 여기로 새면 호출부가 undefined를 정상 응답으로 받는다.
        if (!retryResponse.ok) {
          throw new SignalError(
            "알 수 없는 오류",
            retryResponse.status,
            new Date().toISOString(),
          );
        }
        return undefined as T;
      }

      const retryRes = (await retryResponse.json()) as SignalResponse<T>;

      if (!("result" in retryRes) || retryResponse.status >= 400) {
        const errorRes = retryRes as ErrorResponse;
        throw new SignalError(
          errorRes.message ?? "알 수 없는 오류",
          errorRes.status ?? retryResponse.status,
          errorRes.timestamp ?? new Date().toISOString(),
          errorRes.code,
        );
      }

      return retryRes.result;
    }

    // 못 닿은 것뿐이면 토큰을 남겨 다음 요청이 다시 시도하게 한다.
    if (outcome === "unavailable") {
      throw new SignalError(
        "서버에 연결할 수 없어요. 잠시 후 다시 시도해주세요.",
        503,
        new Date().toISOString(),
      );
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
    if (!response.ok) {
      throw new SignalError(
        "알 수 없는 오류",
        response.status,
        new Date().toISOString(),
      );
    }
    return undefined as T;
  }

  const res = (await response.json()) as SignalResponse<T>;

  if (!("result" in res) || response.status >= 400) {
    const errorRes = res as ErrorResponse;
    throw new SignalError(
      errorRes.message ?? "알 수 없는 오류",
      errorRes.status ?? response.status,
      errorRes.timestamp ?? new Date().toISOString(),
      errorRes.code,
    );
  }

  return res.result;
}

export const authedFetch = fetchWithAuth;
