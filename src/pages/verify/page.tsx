import { viewerSelfAtom } from "@/atoms/viewerSelf";
import TopBar from "@/components/TopBar";
import { VerifyStep } from "@/components/verify/VerifyStep";
import { useViewerSelf, useViewerVerification } from "@/hooks/queries/viewers";
import { useUserUuid } from "@/hooks/useUserUuid";
import { Package } from "@/types/viewer";
import { useFunnel } from "@use-funnel/react-router";
import { useAtom } from "jotai";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import PackageSelectionStep from "@/components/verify/PackageSelectionStep";

const ProfileVerificationPage: React.FC = () => {
  const [viewer, setViewer] = useAtom(viewerSelfAtom);
  const funnel = useFunnel<{
    packageSelection: { package?: Package };
    verify: { package?: Package };
  }>({
    id: "verify",
    initial: {
      step: "packageSelection",
      context: {},
    },
  });
  const navigate = useNavigate();
  const uuid = useUserUuid();
  const [isChecking, setIsChecking] = useState(false);

  const { data, isLoading: isVerificationLoading } =
    useViewerVerification(uuid);
  const verificationCode: number | null = useMemo(
    () => Number(data?.verificationCode ?? null) || null,
    [data],
  );

  const { data: viewerResponse, isRefetching } = useViewerSelf(uuid, {
    refetchInterval: isChecking && 1000,
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
  }, [viewerResponse, setViewer, navigate, viewer, isRefetching]);

  const handlePackageSelect = (ticketPackage: Package) => {
    funnel.history.push("verify", { package: ticketPackage });
  };

  const handleBack = () => {
    if (funnel.index !== 0) {
      funnel.history.back();
    } else {
      navigate("/");
    }
  };

  const handleRenameRequested = (name: string) => {
    console.log("Rename requested with name:", name);
    // TODO: Send rename request to server
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
            packageSelection={() => (
              <PackageSelectionStep onSelect={handlePackageSelect} />
            )}
            verify={() => (
              <VerifyStep
                isLoading={isVerificationLoading}
                verificationCode={verificationCode}
                onStartCheck={() => setIsChecking(true)}
                onEndCheck={() => setIsChecking(false)}
                onRenameRequested={handleRenameRequested}
              />
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileVerificationPage;
