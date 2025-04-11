import React from "react";
import { useNavigate } from "react-router";

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="text-center space-y-4">
      <h1 className="text-2xl font-bold text-pink-600 md:text-3xl">
        404 - Page Not Found
      </h1>
      <p className="text-gray-600">
        Oops! The page you are looking for does not exist.
      </p>
      <button
        onClick={() => navigate("/")}
        className="px-6 py-2 bg-pink-500 text-white rounded-full 
                 transition-colors duration-200 hover:bg-pink-600 
                 focus:outline-none focus:ring-2 focus:ring-pink-400 
                 focus:ring-offset-2 text-sm md:text-base"
      >
        Go to Home
      </button>
    </div>
  );
};

export default NotFound;
