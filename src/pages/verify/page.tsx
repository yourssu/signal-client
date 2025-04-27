import { userGender } from "@/atoms/userGender";
import { viewerSelf } from "@/atoms/viewerSelf";
import GenderStep from "@/components/GenderStep";
import { VerifyStep } from "@/components/verify/VerifyStep";
import { useViewerSelf, useViewerVerification } from "@/hooks/queries/viewers";
import { useUserUuid } from "@/hooks/useUserUuid";
import { Gender } from "@/types/profile";
import { useFunnel } from "@use-funnel/react-router-dom";
import { useAtom } from "jotai";
import React, { useEffect, useMemo } from "react";
import { useNavigate } from "react-router";

const ProfileVerificationPage: React.FC = () => {
  const [gender, setGender] = useAtom(userGender);
  const [viewer, setViewer] = useAtom(viewerSelf);
  const funnel = useFunnel<{
    gender: { gender?: Gender };
    verify: { gender?: Gender };
  }>({
    id: "verify",
    initial: {
      step: gender ? "verify" : "gender",
      context: { ...(gender && { gender }) },
    },
  });
  const navigate = useNavigate();
  const uuid = useUserUuid();

  const { data, isLoading: isVerificationLoading } = useViewerVerification(
    uuid,
    gender
  );
  const verificationCode: number | null = useMemo(
    () => Number(data?.verificationCode ?? null) || null,
    [data]
  );

  const { data: viewerResponse } = useViewerSelf(uuid, {
    refetchInterval: !!gender && 1000,
  });

  useEffect(() => {
    const old = viewer;
    if (viewerResponse) {
      setViewer(viewerResponse);
      if (old === null || old.updatedDate !== viewerResponse.updatedDate) {
        navigate("/profile");
      }
    }
  });

  const handleGenderSelect = (gender: Gender) => {
    setGender(gender);
    funnel.history.push("verify", { gender });
  };

  const handleVerify = () => {
    navigate("/profile");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <funnel.Render
          gender={() => <GenderStep onSelect={handleGenderSelect} />}
          verify={() => (
            <VerifyStep
              isLoading={isVerificationLoading}
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
