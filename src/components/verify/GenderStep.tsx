import { Gender } from "@/types/profile";
import React from "react";
import maleCharacter from "@/assets/images/male-character.png"; // Import downloaded image
import femaleCharacter from "@/assets/images/female-character.png"; // Import downloaded image

interface GenderStepProps {
  onSelect: (gender: Gender) => void;
}

const GenderStep: React.FC<GenderStepProps> = ({ onSelect }) => {
  return (
    // Apply Figma layout: flex column, items-center, gap-40 (160px), pt adjusted
    <div className="flex flex-col items-center w-full grow">
      {/* Title Section */}
      <div className="flex flex-col items-start w-full px-4">
        {/* Apply Figma text style: Pretendard, 600, 24px, #404040 */}
        <h2 className="text-[24px] font-semibold text-[#404040]">
          <span className="text-primary">본인의 성별</span>을
          <br />
          선택해주세요
        </h2>
      </div>

      {/* Gender Selection Buttons - Apply Figma layout: flex row, items-center, gap-6 (25px) */}
      <div className="flex flex-row items-center justify-center gap-[25px] w-full grow">
        {/* Male Button */}
        <div
          className="flex flex-col items-center gap-[25px] cursor-pointer group"
          onClick={() => onSelect("MALE")}
        >
          {/* Circular Image Container - Apply Figma styles: border, size */}
          <div className="relative w-[129px] h-[129px] rounded-full border-2 border-[#51A2FF] bg-white flex items-center justify-center overflow-hidden group-hover:opacity-80 transition-opacity">
            <img
              src={maleCharacter}
              alt="남성 캐릭터"
              className="object-cover w-full h-full"
            />
          </div>
          {/* Text Label - Apply Figma text style: Pretendard, 500, 16px, #404040 */}
          <p className="text-[16px] font-medium text-[#404040]">남성</p>
        </div>

        {/* Female Button */}
        <div
          className="flex flex-col items-center gap-[25px] cursor-pointer group"
          onClick={() => onSelect("FEMALE")}
        >
          {/* Circular Image Container - Apply Figma styles: border, size */}
          <div className="relative w-[129px] h-[129px] rounded-full border-2 border-[#EE518A] bg-white flex items-center justify-center overflow-hidden group-hover:opacity-80 transition-opacity">
            <img
              src={femaleCharacter}
              alt="여성 캐릭터"
              className="object-cover w-full h-full" // Adjusted scale to cover
            />
          </div>
          {/* Text Label - Apply Figma text style: Pretendard, 500, 16px, #404040 */}
          <p className="text-[16px] font-medium text-[#404040]">여성</p>
        </div>
      </div>
    </div>
  );
};

export default GenderStep;
