import { viewerSelfAtom } from "@/atoms/viewerSelf";
import TopBar from "@/components/Header";
import { BankAccountPaymentStep } from "@/components/purchase/BankAccountPaymentStep";
import {
  useNotificationDeposit,
  useTicketPackages,
  useViewerSelf,
  useViewerVerification,
} from "@/hooks/queries/viewers";
import { Package } from "@/types/viewer";
import { useFunnel } from "@use-funnel/react-router";
import { useAtom, useAtomValue } from "jotai";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import PackageSelectionStep from "@/components/purchase/PackageSelectionStep";
import {
  buttonClick,
  funnelComplete,
  funnelStart,
  funnelStep,
  purchaseTickets,
  selectPackage,
  viewPackages,
} from "@/lib/analytics";
import { userProfileAtom } from "@/atoms/userProfile";

const BankAccountPaymentsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const returnId = searchParams.get("return_id");
  const [viewer, setViewer] = useAtom(viewerSelfAtom);
  const profile = useAtomValue(userProfileAtom);
  const funnel = useFunnel<{
    packageSelection: { package?: Package };
    payment: { package: Package };
  }>({
    id: "payment",
    initial: {
      step: "packageSelection",
      context: {},
    },
  });
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(false);

  const {
    data,
    mutateAsync,
    isPending: isVerificationLoading,
  } = useViewerVerification();
  const verificationCode: number | null = useMemo(
    () => Number(data?.verificationCode ?? null) || null,
    [data],
  );

  const { data: viewerResponse, isRefetching } = useViewerSelf({
    refetchInterval: isChecking && 1000,
  });
  const onSale = !!profile && (viewer?.ticket ?? 0) === 0;

  const { data: packagesRes } = useTicketPackages();
  const packages = useMemo(() => packagesRes?.packages ?? [], [packagesRes]);

  useEffect(() => {
    if (funnel.historySteps.length === 1) {
      funnelStart("payment", "티켓 구매");
      viewPackages(packages, onSale);
    }
  }, [funnel.historySteps.length, onSale, packages]);

  useEffect(() => {
    if (funnel.historySteps.length > 1 && viewerResponse) {
      // Navigate if tickets are present (initial load or increase) or profile updated
      if (
        viewer === null ||
        (viewer.updatedTime !== viewerResponse.updatedTime &&
          viewer.ticket !== viewerResponse.ticket)
      ) {
        console.log(viewer, viewerResponse);
        setViewer(viewerResponse);
        purchaseTickets(funnel.context.package!, `${verificationCode}`, onSale);
        funnelComplete("payment", "티켓 구매", funnel.context);
        console.log("funnel complete");
        if (returnId) {
          navigate(`/purchase/success?return_id=${returnId}`);
        } else {
          navigate("/purchase/success");
        }
      }
    }
  }, [
    viewerResponse,
    setViewer,
    navigate,
    viewer,
    isRefetching,
    funnel.context,
    verificationCode,
    onSale,
    returnId,
    profile,
    funnel.historySteps.length,
  ]);

  const handlePackageSelect = async (ticketPackage: Package) => {
    await mutateAsync({}); // Ensure verification code is fetched
    funnel.history.replace("packageSelection", { package: ticketPackage });
    funnel.history.push("payment", { package: ticketPackage });
    funnelStep("payment", "티켓 구매", "packageSelection", funnel.context);
    selectPackage(ticketPackage, onSale);
  };

  const handleBack = () => {
    if (funnel.index !== 0) {
      funnel.history.back();
    } else {
      navigate("/");
    }
  };

  const { mutate: sendRenameRequest } = useNotificationDeposit();

  const handleRenameRequested = (name: string) => {
    if (verificationCode) {
      sendRenameRequest({
        message: name,
        verificationCode,
      });
      buttonClick("send_rename_request", "이름 변경 요청");
    }
    setIsChecking(true);
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
              <PackageSelectionStep
                isOnSale={onSale}
                onSelect={handlePackageSelect}
              />
            )}
            payment={() => (
              <BankAccountPaymentStep
                pkg={funnel.context.package!}
                isLoading={isVerificationLoading}
                verificationCode={verificationCode}
                isChecking={isChecking}
                isOnSale={onSale}
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

export default BankAccountPaymentsPage;
