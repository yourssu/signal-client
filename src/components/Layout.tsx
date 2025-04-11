import React from "react";
import { Outlet } from "react-router";

const Layout: React.FC = () => {
  return (
    <div className="h-dvh min-h-dvh bg-background">
      <main className="max-w-md mx-auto w-full h-full bg-background shadow-sm">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
