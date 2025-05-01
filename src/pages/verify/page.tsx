import { userGender } from "@/atoms/userGender";
import { viewerSelf } from "@/atoms/viewerSelf";
import GenderStep from "@/components/verify/GenderStep";
import TopBar from "@/components/home/TopBar";
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
      // Navigate if tickets are present (initial load or increase) or profile updated
      if (old === null || old.updatedDate !== viewerResponse.updatedDate) {
        navigate("/profile");
      }
    }
  }, [viewerResponse, setViewer, navigate, viewer]);

  const handleGenderSelect = (gender: Gender) => {
    setGender(gender);
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
    <div className="flex flex-col min-h-dvh bg-background">
      <TopBar
        heartCount={viewerResponse?.usedTicket ?? 0}
        ticketCount={
          (viewerResponse?.ticket ?? 0) - (viewerResponse?.usedTicket ?? 0)
        }
        onBack={handleBack}
      />
      {/* Add the TopBar */}
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
