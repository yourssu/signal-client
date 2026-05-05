import { Button } from "@/components/ui/button";
import { AnimalType, Gender } from "@/types/profile";
import React, { useState } from "react";
import CharacterCard from "@/components/profile/CharacterCard";
import { animalDisplayMap } from "@/lib/animal";

import bearMaleImg from "@/assets/animals/male/bear.png";
import deerMaleImg from "@/assets/animals/male/Deer.png";
import dinosaurMaleImg from "@/assets/animals/male/Dinosaur.png";
import foxFemaleImg from "@/assets/animals/female/fox.png";
import rabbitFemaleImg from "@/assets/animals/female/rabbit.png";
import turtleFemaleImg from "@/assets/animals/female/turtle.png";
import dogCommonImg from "@/assets/animals/common/dog.png";
import catCommonImg from "@/assets/animals/common/cat.png";
import hamsterCommonImg from "@/assets/animals/common/hamster.png";

interface AnimalStepProps {
  gender: Gender;
  animal?: AnimalType;
  onSelect: (animal: AnimalType) => void;
}

const genderAnimals: Record<
  Gender,
  { type: AnimalType; img: string }[]
> = {
  MALE: [
    { type: "BEAR", img: bearMaleImg },
    { type: "DEER", img: deerMaleImg },
    { type: "DINOSAUR", img: dinosaurMaleImg },
  ],
  FEMALE: [
    { type: "FOX", img: foxFemaleImg },
    { type: "RABBIT", img: rabbitFemaleImg },
    { type: "TURTLE", img: turtleFemaleImg },
  ],
};

const commonAnimals: { type: AnimalType; img: string }[] = [
  { type: "DOG", img: dogCommonImg },
  { type: "CAT", img: catCommonImg },
  { type: "HAMSTER", img: hamsterCommonImg },
];

const AnimalStep: React.FC<AnimalStepProps> = ({
  gender,
  animal,
  onSelect,
}) => {
  const [selectedAnimal, setSelectedAnimal] = useState<AnimalType | undefined>(
    animal,
  );

  const handleConfirmSelection = () => {
    if (selectedAnimal) {
      onSelect(selectedAnimal);
    }
  };

  return (
    <div className="flex flex-col items-center pt-2 gap-6 w-full">
      <div className="flex flex-col items-start gap-2 w-full">
        <p className="text-xs text-muted-foreground animate-in slide-in-from-bottom fade-in ease-in-out duration-300">
          3 / 6
        </p>
        <h2 className="text-2xl font-semibold text-stone-700 whitespace-pre-line animate-in slide-in-from-bottom-8 fade-in ease-in-out duration-400">
          자신을 닮은
          <br />
          <span className="text-primary">동물을 골라주세요</span>
        </h2>
      </div>

      <div className="grid grid-cols-3 gap-2 w-full animate-in slide-in-from-bottom-8 fade-in ease-in-out duration-500">
        {genderAnimals[gender].map((item) => (
          <CharacterCard
            key={item.type}
            animalType={item.type}
            imgSrc={item.img}
            name={animalDisplayMap[item.type]}
            selected={selectedAnimal === item.type}
            onClick={() => setSelectedAnimal(item.type)}
          />
        ))}
        {commonAnimals.map((item) => (
          <CharacterCard
            key={item.type}
            animalType={item.type}
            imgSrc={item.img}
            name={animalDisplayMap[item.type]}
            selected={selectedAnimal === item.type}
            onClick={() => setSelectedAnimal(item.type)}
          />
        ))}
      </div>

      <div className="w-full grow flex items-end">
        <Button
          onClick={handleConfirmSelection}
          disabled={!selectedAnimal}
          className="w-full h-14 bg-primary text-primary-foreground rounded-2xl text-lg font-medium hover:bg-primary/90 disabled:opacity-50"
        >
          선택 완료
        </Button>
      </div>
    </div>
  );
};

export default AnimalStep;
