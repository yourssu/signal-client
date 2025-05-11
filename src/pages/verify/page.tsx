import { viewerSelfAtom } from "@/atoms/viewerSelf";
import TopBar from "@/components/TopBar";
import { VerifyStep } from "@/components/verify/VerifyStep";
import { useViewerSelf, useViewerVerification } from "@/hooks/queries/viewers";
import { useUserUuid } from "@/hooks/useUserUuid";
import { useAtom } from "jotai";
import React, { useEffect, useMemo } from "react";
import { useNavigate } from "react-router";

const ProfileVerificationPage: React.FC = () => {
  const [viewer, setViewer] = useAtom(viewerSelfAtom);
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
        navigate("/gender");
      }
    }
  }, [viewerResponse, setViewer, navigate, viewer]);

  return (
    // Main page container - Flex column, min height screen
    <div className="flex flex-col min-h-dvh">
      <TopBar onBack="/" />
      {/* Content area - Takes remaining height, centers content */}
      <div className="flex-grow flex flex-col items-center justify-center p-4">
        {/* Funnel container - Max width */}
        <div className="w-full max-w-md h-full flex flex-col grow items-stretch justify-stretch">
          <VerifyStep
            isLoading={isVerificationLoading}
            verificationCode={verificationCode}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileVerificationPage;
