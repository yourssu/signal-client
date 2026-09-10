import { getDefaultStore, useAtomValue, useSetAtom } from "jotai";
import { useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useRegister } from "@/hooks/queries/auth";
import {
  accessTokenAtom,
  refreshTokenAtom,
  isAuthenticatedAtom,
  setTokensAtom,
} from "@/atoms/authTokens";
import { TokenResponse } from "@/types/auth";
import { endSession, refreshAccessToken } from "@/lib/fetch";

/** 앱에 하나만 있어야 한다. Layout에서만 부른다. */
export const useAuth = () => {
  const accessToken = useAtomValue(accessTokenAtom);
  const refreshToken = useAtomValue(refreshTokenAtom);
  const isAuthenticated = useAtomValue(isAuthenticatedAtom);
  const setTokens = useSetAtom(setTokensAtom);
  const navigate = useNavigate();
  const hasInitialized = useRef(false);

  const registerMutation = useRegister({
    onSuccess: (data: TokenResponse) => {
      // 등록을 기다리는 사이 구글 로그인이 먼저 토큰을 넣었을 수 있다.
      // 늦게 온 익명 토큰이 그걸 덮으면 로그인한 계정을 잃는다.
      if (getDefaultStore().get(accessTokenAtom)) return;
      setTokens({ tokenResponse: data, provider: "local" });
    },
    onError: (error) => {
      toast.error("회원가입 실패", { description: error.message });
    },
  });

  const initializeAuth = useCallback(async () => {
    // 토큰이 아예 없을 때만 새 계정이다. 있던 계정이 갱신에 실패했다고 새로 만들면
    // 그 계정에 묶인 티켓과 내역을 잃는다(#9).
    if (!accessToken && !refreshToken) {
      registerMutation.mutate();
      return;
    }

    if (isAuthenticated || !refreshToken) return;

    // 거절이면 세션은 끝났다. 다음 로드에서 처음부터 시작한다.
    if ((await refreshAccessToken()) === "rejected") endSession();
  }, [accessToken, refreshToken, isAuthenticated, registerMutation]);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;
    initializeAuth();
  }, [initializeAuth]);

  // 세션이 끝난 뒤 사용자가 눌러서 새 익명 계정으로 시작한다. 자동으로 만들지 않는다(#9).
  // 새 계정으로 바뀐 채 결제 퍼널 같은 화면에 남아 있으면 이전 계정 기준으로 판정이 나므로 홈으로 보낸다.
  const { mutate: register, isPending: isRestarting } = registerMutation;
  const restartSession = useCallback(() => {
    register(undefined, { onSuccess: () => navigate("/", { replace: true }) });
  }, [register, navigate]);

  return { restartSession, isRestarting };
};
