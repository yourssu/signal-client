import React from "react";
import { AnimalType, Gender } from "@/types/profile";

import dogImg from "@/assets/animals/dog.png";
import bearImg from "@/assets/animals/bear.png";
import dinosaurImg from "@/assets/animals/dinosaur.png";
import hamsterImg from "@/assets/animals/hamster.png";
import deerImg from "@/assets/animals/deer.png";
import catImg from "@/assets/animals/cat.png";
import foxImg from "@/assets/animals/fox.png";
import rabbitImg from "@/assets/animals/rabbit.png";
import turtleImg from "@/assets/animals/turtle.png";

import bearMaleImg from "@/assets/animals/male/bear.png";
import deerMaleImg from "@/assets/animals/male/Deer.png";
import dinosaurMaleImg from "@/assets/animals/male/Dinosaur.png";
import foxFemaleImg from "@/assets/animals/female/fox.png";
import rabbitFemaleImg from "@/assets/animals/female/rabbit.png";
import turtleFemaleImg from "@/assets/animals/female/turtle.png";
import dogCommonImg from "@/assets/animals/common/dog.png";
import catCommonImg from "@/assets/animals/common/cat.png";
import hamsterCommonImg from "@/assets/animals/common/hamster.png";

const animalImageMap: Record<AnimalType, string> = {
  DOG: dogImg,
  BEAR: bearImg,
  DINOSAUR: dinosaurImg,
  HAMSTER: hamsterImg,
  DEER: deerImg,
  CAT: catImg,
  FOX: foxImg,
  TURTLE: turtleImg,
  RABBIT: rabbitImg,
};

const genderedAnimalImageMap: Record<Gender, Record<AnimalType, string>> = {
  MALE: {
    DOG: dogCommonImg,
    CAT: catCommonImg,
    HAMSTER: hamsterCommonImg,
    BEAR: bearMaleImg,
    DEER: deerMaleImg,
    DINOSAUR: dinosaurMaleImg,
    FOX: foxImg,
    TURTLE: turtleImg,
    RABBIT: rabbitImg,
  },
  FEMALE: {
    DOG: dogCommonImg,
    CAT: catCommonImg,
    HAMSTER: hamsterCommonImg,
    FOX: foxFemaleImg,
    TURTLE: turtleFemaleImg,
    RABBIT: rabbitFemaleImg,
    BEAR: bearImg,
    DEER: deerImg,
    DINOSAUR: dinosaurImg,
  },
};

interface AnimalImageProps {
  animalType: AnimalType;
  gender?: Gender;
  className?: string;
}

const AnimalImage: React.FC<AnimalImageProps> = ({
  animalType,
  gender,
  className,
}) => {
  const imgSrc = gender
    ? genderedAnimalImageMap[gender][animalType]
    : animalImageMap[animalType];

  if (!imgSrc) {
    console.warn(`Image not found for animal type: ${animalType}`);
    return null;
  }

  return (
    <img
      src={imgSrc}
      alt={`${animalType.toLowerCase()} animal`}
      className={className}
    />
  );
};

export default AnimalImage;
