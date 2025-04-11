import { Button } from "@/components/ui/button";
import React from "react";
import { useNavigate } from "react-router";
import feelings from "@/assets/feelings.png";

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center gap-24 justify-center min-h-screen p-4">
      <div className="flex flex-col justify-center">
        <h1 className="text-2xl break-keep mb-4 text-center">
          당신의 시그널을 <br />
          <span className="text-primary">153명</span>이 기다리고 있어요
        </h1>
        <p>시그널이 이어준 인연, 이번 학기에 어쩌구</p>
      </div>
      <div className="mb-8">
        {/* Placeholder for animal character illustration */}
        <img src={feelings} className="w-full" />
      </div>

      <div className="flex flex-col items-stretch gap-4 justify-stretch w-full">
        <Button onClick={() => navigate("/profile/register")} size="xl">
          프로필 등록하기
        </Button>

        <Button onClick={() => navigate("/verify")} size="xl">
          프로필 조회하기
        </Button>
      </div>
    </div>
  );
};

export default HomePage;
