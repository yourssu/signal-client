import { Gender } from "@/types/profile";
import React from "react";
import faceMan from "@/assets/icons/face_man.svg";
import faceWoman from "@/assets/icons/face_woman.svg";

interface GenderStepProps {
  onSelect: (gender: Gender) => void;
}

const GenderStep: React.FC<GenderStepProps> = ({ onSelect }) => {
  return (
    <div className="flex flex-col gap-5 items-center pt-2 w-full">
      <div className="flex flex-col gap-[10px] w-full">
        <p className="text-lg text-label-alternative animate-in slide-in-from-bottom fade-in ease-in-out duration-300">
          1 / 6
        </p>
        <h2 className="text-2xl font-semibold text-label-neutral whitespace-pre-line animate-in slide-in-from-bottom-8 fade-in ease-in-out duration-400">
          나의 성별을
          <br />
          선택해주세요
        </h2>
      </div>
      <div className="flex gap-2 items-center w-full">
        <button
          type="button"
          onClick={() => onSelect("MALE")}
          className="flex flex-1 flex-col gap-3 items-center justify-center h-[230px] py-[50px] rounded-[20px] bg-fill-blue-light cursor-pointer transition-colors hover:bg-[var(--blue-300)] active:bg-[var(--blue-300)]"
        >
          <img src={faceMan} alt="" className="size-20 shrink-0" />
          <span className="text-[18px] font-semibold leading-[1.2] text-label-strong">
            남성
          </span>
        </button>
        <button
          type="button"
          onClick={() => onSelect("FEMALE")}
          className="flex flex-1 flex-col gap-3 items-center justify-center h-[230px] py-[50px] rounded-[20px] bg-fill-pink-light cursor-pointer transition-colors hover:bg-[var(--pink-300)] active:bg-[var(--pink-300)]"
        >
          <img src={faceWoman} alt="" className="size-20 shrink-0" />
          <span className="text-[18px] font-semibold leading-[1.2] text-label-strong">
            여성
          </span>
        </button>
      </div>
    </div>
  );
};

export default GenderStep;
