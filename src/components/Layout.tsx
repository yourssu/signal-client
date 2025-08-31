import { DevTools } from "@/components/DevTools";
import Background from "@/components/home/Background";
import { Toaster } from "@/components/ui/sonner";
import { MODE } from "@/env";
import { useAuth } from "@/hooks/useAuth";
import React from "react";
import { Outlet } from "react-router";

const Layout: React.FC = () => {
  useAuth();
  return (
    <div className="h-dvh min-h-dvh overflow-hidden">
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
