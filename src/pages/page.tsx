import React from "react";
import { useNavigate } from "react-router";

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="mb-8">
        {/* Placeholder for animal character illustration */}
        <div className="w-64 h-64 bg-gray-200 rounded-full flex items-center justify-center">
          <span className="text-gray-500">Animal Character</span>
        </div>
      </div>

      <div className="space-y-4 w-full max-w-xs">
        <button
          onClick={() => navigate("/profile/register")}
          className="w-full py-3 px-6 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          프로필 등록하기
        </button>

        <button
          onClick={() => navigate("/verify")}
          className="w-full py-3 px-6 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          프로필 조회하기
        </button>
      </div>
    </div>
  );
};

export default HomePage;
