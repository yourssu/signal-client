import { Gender } from "@/types/profile";
import React from "react";

interface GenderStepProps {
  onSelect: (gender: Gender) => void;
}

const GenderStep: React.FC<GenderStepProps> = ({ onSelect }) => {
  return (
    <div className="flex flex-col items-center space-y-4">
      <h2 className="text-2xl font-bold mb-6">성별을 선택해주세요</h2>
      <div className="space-y-4 w-full max-w-xs">
        <button
          onClick={() => onSelect("MALE")}
          className="w-full py-3 px-6 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          남성
        </button>
        <button
          onClick={() => onSelect("FEMALE")}
          className="w-full py-3 px-6 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
        >
          여성
        </button>
      </div>
    </div>
  );
};

export default GenderStep;
