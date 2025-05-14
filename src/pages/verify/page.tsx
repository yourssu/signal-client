import { userGenderAtom } from "@/atoms/userGender";
import { viewerSelfAtom } from "@/atoms/viewerSelf";
import GenderStep from "@/components/verify/GenderStep";
import TopBar from "@/components/TopBar";
import { VerifyStep } from "@/components/verify/VerifyStep";
import { useViewerSelf, useViewerVerification } from "@/hooks/queries/viewers";
import { useUserUuid } from "@/hooks/useUserUuid";
import { Gender } from "@/types/profile";
import { useFunnel } from "@use-funnel/react-router";
import { useAtom } from "jotai";
import React, { useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

const ProfileVerificationPage: React.FC = () => {
  const [gender, setGender] = useAtom(userGenderAtom);
  const [viewer, setViewer] = useAtom(viewerSelfAtom);
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
            gender={() => <GenderStep onSelect={handleGenderSelect} />}
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
