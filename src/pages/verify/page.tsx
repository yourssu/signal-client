import { userUuid } from "@/atoms/userUuid";
import GenderStep from "@/components/GenderStep";
import { VerifyStep } from "@/components/verify/VerifyStep";
import { useViewerVerification } from "@/queries/viewer";
import { Gender } from "@/types/profile";
import { useFunnel } from "@use-funnel/react-router-dom";
import { useAtom } from "jotai";
import React, { useMemo } from "react";
import { useNavigate } from "react-router";

const ProfileVerificationPage: React.FC = () => {
  const funnel = useFunnel<{
    gender: Record<string, unknown>;
    verify: { gender: Gender };
  }>({
    id: "verify",
    initial: {
      step: "gender",
      context: {},
    },
  });
  const navigate = useNavigate();
  const [uuid] = useAtom(userUuid);
  const { data, isLoading } = useViewerVerification(uuid);
  const verificationCode: number | null = useMemo(
    () => Number(data?.verificationCode ?? null) || null,
    [data]
  );
  // const { data: viewer } = useViewerMe(uuid); TODO: auto refetech viewer info when real endpoint is ready

  const handleGenderSelect = (gender: Gender) => {
    funnel.history.push("verify", { gender });
  };

  const handleVerify = () => {
    navigate("/profile");
  };

  return (
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
  );
};

export default ProfileVerificationPage;
