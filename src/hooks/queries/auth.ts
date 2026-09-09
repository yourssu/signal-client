import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { TokenResponse, GoogleOAuthRequest } from "@/types/auth";
import { SignalResponse } from "@/types/common";
import { SignalError } from "@/lib/error";
import { API_BASE_URL } from "@/env";

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
        throw new SignalError(res.message, res.status, res.timestamp, res.code);
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
    // 토큰을 받으러 가는 요청이라 인증이 필요 없다. authedFetch를 타면 익명 Bearer를
    // 달고 나가고, 401이면 갱신→삭제 경로로 들어가 로그인 중에 토큰이 지워진다.
    mutationFn: async (data: GoogleOAuthRequest) => {
      const response = await fetch(`${authBase}/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const res = (await response.json()) as SignalResponse<TokenResponse>;
      if (!("result" in res)) {
        throw new SignalError(res.message, res.status, res.timestamp, res.code);
      }
      return res.result;
    },
    ...mutationOptions,
  });
};
