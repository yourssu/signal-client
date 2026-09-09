import { getDefaultStore } from "jotai";
import {
  accessTokenAtom,
  clearTokensAtom,
  providerAtom,
  refreshTokenAtom,
  setTokensAtom,
} from "@/atoms/authTokens";
import { toast } from "sonner";
import { API_BASE_URL } from "@/env";
import { SignalError } from "@/lib/error";
import { ErrorResponse, SignalResponse } from "@/types/common";
import { TokenResponse } from "@/types/auth";

const store = getDefaultStore();

/**
 * 갱신 결과. "rejected"만 세션이 끝난 것이고, "unavailable"은 서버에 못 닿았을 뿐이라
 * 토큰을 지우면 안 된다. 둘을 같이 취급하면 서버가 잠깐 흔들릴 때 계정을 잃는다(#9).
 * "none"은 갱신할 토큰 자체가 없는 경우다.
 */
export type RefreshOutcome = "ok" | "rejected" | "unavailable" | "none";

/**
 * 세션을 끝낸다. 지우기 전에 provider를 읽어야 누구에게 무슨 말을 할지 안다.
 * 401을 받은 요청마다 불리므로, 이미 끝난 세션이면 다시 지우거나 알리지 않는다.
 */
export function endSession() {
  if (!store.get(accessTokenAtom) && !store.get(refreshTokenAtom)) return;
  const provider = store.get(providerAtom);
  store.set(clearTokensAtom);
  toast.error("세션이 만료됐어요", {
    id: "auth-session-ended",
    description:
      provider === "google"
        ? "다시 로그인해주세요."
        : "새로고침하면 다시 시작할 수 있어요.",
  });
}

let refreshPromise: Promise<RefreshOutcome> | null = null;

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** 동시에 여러 요청이 401을 받아도 갱신은 한 번만 나간다. */
export async function refreshAccessToken(): Promise<RefreshOutcome> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const refreshToken = store.get(refreshTokenAtom);
      if (!refreshToken) return "none";

      // 갱신하는 사이 구글 로그인이 세션을 바꿨을 수 있다. 그 결과로 새 세션을 덮거나
      // 지우면 안 되므로, 답을 내기 전에 아직 같은 세션인지 본다.
      const isSameSession = () => store.get(refreshTokenAtom) === refreshToken;

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

          // 서버가 토큰을 보고 거절한 것은 다시 물어도 같은 답이다. 403은 WAF나 CDN도
          // 주므로 토큰 거절로 보지 않는다. 확인된 건 401뿐이다.
          if (response.status === 401) {
            return isSameSession() ? "rejected" : "ok";
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

          if (isSameSession()) {
            store.set(setTokensAtom, { tokenResponse: res.result });
          }
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

    endSession();
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
