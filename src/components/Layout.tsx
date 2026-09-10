import { DevTools } from "@/components/DevTools";
import Background from "@/components/home/Background";
import { Toaster } from "@/components/ui/sonner";
import { MODE } from "@/env";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useAuth } from "@/hooks/useAuth";
import { useExpiredDataCheck } from "@/hooks/useExpiredDataCheck";
import { accessTokenAtom, sessionEndedAtom } from "@/atoms/authTokens";
import { ServiceDisabledDialog } from "@/components/home/ServiceDisabledDialog";
import { LoginDrawer } from "@/components/LoginDrawer";
import { useAtomValue } from "jotai";
import React, { useState } from "react";
import { Outlet, useLocation } from "react-router";

const Layout: React.FC = () => {
  useAnalytics();
  const { restartSession, isRestarting } = useAuth();
  useExpiredDataCheck();
  const location = useLocation();
  const isHome = location.pathname === "/";

  const sessionEnded = useAtomValue(sessionEndedAtom);
  const accessToken = useAtomValue(accessTokenAtom);
  const [loginOpen, setLoginOpen] = useState(false);
  const isGoogle = sessionEnded === "google";
  // 토큰이 돌아와야 닫힌다. 드로어가 열려 있는 동안만 비켜 주고, 드로어를 닫으면 다시 뜬다.
  const isSessionDialogOpen =
    sessionEnded !== null && !accessToken && !loginOpen;

  return (
    <div className="h-dvh min-h-dvh overflow-hidden tracking-tight">
      {isHome && <Background />}
      <main
        className={`max-w-md mx-auto w-full h-full shadow-sm overflow-auto ${!isHome ? "bg-(--background)" : ""}`}
      >
        <Outlet />
        <Toaster theme="light" richColors position="top-center" />
        <ServiceDisabledDialog
          open={isSessionDialogOpen}
          onOpenChange={() => {}}
          blocking
          title="세션이 끝났어요"
          content={
            isGoogle
              ? "다시 로그인하면 원래 계정으로 이어서 쓸 수 있어요."
              : "로그인 정보가 만료돼 새로 시작해야 해요. 진행 중이던 내용은 이어지지 않아요."
          }
          confirmLabel={isGoogle ? "다시 로그인하기" : "다시 시작하기"}
          confirmDisabled={isRestarting}
          onConfirm={isGoogle ? () => setLoginOpen(true) : restartSession}
        />
        <LoginDrawer open={loginOpen} onOpenChange={setLoginOpen} />
        {MODE !== "production" && <DevTools />}
      </main>
    </div>
  );
};

export default Layout;
