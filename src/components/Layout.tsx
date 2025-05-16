import { DevTools } from "@/components/DevTools";
import Background from "@/components/home/Background";
import { Toaster } from "@/components/ui/sonner";
import { MODE } from "@/env";
import React from "react";
import { Outlet } from "react-router";

const Layout: React.FC = () => {
  return (
    <div className="h-dvh min-h-dvh overflow-hidden">
      <Background />
      <main className="max-w-md mx-auto w-full h-full shadow-sm overflow-auto">
        <Outlet />
        <Toaster />
        {MODE !== "production" && <DevTools />}
      </main>
    </div>
  );
};

export default Layout;
