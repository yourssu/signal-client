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
// TODO: 남자 늑대 3D 에셋으로 교체한다. 지금은 로비용 2D SVG를 임시로 쓴다.
import wolfImg from "@/assets/animals/wolf.svg";

interface AnimalStepProps {
  gender: Gender;
  animal?: AnimalType;
  onSelect: (animal: AnimalType) => void;
}

/**
 * 성별에 따라 고르는 동물이 다르다. 앞 셋은 성별 전용이고 강아지·고양이는 공용이며,
 * 마지막 자리만 남자는 늑대, 여자는 햄스터로 갈린다.
 */
const genderAnimals: Record<Gender, { type: AnimalType; img: string }[]> = {
  MALE: [
    { type: "BEAR", img: bearMaleImg },
    { type: "DEER", img: deerMaleImg },
    { type: "DINOSAUR", img: dinosaurMaleImg },
    { type: "DOG", img: dogCommonImg },
    { type: "CAT", img: catCommonImg },
    { type: "WOLF", img: wolfImg },
  ],
  FEMALE: [
    { type: "FOX", img: foxFemaleImg },
    { type: "RABBIT", img: rabbitFemaleImg },
    { type: "TURTLE", img: turtleFemaleImg },
    { type: "DOG", img: dogCommonImg },
    { type: "CAT", img: catCommonImg },
    { type: "HAMSTER", img: hamsterCommonImg },
  ],
};

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
        <p className="text-lg text-muted-foreground animate-in slide-in-from-bottom fade-in ease-in-out duration-300">
          3 / 6
        </p>
        <h2 className="text-2xl font-semibold text-stone-700 whitespace-pre-line animate-in slide-in-from-bottom-8 fade-in ease-in-out duration-400">
          닮은 동물을
          <br />
          선택해주세요
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
            imgClassName={
              gender === "FEMALE" &&
              (item.type === "RABBIT" || item.type === "TURTLE")
                ? "!max-w-24"
                : undefined
            }
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
