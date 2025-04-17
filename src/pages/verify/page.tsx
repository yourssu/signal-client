import { userGender } from "@/atoms/userGender";
import GenderStep from "@/components/GenderStep";
import { VerifyStep } from "@/components/verify/VerifyStep";
import { useViewerVerification } from "@/hooks/queries/viewers";
import { useUserUuid } from "@/hooks/useUserUuid";
import { Gender } from "@/types/profile";
import { useFunnel } from "@use-funnel/react-router-dom";
import { useAtom } from "jotai";
import React, { useMemo } from "react";
import { useNavigate } from "react-router";

const ProfileVerificationPage: React.FC = () => {
  const funnel = useFunnel<{
    gender: { gender?: Gender };
    verify: { gender?: Gender };
  }>({
    id: "verify",
    initial: {
      step: "gender",
      context: {},
    },
  });
  const { gender } = funnel.context;
  const navigate = useNavigate();
  const uuid = useUserUuid();
  const [, setStoredGender] = useAtom(userGender);
  const { data, isLoading } = useViewerVerification(uuid, gender);
  const verificationCode: number | null = useMemo(
    () => Number(data?.verificationCode ?? null) || null,
    [data]
  );
  // const { data: viewer } = useViewerSelf(uuid); TODO: auto refetech viewer info when real endpoint is ready

  const handleGenderSelect = (gender: Gender) => {
    funnel.history.push("verify", { gender });
  };

  const handleVerify = () => {
    if (gender) setStoredGender(gender);
    navigate("/profile");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <funnel.Render
          gender={() => <GenderStep onSelect={handleGenderSelect} />}
          verify={() => (
            <VerifyStep
              isLoading={isLoading}
              verificationCode={verificationCode}
              onVerify={handleVerify}
            />
          )}
        />
      </div>
    </div>
  );
};

export default ProfileVerificationPage;
