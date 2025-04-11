import React from "react";
import { Link, Outlet } from "react-router";

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-pink-50">
      <nav className="bg-gradient-to-r from-pink-400 to-pink-500 shadow-md">
        <div className="max-w-md mx-auto px-4 py-3 md:py-4">
          <div className="flex justify-center space-x-6 text-white">
            <Link
              to="/"
              className="text-sm font-medium transition-colors duration-200 hover:text-pink-100 md:text-base"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="text-sm font-medium transition-colors duration-200 hover:text-pink-100 md:text-base"
            >
              About
            </Link>
          </div>
        </div>
      </nav>
      <main className="max-w-md mx-auto p-4 md:p-6">
        <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
