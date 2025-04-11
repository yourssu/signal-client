import React from "react";
import { Outlet } from "react-router";

const Layout: React.FC = () => {
  return (
    <div className="min-h-dvh bg-pink-50">
      <main className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-sm">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
