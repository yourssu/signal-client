import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { TokenResponse, GoogleOAuthRequest } from "@/types/auth";
import { SignalResponse } from "@/types/common";
import { SignalError } from "@/lib/error";
import { API_BASE_URL } from "@/env";
import { getDefaultStore } from "jotai";
import { accessTokenAtom } from "@/atoms/authTokens";

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
    // 요청 본문은 code뿐이라, 지금 익명 계정에 구글을 묶으려면 서버가 Bearer로 누군지
    // 알아야 한다(464848c). 다만 authedFetch를 타면 401에 갱신→삭제 경로로 들어가
    // 로그인 중에 토큰이 지워지므로, Bearer만 직접 달아 보낸다.
    mutationFn: async (data: GoogleOAuthRequest) => {
      const accessToken = getDefaultStore().get(accessTokenAtom);
      const response = await fetch(`${authBase}/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        },
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
