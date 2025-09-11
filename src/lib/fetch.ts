import { getDefaultStore } from "jotai";
import { accessTokenAtom } from "@/atoms/authTokens";
import { SignalError } from "@/lib/error";
import { SignalResponse } from "@/types/common";

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

  if (!("result" in res)) {
    throw new SignalError(res.message, res.status, res.timestamp);
  }

  return res.result;
};
