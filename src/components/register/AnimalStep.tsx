import { AnimalType } from "@/types/profile";
import React from "react";

interface AnimalStepProps {
  onSelect: (animal: AnimalType) => void;
}

const AnimalStep: React.FC<AnimalStepProps> = ({ onSelect }) => {
  const animals: { type: AnimalType; label: string }[] = [
    { type: "DOG", label: "강아지" },
    { type: "BEAR", label: "곰" },
    { type: "DINOSAUR", label: "공룡" },
    { type: "WOLF", label: "늑대" },
    { type: "DEER", label: "사슴" },
    { type: "CAT", label: "고양이" },
  ];

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-6">
        나와 어울리는 동물상을 선택해주세요
      </h2>
      <div className="grid grid-cols-2 gap-4 w-full max-w-md">
        {animals.map(({ type, label }) => (
          <button
            key={type}
            onClick={() => onSelect(type)}
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 
                     transition-colors flex flex-col items-center justify-center"
          >
            <div className="w-16 h-16 bg-gray-100 rounded-full mb-2 flex items-center justify-center">
              {/* Placeholder for animal icon */}
              <span className="text-2xl">{label[0]}</span>
            </div>
            <span className="font-medium">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default AnimalStep;
