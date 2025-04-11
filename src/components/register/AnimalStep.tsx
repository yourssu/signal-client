import { Button } from "@/components/ui/button";
import { AnimalType } from "@/types/profile";
import React from "react";

interface AnimalStepProps {
  onSelect: (animal: AnimalType) => void;
}

const AnimalStep: React.FC<AnimalStepProps> = ({ onSelect }) => {
  const animals: { type: AnimalType; label: string; name: string }[] = [
    { type: "DOG", label: "🐶", name: "강아지" },
    { type: "BEAR", label: "🐻", name: "곰" },
    { type: "DINOSAUR", label: "🦖", name: "공룡" },
    { type: "WOLF", label: "🐺", name: "늑대" },
    { type: "DEER", label: "🦌", name: "사슴" },
    { type: "CAT", label: "😸", name: "고양이" },
  ];

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6">
        자신을 나타내는 동물을 골라주세요.
      </h1>
      <div className="grid grid-cols-2 gap-4 w-full max-w-md">
        {animals.map(({ type, label, name }) => (
          <Button
            key={type}
            onClick={() => onSelect(type)}
            size="card"
            className="flex flex-col items-center justify-center shadow-md bg-background text-foreground "
          >
            <div className="text-7xl">{label}</div>
            <span className="font-medium">{name}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default AnimalStep;
