import { DevTools } from "@/components/DevTools";
import Background from "@/components/home/Background";
import { Toaster } from "@/components/ui/sonner";
import { MODE } from "@/env";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useAuth } from "@/hooks/useAuth";
import { useExpiredDataCheck } from "@/hooks/useExpiredDataCheck";
import { sessionEndedAtom } from "@/atoms/authTokens";
import { ServiceDisabledDialog } from "@/components/home/ServiceDisabledDialog";
import { LoginDrawer } from "@/components/LoginDrawer";
import { useAtom } from "jotai";
import React, { useState } from "react";
import { Outlet, useLocation } from "react-router";

const Layout: React.FC = () => {
  useAnalytics();
  const { restartSession } = useAuth();
  useExpiredDataCheck();
  const location = useLocation();
  const isHome = location.pathname === "/";

  // 세션이 끝나면 화면을 막고 사용자가 고르게 한다. 토스트로는 사라진 뒤 왜 안 되는지 알 수 없었다.
  const [sessionEnded, setSessionEnded] = useAtom(sessionEndedAtom);
  const [loginOpen, setLoginOpen] = useState(false);
  const isGoogle = sessionEnded === "google";

  return (
    <div className="h-dvh min-h-dvh overflow-hidden tracking-tight">
      {isHome && <Background />}
      <main
        className={`max-w-md mx-auto w-full h-full shadow-sm overflow-auto ${!isHome ? "bg-(--background)" : ""}`}
      >
        <Outlet />
        <Toaster theme="light" richColors position="top-center" />
        <ServiceDisabledDialog
          open={sessionEnded !== null}
          onOpenChange={() => {}}
          blocking
          title="세션이 끝났어요"
          content={
            isGoogle
              ? "다시 로그인하면 원래 계정으로 이어서 쓸 수 있어요."
              : "연결이 끊겨 새로 시작해야 해요. 지금 화면은 최신이 아닐 수 있어요."
          }
          confirmLabel={isGoogle ? "다시 로그인" : "다시 시작하기"}
          onConfirm={() => {
            if (isGoogle) {
              setSessionEnded(null);
              setLoginOpen(true);
              return;
            }
            restartSession();
          }}
        />
        <LoginDrawer open={loginOpen} onOpenChange={setLoginOpen} />
        {MODE !== "production" && <DevTools />}
      </main>
    </div>
  );
};

export default Layout;
