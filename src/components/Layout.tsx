import React from "react";
import { Outlet } from "react-router";

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-pink-50">
      <nav className="bg-gradient-to-r from-pink-400 to-pink-500 shadow-md"></nav>
      <main className="max-w-md mx-auto p-4 md:p-6">
        <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
