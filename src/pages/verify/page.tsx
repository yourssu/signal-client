import { viewerSelfAtom } from "@/atoms/viewerSelf";
import TopBar from "@/components/TopBar";
import { VerifyStep } from "@/components/verify/VerifyStep";
import { useViewerSelf, useViewerVerification } from "@/hooks/queries/viewers";
import { useUserUuid } from "@/hooks/useUserUuid";
import { Package } from "@/types/viewer";
import { useFunnel } from "@use-funnel/react-router";
import { useAtom } from "jotai";
import React, { useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
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
  const isManualRefetching = useRef(false);

  const { data, isLoading: isVerificationLoading } =
    useViewerVerification(uuid);
  const verificationCode: number | null = useMemo(
    () => Number(data?.verificationCode ?? null) || null,
    [data],
  );

  const {
    data: viewerResponse,
    refetch,
    isRefetching,
  } = useViewerSelf(uuid, {
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
      } else if (isManualRefetching.current) {
        toast.error(
          "입금 확인에 실패했습니다.\n입금을 하셨다면 부스 STAFF에게 문의해 주세요.",
        );
        isManualRefetching.current = false;
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

  const handleManualCheck = () => {
    refetch({ cancelRefetch: true });
    isManualRefetching.current = true;
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
                onManualCheck={handleManualCheck}
              />
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileVerificationPage;
