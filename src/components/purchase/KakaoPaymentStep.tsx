import { BUSINESS_INFO, PRIVACY, REFUND_POLICY, TERMS } from "@/env";
import { useState } from "react";
import { Button } from "../ui/button";
import TermsDrawer from "@/components/TermsDrawer";
import { Package } from "@/types/viewer";
import kakaoPayCI from "@/assets/icons/kakapay_ci.svg";
import { useKakaoPaymentInitiate } from "@/hooks/queries/viewers";
import { purchaseTickets } from "@/lib/analytics";

interface KakaoPaymentStepProps {
  pkg: Package;
  isAuthenticated: boolean;
  isOnSale: boolean;
}

export const KakaoPaymentStep = ({
  isAuthenticated,
  isOnSale,
  pkg,
}: KakaoPaymentStepProps) => {
  const [openTerms, setOpenTerms] = useState(false); // State to track terms modal
  const [openPrivacy, setOpenPrivacy] = useState(false); // State to track privacy modal
  const [openRefundPolicy, setOpenRefundPolicy] = useState(false); // State to track refund policy modal
  const [openBusinessInfo, setOpenBusinessInfo] = useState(false); // State to track business info modal

  const paymentInitiateMutation = useKakaoPaymentInitiate({
    onSuccess: (response) => {
      // Redirect to KakaoPay payment page
      purchaseTickets(pkg, response.orderId, isOnSale);
      const isMobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent,
        );
      const redirectUrl = isMobile
        ? response.nextRedirectMobileUrl
        : response.nextRedirectPcUrl;
      window.location.href = redirectUrl;
    },
    onError: (error) => {
      console.error("Payment initiation failed:", error);
    },
  });

  const handleOpenTerms = () => {
    setOpenTerms(true);
  };

  const handleOpenPrivacy = () => {
    setOpenPrivacy(true);
  };

  const handleRefundPolicy = () => {
    setOpenRefundPolicy(true);
  };

  const handleBusinessInfo = () => {
    setOpenBusinessInfo(true);
  };

  const handleStartCheck = () => {
    paymentInitiateMutation.mutate({
      packageId: pkg.id,
    });
  };

  return (
    // Main container matching Figma's design
    <div className="flex flex-col items-center justify-between grow w-full px-4 py-6 gap-4">
      {/* Header section */}
      <div className="flex flex-col gap-2 self-stretch">
        <p className="text-xs text-black-600 font-normal animate-in slide-in-from-bottom fade-in ease-in-out duration-300">
          3 / 3
        </p>
        <h1 className="text-2xl font-semibold text-black-700 animate-in slide-in-from-bottom-8 fade-in ease-in-out duration-400">
          시그널 이용권을
          <br />
          <span className="text-primary">충전할게요</span>
        </h1>
      </div>

      {/* Steps section */}
      <div className="flex flex-col w-full gap-4 animate-in slide-in-from-bottom-8 fade-in ease-in-out duration-500">
        {/* Step 1: Account copy */}
        <div className="bg-pink-50 border border-primary/20 rounded-lg p-4 flex flex-col gap-2">
          <div className="flex items-center">
            <p className="grow text-sm font-medium text-black-600">수량</p>
            <p className="text-primary">이용권 {pkg.name}</p>
          </div>
          <div className="flex items-center">
            <p className="grow text-sm font-medium text-black-600">결제수단</p>
            <p className="text-primary flex items-center gap-1">
              <img src={kakaoPayCI} />
              카카오페이
            </p>
          </div>
          <div className="flex items-center">
            <p className="grow text-sm font-medium text-black-600">사용기간</p>
            <p className="text-primary">~ 2025.09.26</p>
          </div>
          <div className="flex items-center">
            <p className="grow text-sm font-medium text-black-600">결제 금액</p>
            <p className="text-primary">{pkg.price[isOnSale ? 0 : 1]}원</p>
          </div>
        </div>

        {/* Terms notice */}
        <p className="text-xs text-center mb-2">
          결제 진행 시, '시그널'{" "}
          <a onClick={handleOpenTerms} className="underline cursor-pointer">
            서비스 이용약관
          </a>
          ,<br />
          <a onClick={handleOpenPrivacy} className="underline cursor-pointer">
            개인정보 처리방침
          </a>
          과{" "}
          <a onClick={handleRefundPolicy} className="underline cursor-pointer">
            환불 정책
          </a>
          에 동의하는 것으로 간주됩니다.
        </p>
        <p className="text-xs text-center mb-2">
          <a onClick={handleBusinessInfo} className="underline cursor-pointer">
            사업자 정보 확인
          </a>
        </p>
      </div>

      {/* Button section */}
      <div className="w-full flex flex-col gap-2">
        <Button
          onClick={handleStartCheck}
          disabled={paymentInitiateMutation.isPending || !isAuthenticated}
          className="w-full h-14 text-lg font-medium"
          variant="default"
        >
          {paymentInitiateMutation.isPending ? "결제 준비 중..." : "결제하기"}
        </Button>
      </div>
      <TermsDrawer
        open={openTerms}
        onOpenChange={() => setOpenTerms(false)}
        title="서비스 이용약관"
        terms={TERMS}
      />
      <TermsDrawer
        open={openPrivacy}
        onOpenChange={() => setOpenPrivacy(false)}
        title="개인정보 처리방침"
        terms={PRIVACY}
      />
      <TermsDrawer
        open={openRefundPolicy}
        onOpenChange={() => setOpenRefundPolicy(false)}
        title="환불 정책"
        terms={REFUND_POLICY}
      />
      <TermsDrawer
        open={openBusinessInfo}
        onOpenChange={() => setOpenBusinessInfo(false)}
        title="사업자 정보"
        terms={BUSINESS_INFO}
      />
    </div>
  );
};
