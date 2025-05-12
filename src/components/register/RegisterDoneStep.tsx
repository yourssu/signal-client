import ProfileCard from "@/components/profile/ProfileCard";
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
    <div className="w-full max-w-md mx-auto flex flex-col gap-2 items-center grow">
      <h2 className="text-3xl font-bold text-center text-pink">
        프로필 등록 완료!
      </h2>
      <p className="text-base font-medium text-center text-black-600">
        이 화면을 유어슈 STAFF에게 보여주면
        <br />
        프로필 열람 이용권을 500원 할인해 드려요
      </p>

      <div className="grow flex flex-col justify-center items-center">
        <ProfileCard profile={profile} contact={profile.contact} />
      </div>
      <Button type="submit" size="xl" className="w-full" onClick={onSubmit}>
        이용권 구매하기
      </Button>
    </div>
  );
};

export default RegisterDoneStep;
