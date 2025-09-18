import { DevTools } from "@/components/DevTools";
import Background from "@/components/home/Background";
import { Toaster } from "@/components/ui/sonner";
import { MODE } from "@/env";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useAuth } from "@/hooks/useAuth";
import { useExpiredDataCheck } from "@/hooks/useExpiredDataCheck";
import React from "react";
import { Outlet } from "react-router";

const Layout: React.FC = () => {
  useAnalytics();
  useAuth();
  useExpiredDataCheck();
  return (
    <div className="h-dvh min-h-dvh overflow-hidden tracking-tight">
      <Background />
      <main className="max-w-md mx-auto w-full h-full shadow-sm overflow-auto">
        <Outlet />
        <Toaster theme="light" richColors position="top-center" />
        {MODE !== "production" && <DevTools />}
      </main>
    </div>
  );
};

export default Layout;
