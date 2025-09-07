import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import {
  TokenResponse,
  RefreshTokenRequest,
  GoogleOAuthRequest,
} from "@/types/auth";
import { SignalResponse } from "@/types/common";
import { SignalError } from "@/lib/error";
import { API_BASE_URL } from "@/env";
import { authedFetch } from "@/lib/fetch";

const authBase = `${API_BASE_URL ?? ""}/api/auth`;

export const useRegister = (
  mutationOptions?: Omit<
    UseMutationOptions<TokenResponse, SignalError, void>,
    "mutationFn"
  >,
) => {
  return useMutation({
    mutationFn: async () => {
      const response = await fetch(`${authBase}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const res = (await response.json()) as SignalResponse<TokenResponse>;
      if (!("result" in res)) {
        throw new SignalError(res.message, res.status, res.timestamp);
      } else {
        return res.result;
      }
    },
    ...mutationOptions,
  });
};

export const useRefreshToken = (
  mutationOptions?: Omit<
    UseMutationOptions<TokenResponse, SignalError, RefreshTokenRequest>,
    "mutationFn"
  >,
) => {
  return useMutation({
    mutationFn: async (data: RefreshTokenRequest) => {
      const response = await fetch(`${authBase}/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const res = (await response.json()) as SignalResponse<TokenResponse>;
      if (!("result" in res)) {
        throw new SignalError(res.message, res.status, res.timestamp);
      } else {
        return res.result;
      }
    },
    ...mutationOptions,
  });
};

export const useGoogleLogin = (
  mutationOptions?: Omit<
    UseMutationOptions<TokenResponse, SignalError, GoogleOAuthRequest>,
    "mutationFn"
  >,
) => {
  return useMutation({
    mutationFn: async (data: GoogleOAuthRequest) => {
      return await authedFetch<TokenResponse>(`${authBase}/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
    },
    ...mutationOptions,
  });
};
