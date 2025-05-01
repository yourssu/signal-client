import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import catCharacter from "@/assets/figma/cat_character.png";
import { useCountProfile } from "@/hooks/queries/profiles";

const MainContent: React.FC = () => {
  const navigate = useNavigate();
  const { data } = useCountProfile();
  const count = React.useMemo(() => data?.count ?? 0, [data?.count]);

  return (
    <div className="flex flex-col items-center gap-16 justify-center flex-1 px-6">
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-3xl font-semibold text-center leading-tight tracking-tight text-black-700">
          당신의 시그널을
          <br />
          기다리고 있어요
        </h1>
        <p className="text-lg font-semibold text-black-600 tracking-tight">
          <span className="text-primary">{count}명</span>이 기다리고 있어요
        </p>
      </div>

      <div className="w-full max-w-[280px]">
        <img src={catCharacter} alt="Cat Character" className="w-full h-auto" />
      </div>

      <div className="flex flex-col items-stretch gap-4 w-full max-w-[342px]">
        <Button
          onClick={() => navigate("/profile/register")}
          className="h-14 rounded-2xl bg-white text-pink hover:bg-white/90 shadow-sm"
        >
          프로필 등록하기
        </Button>

        <Button
          onClick={() => navigate("/verify")}
          className="h-14 rounded-2xl bg-pink text-white hover:bg-pink/90"
        >
          시그널 보내기
        </Button>
      </div>
    </div>
  );
};

export default MainContent;
