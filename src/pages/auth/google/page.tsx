import { useEffect, useRef } from "react";
import { useSearchParams, Navigate } from "react-router";
import { useSetAtom } from "jotai";
import { useGoogleLogin } from "@/hooks/queries/auth";
import { setTokensAtom } from "@/atoms/authTokens";
import ReactGA4 from "react-ga4";
import { GA_ID } from "@/env";
import { toast } from "sonner";
import { useUserRefresh } from "@/hooks/useUserRefresh";

export default function GoogleAuthPage() {
  const [searchParams] = useSearchParams();
  const setTokens = useSetAtom(setTokensAtom);
  const loginRequested = useRef(false);
  const { refreshUser, isRefreshed } = useUserRefresh();

  const { mutate, isSuccess, isIdle, isError } = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      setTokens({ tokenResponse, provider: "google" });
      if (GA_ID) {
        ReactGA4.event("login", {
          method: "구글",
        });
      }
      refreshUser();
    },
    onError: (error) => {
      toast.error("Google 로그인 실패", { description: error.message });
      if (GA_ID) {
        ReactGA4.event("login_error", {
          method: "구글",
          error: error.message,
        });
      }
    },
  });

  useEffect(() => {
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error) {
      toast.error("Google OAuth 에러", { description: error });
      if (GA_ID) {
        ReactGA4.event("oauth_error", {
          provider: "구글",
          error: error,
        });
      }
      return;
    }

    if (code && isIdle && !loginRequested.current) {
      loginRequested.current = true;
      mutate({ code });
    }
  }, [isIdle, mutate, searchParams]);

  // 성공적으로 로그인되면 마이페이지로 리디렉션
  if (isSuccess && isRefreshed) {
    return <Navigate to="/my" replace />;
  }

  // 에러가 발생하면 홈페이지로 리디렉션
  if (isError) {
    return <Navigate to="/" replace />;
  }

  // 로딩 중이거나 처리 중일 때 로딩 화면
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center p-4">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-600 text-center">
          구글 로그인 중...
          <br />
          잠시만 기다려주세요
        </p>
      </div>
    </div>
  );
}
