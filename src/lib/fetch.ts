import { getDefaultStore } from "jotai";
import { accessTokenAtom } from "@/atoms/authTokens";
import { SignalError } from "@/lib/error";
import { ErrorResponse, SignalResponse } from "@/types/common";

const store = getDefaultStore();

/**
 * Authenticated fetch client that uses accessTokenAtom for authorization
 */
export const authedFetch = async <T>(
  url: string,
  options: RequestInit = {},
): Promise<T> => {
  const accessToken = store.get(accessTokenAtom);

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      ...options.headers,
    },
  });

  // Assume no content if the content type is not JSON
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
};
