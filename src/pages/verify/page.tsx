import { viewerSelfAtom } from "@/atoms/viewerSelf";
import GenderStep from "@/components/verify/GenderStep";
import TopBar from "@/components/home/TopBar";
import { VerifyStep } from "@/components/verify/VerifyStep";
import { useViewerSelf, useViewerVerification } from "@/hooks/queries/viewers";
import { useUserUuid } from "@/hooks/useUserUuid";
import { Gender } from "@/types/profile";
import { useFunnel } from "@use-funnel/react-router";
import { useAtom } from "jotai";
import React, { useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import { desiredGenderAtom } from "@/atoms/desiredGender";

const ProfileVerificationPage: React.FC = () => {
  const [desiredGender, setDesiredGender] = useAtom(desiredGenderAtom);
  const [viewer, setViewer] = useAtom(viewerSelfAtom);
  const funnel = useFunnel<{
    gender: { gender?: Gender };
    verify: { gender?: Gender };
  }>({
    id: "verify",
    initial: {
      step: "gender",
      context: { ...(desiredGender && { gender: desiredGender }) },
    },
  });
  const navigate = useNavigate();
  const uuid = useUserUuid();

  const { data, isLoading: isVerificationLoading } =
    useViewerVerification(uuid);
  const verificationCode: number | null = useMemo(
    () => Number(data?.verificationCode ?? null) || null,
    [data]
  );

  const { data: viewerResponse } = useViewerSelf(uuid, {
    refetchInterval: 1000,
  });

  useEffect(() => {
    if (viewerResponse) {
      // Navigate if tickets are present (initial load or increase) or profile updated
      if (
        viewer === null ||
        viewer.updatedTime !== viewerResponse.updatedTime
      ) {
        setViewer(viewerResponse);
        navigate("/profile");
      }
    }
  }, [viewerResponse, setViewer, navigate, viewer]);

  const handleGenderSelect = (gender: Gender) => {
    setDesiredGender(gender);
    funnel.history.push("verify", { gender });
  };

  const handleBack = () => {
    if (funnel.index !== 0) {
      funnel.history.back();
    } else {
      navigate("/");
    }
  };

  return (
    // Main page container - Flex column, min height screen
    <div className="flex flex-col min-h-dvh">
      <TopBar onBack={handleBack} />
      {/* Content area - Takes remaining height, centers content */}
      <div className="flex-grow flex flex-col items-center justify-center p-4">
        {/* Funnel container - Max width */}
        <div className="w-full max-w-md h-full flex flex-col grow items-stretch justify-stretch">
          <funnel.Render
            gender={() => <GenderStep onSelect={handleGenderSelect} />}
            verify={() => (
              <VerifyStep
                isLoading={isVerificationLoading}
                verificationCode={verificationCode}
              />
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileVerificationPage;
