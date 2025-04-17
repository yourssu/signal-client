import { Gender } from "@/types/profile";
import React from "react";
import male from "@/assets/male.png";
import female from "@/assets/female.png";
import { Button } from "@/components/ui/button";

interface GenderStepProps {
  onSelect: (gender: Gender) => void;
}

const GenderStep: React.FC<GenderStepProps> = ({ onSelect }) => {
  return (
    <div className="flex flex-col items-center space-y-4 gap-24">
      <h2 className="text-2xl font-bold mb-6">성별을 선택해주세요.</h2>
      <div className="flex justify-center gap-4 w-full">
        <Button
          onClick={() => onSelect("MALE")}
          size="card"
          className="flex flex-col justify-center items-center shadow-md bg-background text-foreground transition-all"
        >
          <img src={male} className="size-24" />
          남성
        </Button>
        <Button
          onClick={() => onSelect("FEMALE")}
          size="card"
          className="flex flex-col justify-center items-center shadow-md bg-background text-foreground transition-all"
        >
          <img src={female} className="size-24" />
          여성
        </Button>
      </div>
    </div>
  );
};

export default GenderStep;
