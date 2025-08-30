import { viewerSelfAtom } from "@/atoms/viewerSelf";
import TopBar from "@/components/TopBar";
import { Package } from "@/types/viewer";
import { useFunnel } from "@use-funnel/react-router";
import { useAtom, useAtomValue } from "jotai";
import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import PackageSelectionStep from "@/components/purchase/PackageSelectionStep";
import {
  funnelStart,
  funnelStep,
  selectPackage,
  viewPackages,
} from "@/lib/analytics";
import { userProfileAtom } from "@/atoms/userProfile";
import { KakaoPaymentStep } from "@/components/purchase/KakaoPaymentStep";
import { isAuthenticatedAtom } from "@/atoms/authTokens";

const KakaoPayPurchasePage: React.FC = () => {
  const isAuthenticated = useAtomValue(isAuthenticatedAtom);
  const [viewer] = useAtom(viewerSelfAtom);
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

  const onSale = !!profile && (viewer?.ticket ?? 0) === 0;

  useEffect(() => {
    if (funnel.historySteps.length === 1) {
      funnelStart("payment", "티켓 구매");
      viewPackages(onSale);
    }
  }, [funnel.historySteps.length, onSale]);

  const handlePackageSelect = (ticketPackage: Package) => {
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
              <KakaoPaymentStep
                pkg={funnel.context.package!}
                isAuthenticated={isAuthenticated}
                isOnSale={onSale}
              />
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default KakaoPayPurchasePage;
