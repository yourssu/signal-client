import { DevTools } from "@/components/DevTools";
import Background from "@/components/home/Background";
import { Toaster } from "@/components/ui/sonner";
import { MODE } from "@/env";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useAuth } from "@/hooks/useAuth";
import { useExpiredDataCheck } from "@/hooks/useExpiredDataCheck";
import React from "react";
import { Outlet, useLocation } from "react-router";

const Layout: React.FC = () => {
  useAnalytics();
  useAuth();
  useExpiredDataCheck();
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <div className="h-dvh min-h-dvh overflow-hidden tracking-tight">
      {isHome && <Background />}
      <main className={`max-w-md mx-auto w-full h-full shadow-sm overflow-auto ${!isHome ? "bg-(--background)" : ""}`}>
        <Outlet />
        <Toaster theme="light" richColors position="top-center" />
        {MODE !== "production" && <DevTools />}
      </main>
    </div>
  );
};

export default Layout;
