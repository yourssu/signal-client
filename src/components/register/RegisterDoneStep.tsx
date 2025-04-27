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
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center">
        개인 정보를 입력해주세요.
      </h2>
      <p className="text-center mb-6">
        인스타그램 연락처는 앞에 @을 붙여주세요.
      </p>

      <div className="space-y-4">
        <div>
          <ProfileCard profile={profile} contact={profile.contact} />
        </div>

        <Button type="submit" size="xl" className="w-full" onClick={onSubmit}>
          등록 완료
        </Button>
      </div>
    </div>
  );
};

export default RegisterDoneStep;
