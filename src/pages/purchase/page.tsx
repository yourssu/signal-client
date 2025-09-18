import { viewerAtom, userProfileAtom } from "@/atoms/user";
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
import { isAuthenticatedAtom } from "@/atoms/authTokens";
import PaymentSelectionStep from "@/components/purchase/PaymentSelectionStep";
import { ENABLE_KAKAO_PAYMENTS } from "@/env";
import { KakaoPaymentStep } from "@/components/purchase/KakaoPaymentStep";
import { TossPaymentStep } from "@/components/purchase/TossPaymentStep";

const BankAccountPaymentsPage: React.FC = () => {
  const isAuthenticated = useAtomValue(isAuthenticatedAtom);
  const [searchParams] = useSearchParams();
  const returnId = searchParams.get("return_id");
  const [viewer, setViewer] = useAtom(viewerAtom);
  const profile = useAtomValue(userProfileAtom);
  const funnel = useFunnel<{
    packageSelection: { package?: Package };
    paymentSelection: { package: Package };
    toss: { package: Package };
    kakao: { package: Package };
    bank: { package: Package };
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
    mutateAsync: fetchVerificationCode,
    isPending: isVerificationLoading,
  } = useViewerVerification();
  const verificationCode: number | null = useMemo(
    () => Number(data?.verificationCode ?? null) || null,
    [data],
  );

  const { data: viewerResponse, isRefetching } = useViewerSelf({
    refetchInterval: isChecking && 300,
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
    if ((funnel.step === "bank" || funnel.step === "toss") && viewerResponse) {
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
    funnel.step,
  ]);

  const handlePackageSelect = async (ticketPackage: Package) => {
    await fetchVerificationCode({}); // Ensure verification code is fetched
    funnel.history.replace("packageSelection", { package: ticketPackage });
    funnel.history.push("paymentSelection", { package: ticketPackage });
    funnelStep("payment", "티켓 구매", "packageSelection", funnel.context);
    selectPackage(ticketPackage, onSale);
  };

  const handlePaymentSelect = (method: string) => {
    funnelStep("payment", "티켓 구매", "paymentSelection", {
      package: funnel.context.package!,
      method: method,
    });
    if (method === "toss") {
      funnel.history.replace("paymentSelection", {
        package: funnel.context.package!,
      });
      funnel.history.push("toss", { package: funnel.context.package! });
    } else if (method === "bank") {
      funnel.history.replace("paymentSelection", {
        package: funnel.context.package!,
      });
      funnel.history.push("bank", { package: funnel.context.package! });
    } else if (ENABLE_KAKAO_PAYMENTS && method === "kakao") {
      funnel.history.replace("paymentSelection", {
        package: funnel.context.package!,
      });
      funnel.history.push("kakao", { package: funnel.context.package! });
    }
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
      <title>티켓 구매하기 - 시그널</title>
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
            paymentSelection={() => (
              <PaymentSelectionStep
                pkg={funnel.context.package!}
                verificationCode={verificationCode}
                onSelect={handlePaymentSelect}
                isOnSale={onSale}
              />
            )}
            toss={() => (
              <TossPaymentStep
                isChecking={isChecking}
                onStartCheck={() => setIsChecking(true)}
                onEndCheck={() => setIsChecking(false)}
              />
            )}
            bank={() => (
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
            kakao={() =>
              ENABLE_KAKAO_PAYMENTS ? (
                <KakaoPaymentStep
                  pkg={funnel.context.package!}
                  isAuthenticated={isAuthenticated}
                  isOnSale={onSale}
                />
              ) : null
            }
          />
        </div>
      </div>
    </div>
  );
};

export default BankAccountPaymentsPage;
