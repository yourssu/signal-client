import Background from "@/components/home/Background";
import React from "react";
import { Outlet } from "react-router";

const Layout: React.FC = () => {
  return (
    <div className="h-dvh min-h-dvh">
      <Background />
      <main className="max-w-md mx-auto w-full h-full shadow-sm">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
