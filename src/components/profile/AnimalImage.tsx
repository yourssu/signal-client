import React from "react";
import { AnimalType } from "@/types/profile";

// Import downloaded animal images
import dogImg from "@/assets/animals/dog.png";
import bearImg from "@/assets/animals/bear.png";
import dinosaurImg from "@/assets/animals/dinosaur.png";
import hamsterImg from "@/assets/animals/hamster.png";
import deerImg from "@/assets/animals/deer.png";
import catImg from "@/assets/animals/cat.png";
import foxImg from "@/assets/animals/fox.png";
import rabbitImg from "@/assets/animals/rabbit.png";
import turtleImg from "@/assets/animals/turtle.png";

// Mapping from AnimalType to image source
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

interface AnimalImageProps {
  animalType: AnimalType;
  className?: string; // Allow passing custom classes for styling
}

const AnimalImage: React.FC<AnimalImageProps> = ({ animalType, className }) => {
  const imgSrc = animalImageMap[animalType];

  // Optional: Handle cases where the animalType might not have a corresponding image
  if (!imgSrc) {
    console.warn(`Image not found for animal type: ${animalType}`);
    return null; // Or return a default placeholder image/component
  }

  return (
    <img
      src={imgSrc}
      alt={`${animalType.toLowerCase()} animal`} // Generate alt text based on type
      className={className} // Apply any passed class names
    />
  );
};

export default AnimalImage;
