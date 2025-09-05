import { userGenderAtom } from "@/atoms/userGender";
import { ACCOUNT_BANK, ACCOUNT_NO, ACCOUNT_OWNER, PRIVACY, TERMS } from "@/env";
import { cn } from "@/lib/utils";
import { useAtomValue } from "jotai";
import { Copy, Loader2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import TermsDrawer from "@/components/TermsDrawer";
import { RenameRequestDrawer } from "./RenameRequestDrawer";
import { Package } from "@/types/viewer";

interface BankAccountPaymentStepProps {
  pkg: Package;
  isLoading: boolean;
  isChecking: boolean;
  isOnSale: boolean;
  verificationCode: number | null;
  onStartCheck: () => void;
  onEndCheck: () => void;
  onRenameRequested: (name: string) => void;
}

const TIMEOUT_DURATION = 15;

// Helper function to split the code into digits or return placeholders
const getCodeDigits = (code: number | null, loading: boolean): string[] => {
  if (loading) {
    return ["·", "·", "·", "·"]; // Use dots or similar for loading state
  }
  if (code === null || isNaN(code)) {
    return ["-", "-", "-", "-"]; // Use dashes for error/null state
  }
  return code.toString().padStart(4, "0").split("");
};

const tossSendUrl = (amount: number, msg: number | null) =>
  `supertoss://send?bank=${encodeURIComponent(ACCOUNT_BANK)}&accountNo=${ACCOUNT_NO}&amount=${amount}&msg=${msg}`;

export const BankAccountPaymentStep = ({
  isLoading,
  isChecking,
  isOnSale,
  pkg,
  verificationCode,
  onStartCheck,
  onEndCheck,
  onRenameRequested,
}: BankAccountPaymentStepProps) => {
  const gender = useAtomValue(userGenderAtom);
  const digits = getCodeDigits(verificationCode, isLoading);
  const [remainingTime, setRemainingTime] = useState(TIMEOUT_DURATION);
  const [openTerms, setOpenTerms] = useState(false); // State to track terms modal
  const [openPrivacy, setOpenPrivacy] = useState(false); // State to track privacy modal
  const [openRenameDrawer, setOpenRenameDrawer] = useState(false); // State to track rename drawer
  const [checkFailed, setCheckFailed] = useState(false); // State to track check failure
  const timerRef = useRef<number | null>(null); // Ref to store the timer ID
  const price = isOnSale ? pkg.price[0] : pkg.price[1];
  const quantity = isOnSale ? pkg.quantity[0] : pkg.quantity[1];

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

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${ACCOUNT_BANK} ${ACCOUNT_NO}`).then(() => {
      toast.success("계좌번호가 복사되었습니다.");
    });
  };

  const handleOpenTerms = () => {
    setOpenTerms(true);
  };

  const handleOpenPrivacy = () => {
    setOpenPrivacy(true);
  };

  const handleStartCheck = () => {
    onStartCheck();
  };

  const handleRenameRequested = (name: string) => {
    if (name.length > 0) {
      onRenameRequested(name);
    } else {
      toast.error("입금자명을 입력해주세요.");
    }
  };

  return (
    // Main container matching Figma's design
    <div className="flex flex-col items-center justify-between grow w-full px-4 py-6 gap-4">
      {/* Header section */}
      <div className="flex flex-col gap-2 self-stretch">
        <p className="text-xs text-black-600 font-normal animate-in slide-in-from-bottom fade-in ease-in-out duration-300">
          2 / 2
        </p>
        <h1 className="text-2xl font-semibold text-black-700 animate-in slide-in-from-bottom-8 fade-in ease-in-out duration-400">
          천천히 안내를 따르면
          <br />
          <span className="text-primary">금방 시그널을 보낼 수 있어요!</span>
        </h1>
      </div>

      {/* Steps section */}
      <div className="flex flex-col w-full gap-4 animate-in slide-in-from-bottom-8 fade-in ease-in-out duration-500">
        <div className="flex flex-col gap-2">
          <Button
            className="w-full h-14 text-lg bg-toss-blue hover:bg-toss-blue/90"
            asChild
          >
            <a href={tossSendUrl(price, verificationCode)}>토스로 송금하기</a>
          </Button>
          <p className="text-center text-sm font-medium text-black-600">OR</p>
        </div>
        {/* Step 1: Account copy */}
        <div className="flex flex-col gap-2">
          <h2 className="text-sm font-medium text-black-700">
            Step 1. 계좌 복사
          </h2>
          <div className="bg-pink-50 border border-primary/20 rounded-lg p-4 flex items-center">
            <p className="grow text-sm font-medium text-black-600">
              <span
                className="underline cursor-pointer"
                onClick={copyToClipboard}
              >
                {ACCOUNT_BANK} {ACCOUNT_NO}
              </span>
              {` ${ACCOUNT_OWNER}`}
            </p>
            <Button
              size="icon"
              variant="ghost"
              onClick={copyToClipboard}
              className="p-2 rounded-full"
            >
              <Copy className="size-4" />
            </Button>
          </div>
        </div>

        {/* Step 2: Verification code */}
        <div className="flex flex-col gap-2">
          <h2 className="text-sm font-medium text-black-700">
            Step 2. 입금자명 설정
          </h2>
          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium text-primary">
              ⚠️ 아래 숫자를 '받는 분 통장 표시'에 입력해야 자동 충전돼요
            </p>
            <div className="bg-pink-50 border border-primary/20 rounded-lg p-2 flex items-center justify-center">
              <span
                className={cn(
                  "text-xl font-medium",
                  gender === "MALE" ? "text-blue" : "text-primary",
                )}
              >
                {digits.join("")}
              </span>
            </div>
          </div>
        </div>

        {/* Step 3: Amount confirmation */}
        <div className="flex flex-col gap-2">
          <h2 className="text-sm font-medium text-black-700">
            Step 3. 금액 확인
          </h2>
          <p className="bg-pink-50 border border-primary/20 rounded-lg p-4 text-center font-medium">
            송금할 금액:{" "}
            <span className="text-primary">
              <span>{price.toLocaleString()}원 </span>
              <span className="text-xs">({quantity}개)</span>
            </span>
          </p>
        </div>
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
        {checkFailed && !isChecking && (
          <p
            className="text-sm text-primary font-medium underline text-center animate-in slide-in-from-bottom-8 fade-in ease-in-out duration-300 cursor-pointer"
            onClick={() => setOpenRenameDrawer(true)}
          >
            입금자명을 잘못 설정했나요?
          </p>
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
      <RenameRequestDrawer
        open={openRenameDrawer}
        onOpenChange={setOpenRenameDrawer}
        onConfirm={handleRenameRequested}
      />
    </div>
  );
};
