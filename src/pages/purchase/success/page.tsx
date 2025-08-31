import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { Button } from "@/components/ui/button";
import TopBar from "@/components/TopBar";
import main from "@/assets/home/main.png";
import { useKakaoPaymentApprove } from "@/hooks/queries/viewers";
import { ENABLE_KAKAO_PAYMENTS } from "@/env";
import { useAtomValue } from "jotai";
import { isAuthenticatedAtom } from "@/atoms/authTokens";

const PurchaseSuccessPage: React.FC = () => {
  const isAuthenticated = useAtomValue(isAuthenticatedAtom);
  const [searchParams] = useSearchParams();
  const [paymentProcessed, setPaymentProcessed] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const orderId = searchParams.get("order_id");
  const pgToken = searchParams.get("pg_token");

  const { mutate, isPending } = useKakaoPaymentApprove({
    onSuccess: (response) => {
      console.log("Payment approved successfully:", response);
      setPaymentSuccess(true);
      setPaymentProcessed(true);
    },
    onError: (error) => {
      console.error("Payment approval failed:", error);
      setPaymentSuccess(false);
      setPaymentProcessed(true);
    },
  });

  useEffect(() => {
    // Check if Kakao payments are enabled and we have the required parameters
    if (
      ENABLE_KAKAO_PAYMENTS &&
      isAuthenticated &&
      orderId &&
      pgToken &&
      !paymentProcessed
    ) {
      console.log("Initiating Kakao payment approval...", { orderId, pgToken });
      mutate({ orderId, pgToken });
    } else if (!ENABLE_KAKAO_PAYMENTS || !orderId || !pgToken) {
      // If Kakao payments are disabled or no query params, mark as processed
      setPaymentProcessed(true);
      setPaymentSuccess(true);
    }
  }, [orderId, pgToken, paymentProcessed, mutate, isAuthenticated]);

  const showSuccessContent = paymentProcessed && paymentSuccess;
  const showErrorContent = paymentProcessed && !paymentSuccess;

  return (
    <div className="flex flex-col min-h-dvh">
      {/* Top Bar */}
      <TopBar onBack="/" />
      {/* Content area - Takes remaining height, centers content */}
      <div className="flex-grow flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md h-full flex flex-col grow items-stretch justify-stretch">
          <div className="flex flex-col items-center justify-between grow w-full px-4 py-6 gap-4">
            {/* Header section */}
            <div className="flex flex-col gap-2 self-stretch">
              {isPending ? (
                <h1 className="text-2xl font-semibold text-black-700 animate-in slide-in-from-bottom-8 fade-in ease-in-out duration-400">
                  결제 승인 중...
                  <br />
                  <span className="text-primary">잠시만 기다려주세요</span>
                </h1>
              ) : showErrorContent ? (
                <h1 className="text-2xl font-semibold text-black-700 animate-in slide-in-from-bottom-8 fade-in ease-in-out duration-400">
                  결제 승인 실패
                  <br />
                  <span className="text-red-500">다시 시도해주세요</span>
                </h1>
              ) : (
                <h1 className="text-2xl font-semibold text-black-700 animate-in slide-in-from-bottom-8 fade-in ease-in-out duration-400">
                  이용권 충전 완료!
                  <br />
                  <span className="text-primary">시그널을 보낼 수 있어요</span>
                </h1>
              )}
            </div>

            {/* Steps section */}
            <div className="grow flex flex-col w-full gap-4 animate-in slide-in-from-bottom-8 fade-in ease-in-out duration-500">
              <img src={main} alt="Cat Character" className="w-full h-auto" />
            </div>

            {/* Button section */}
            <div className="w-full flex flex-col gap-2">
              <Button
                className="w-full h-14 text-lg font-medium"
                variant={showSuccessContent ? "default" : "secondary"}
                disabled={
                  ENABLE_KAKAO_PAYMENTS &&
                  (!isAuthenticated || isPending || showErrorContent)
                }
                asChild
              >
                {showSuccessContent ? (
                  <Link to="/profile">시그널 보내기</Link>
                ) : isPending ? (
                  "처리 중..."
                ) : showErrorContent ? (
                  "결제 실패"
                ) : (
                  <Link to="/profile">시그널 보내기</Link>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseSuccessPage;
