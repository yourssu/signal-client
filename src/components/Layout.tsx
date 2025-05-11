import { DevTools } from "@/components/DevTools";
import Background from "@/components/home/Background";
import React from "react";
import { Outlet } from "react-router";

const Layout: React.FC = () => {
  return (
    <div className="h-dvh min-h-dvh overflow-hidden">
      <Background />
      <main className="max-w-md mx-auto w-full h-full shadow-sm">
        <Outlet />
        {import.meta.env.MODE !== "production" && <DevTools />}
      </main>
    </div>
  );
};

export default Layout;
