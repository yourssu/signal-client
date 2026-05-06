import React from "react";
import { AnimalType } from "@/types/profile";
import AnimalImage from "@/components/profile/AnimalImage";
import { animalDisplayMap } from "@/lib/animal";
import { cn } from "@/lib/utils";

interface CharacterCardProps {
  animalType: AnimalType;
  imgSrc?: string;
  name?: string;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
  imgClassName?: string;
}

const CharacterCard: React.FC<CharacterCardProps> = ({
  animalType,
  imgSrc,
  name,
  selected,
  onClick,
  className,
  imgClassName,
}) => {
  const displayName = name ?? `${animalDisplayMap[animalType]}상`;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center gap-2 h-[160px] rounded-xl transition-all duration-200 cursor-pointer bg-fill-normal",
        selected && "ring-2 ring-primary scale-105",
        className,
      )}
    >
      {imgSrc ? (
        <img src={imgSrc} alt={displayName} className={`max-w-20 object-contain shrink-0 ${imgClassName ?? ""}`} />
      ) : (
        <AnimalImage animalType={animalType} className={`max-w-20 object-contain shrink-0 ${imgClassName ?? ""}`} />
      )}
      <p className="text-sm font-semibold leading-[1.35] text-label-neutral whitespace-nowrap">
        {displayName}
      </p>
    </button>
  );
};

export default CharacterCard;
