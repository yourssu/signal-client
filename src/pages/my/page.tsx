import React from "react";
import { useNavigate } from "react-router";
import TopBar from "@/components/Header";

const MyPage: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // Go back one step in browser history
  };

  return (
    <div className="w-full h-full flex flex-col items-center">
      <TopBar onBack={handleBack} />
      <div className="flex flex-col gap-4 items-center w-full max-w-md grow p-6">
        <div className="flex flex-col items-start w-full">
          <h1 className="text-2xl font-semibold text-stone-700">마이페이지</h1>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
