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
        <p className="text-xs text-label-alternative animate-in slide-in-from-bottom fade-in ease-in-out duration-300">
          1 / 6
        </p>
        <h2 className="text-2xl font-semibold text-label-neutral whitespace-pre-line animate-in slide-in-from-bottom-8 fade-in ease-in-out duration-400">
          안녕하세요 :)
          <br />
          <span className="text-primary">성별을 알려주세요</span>
        </h2>
      </div>
      <div className="flex gap-2 items-center w-full">
        <button
          type="button"
          onClick={() => onSelect("MALE")}
          className="flex flex-1 flex-col gap-3 items-center justify-center h-[230px] py-[50px] rounded-[20px] bg-[#f0f7ff] cursor-pointer transition-colors hover:bg-[#dceeff] active:bg-[#dceeff]"
        >
          <img src={faceMan} alt="" className="size-20 shrink-0" />
          <span className="text-[18px] font-semibold leading-[1.2] text-[#212225]">
            남성
          </span>
        </button>
        <button
          type="button"
          onClick={() => onSelect("FEMALE")}
          className="flex flex-1 flex-col gap-3 items-center justify-center h-[230px] py-[50px] rounded-[20px] bg-[#fff9fe] cursor-pointer transition-colors hover:bg-[#ffe8f8] active:bg-[#ffe8f8]"
        >
          <img src={faceWoman} alt="" className="size-20 shrink-0" />
          <span className="text-[18px] font-semibold leading-[1.2] text-[#212225]">
            여성
          </span>
        </button>
      </div>
    </div>
  );
};

export default GenderStep;
