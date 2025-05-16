import TurnableProfileCard from "@/components/profile/TurnableProfileCard";
import { Button } from "@/components/ui/button";
import { ProfileContactResponse } from "@/types/profile";
import React from "react";

interface RegisterDoneStepProps {
  profile: ProfileContactResponse;
  onSubmit: () => void;
}

const RegisterDoneStep: React.FC<RegisterDoneStepProps> = ({
  profile,
  onSubmit,
}) => {
  return (
    <div className="w-full max-w-md mx-auto flex flex-col pt-2 gap-2 items-center grow">
      <h2 className="text-3xl font-bold text-center text-pink">
        프로필 등록 완료!
      </h2>
      <p className="text-base font-medium text-center text-black-600">
        지금 이용권을 구매하면 30% 할인해 드려요
      </p>

      <div className="grow flex flex-col justify-center items-stretch self-stretch">
        <TurnableProfileCard profile={profile} contact={profile.contact} />
      </div>
      <Button type="submit" size="xl" className="w-full" onClick={onSubmit}>
        이용권 구매하기
      </Button>
    </div>
  );
};

export default RegisterDoneStep;
