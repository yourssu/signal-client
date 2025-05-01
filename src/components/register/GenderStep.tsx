import { Gender } from "@/types/profile";
import React from "react";
// Remove unused image imports
// import male from "@/assets/male.png";
// import female from "@/assets/female.png";
import { Button } from "@/components/ui/button";

interface GenderStepProps {
  onSelect: (gender: Gender) => void;
}

const GenderStep: React.FC<GenderStepProps> = ({ onSelect }) => {
  return (
    // Adjust main container layout and gap
    <div className="flex flex-col items-center pt-10 w-full">
      {/* Add top section for progress and title */}
      <div className="flex flex-col gap-[10px] w-full grow">
        <p className="text-xs text-[#525252]">1 / 6</p>
        {/* Update title text and style */}
        <h2 className="text-2xl font-semibold text-[#44403B] whitespace-pre-line">
          안녕하세요 :)
          <br />
          <span className="text-primary">성별을 알려주세요</span>
        </h2>
      </div>
      {/* Adjust button container layout */}
      <div className="flex flex-col items-center gap-[10px] w-full px-4">
        {/* Update Male Button style */}
        <Button
          onClick={() => onSelect("MALE")}
          // Remove size="card", update classes for Figma style
          className="flex justify-center items-center bg-white border border-[#FFF2F7] text-[#EE518A] rounded-[12px] w-full max-w-[342px] h-[56px] text-xl font-medium hover:bg-pink-50"
        >
          {/* Remove image */}
          남성
        </Button>
        {/* Update Female Button style */}
        <Button
          onClick={() => onSelect("FEMALE")}
          // Remove size="card", update classes for Figma style
          className="flex justify-center items-center bg-white border border-[#FFF2F7] text-[#EE518A] rounded-[12px] w-full max-w-[342px] h-[56px] text-xl font-medium hover:bg-pink-50"
        >
          {/* Remove image */}
          여성
        </Button>
      </div>
    </div>
  );
};

export default GenderStep;
