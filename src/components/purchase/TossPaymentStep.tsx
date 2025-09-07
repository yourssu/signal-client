import { PRIVACY, TERMS } from "@/env";
import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import TermsDrawer from "@/components/TermsDrawer";

interface TossPaymentStepProps {
  isChecking: boolean;
  onStartCheck: () => void;
  onEndCheck: () => void;
}

const TIMEOUT_DURATION = 15;

export const TossPaymentStep = ({
  isChecking,
  onStartCheck,
  onEndCheck,
}: TossPaymentStepProps) => {
  const [remainingTime, setRemainingTime] = useState(TIMEOUT_DURATION);
  const [openTerms, setOpenTerms] = useState(false); // State to track terms modal
  const [openPrivacy, setOpenPrivacy] = useState(false); // State to track privacy modal
  const [checkFailed, setCheckFailed] = useState(false); // State to track check failure
  const timerRef = useRef<number | null>(null); // Ref to store the timer ID

  const startTimer = useCallback(() => {
    timerRef.current = window.setInterval(() => {
      setRemainingTime((prev) => prev - 1);
    }, 1000);
  }, [setRemainingTime]);

  const endTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    if (isChecking && remainingTime > 0 && timerRef.current === null) {
      startTimer();
    } else if (remainingTime === 0) {
      if (timerRef.current) endTimer();
      onEndCheck();
      setCheckFailed(true);
      setRemainingTime(TIMEOUT_DURATION);
    }
  }, [isChecking, onEndCheck, remainingTime, startTimer]);

  const handleOpenTerms = () => {
    setOpenTerms(true);
  };

  const handleOpenPrivacy = () => {
    setOpenPrivacy(true);
  };

  const handleStartCheck = () => {
    onStartCheck();
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
          토스에서 송금을 완료했다면
          <br />
          <span className="text-primary">완료 버튼을 눌러주세요</span>
        </h1>
      </div>

      {/* Steps section */}
      <div className="flex flex-col w-full gap-4 animate-in slide-in-from-bottom-8 fade-in ease-in-out duration-500">
        {/* Terms notice */}
        <p className="text-xs text-center mb-2">
          결제 진행 시, '시그널'{" "}
          <a onClick={handleOpenTerms} className="underline cursor-pointer">
            서비스 이용약관
          </a>
          과<br />
          <a onClick={handleOpenPrivacy} className="underline cursor-pointer">
            개인정보 처리방침
          </a>
          에 동의하는 것으로 간주됩니다.
        </p>
      </div>

      {/* Button section */}
      <div className="w-full flex flex-col gap-2">
        {isChecking && (
          <div className="flex flex-col gap-2 mb-4 animate-in slide-in-from-bottom-8 fade-in ease-in-out duration-300">
            <div className="flex items-center justify-between">
              <span className="text-sm text-stone-600">자동 확인 중...</span>
              <span className="text-sm text-stone-600">
                {remainingTime}초 남음
              </span>
            </div>
            <Progress
              value={(remainingTime / TIMEOUT_DURATION) * 100}
              className="h-1"
            />
          </div>
        )}
        <Button
          onClick={handleStartCheck}
          disabled={isChecking}
          className="w-full h-14 text-lg font-medium"
          variant="default"
        >
          {isChecking ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              송금 확인 중...
            </>
          ) : checkFailed ? (
            "재확인"
          ) : (
            "송금완료"
          )}
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
    </div>
  );
};
