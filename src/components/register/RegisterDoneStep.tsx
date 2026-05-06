import TurnableProfileCard from "@/components/profile/TurnableProfileCard";
import { Button } from "@/components/ui/button";
import { ProfileContactResponse } from "@/types/profile";
import React, { useEffect, useState } from "react";
import { useAtomValue } from "jotai";
import { providerAtom } from "@/atoms/authTokens";
import { LoginDrawer } from "@/components/LoginDrawer";

interface RegisterDoneStepProps {
  profile: ProfileContactResponse;
  profileNumber?: number;
  onSubmit: () => void;
}

const RegisterDoneStep: React.FC<RegisterDoneStepProps> = ({
  profile,
  profileNumber = 183,
  onSubmit,
}) => {
  const provider = useAtomValue(providerAtom);
  const [loginDrawerOpen, setLoginDrawerOpen] = useState(false);

  useEffect(() => {
    if (provider === "local" || provider === null) {
      const timer = setTimeout(() => {
        setLoginDrawerOpen(true);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [provider]);

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center grow">
      <div className="flex flex-col gap-2 items-center text-center">
        <h2 className="text-2xl font-semibold text-[#212225]">
          <span className="text-primary">{profileNumber}번</span>째로
          <br />
          프로필 등록 완료!
        </h2>
        <p className="text-base font-medium text-[#5a5c64]">
          이용권 30% 할인 혜택을 받을 수 있어요
        </p>
      </div>

      <div className="grow flex flex-col justify-center items-stretch self-stretch py-6">
        <TurnableProfileCard profile={profile} contact={profile.contact} />
      </div>
      <div className="flex flex-col gap-3 items-center w-full">
        <p className="text-xs font-medium text-[#5a5c64]">
          당신의 이상형이 기다리고 있어요
        </p>
        <Button
          onClick={onSubmit}
          className="w-full h-14 rounded-2xl bg-primary text-primary-foreground text-base font-semibold backdrop-blur-[6.5px]"
        >
          이성 프로필 구경가기
        </Button>
      </div>

      <LoginDrawer
        open={loginDrawerOpen}
        onOpenChange={setLoginDrawerOpen}
      />
    </div>
  );
};

export default RegisterDoneStep;
