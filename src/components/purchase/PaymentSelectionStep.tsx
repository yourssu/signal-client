import mainCharacter from "@/assets/home/main.png";
import TermsDrawer from "@/components/TermsDrawer";
import { Button } from "@/components/ui/button";
import {
  ACCOUNT_BANK,
  ACCOUNT_NO,
  ACCOUNT_OWNER,
  ENABLE_KAKAO_PAYMENTS,
  PRIVACY,
  TERMS,
} from "@/env";
import { cn, getDeviceType, tossSendUrl } from "@/lib/utils";
import { Package } from "@/types/viewer";
import { ShieldCheck } from "lucide-react";
import { useState } from "react";

interface PaymentSelectionStepProps {
  pkg?: Package;
  verificationCode: number | null;
  isOnSale: boolean;
  onSelect: (method: string) => void;
}

const PaymentSelectionStep: React.FC<PaymentSelectionStepProps> = ({
  pkg,
  verificationCode,
  isOnSale,
  onSelect,
}) => {
  const price = isOnSale ? pkg?.price[0] : pkg?.price[1];
  const deviceType = getDeviceType();
  const [openTerms, setOpenTerms] = useState(false); // State to track terms modal
  const [openPrivacy, setOpenPrivacy] = useState(false); // State to track privacy modal

  const handleOpenTerms = () => {
    setOpenTerms(true);
  };

  const handleOpenPrivacy = () => {
    setOpenPrivacy(true);
  };

  return (
    <div className="flex flex-col gap-4 items-stretch px-4 py-6 w-full">
      {/* Progress and Title Section */}
      <div className="flex flex-col gap-2">
        {/* Progress indicator */}
        <p className="text-black-600 text-xs font-normal animate-in slide-in-from-bottom fade-in ease-in-out duration-300">
          2 / 3
        </p>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-black-700 leading-[1.3em] animate-in slide-in-from-bottom-8 fade-in ease-in-out duration-400">
          결제 수단을
          <br />
          <span className="text-primary">선택해주세요</span>
        </h2>
      </div>

      {/* Character and Package Options */}
      <div className="flex flex-col items-center gap-2 w-full animate-in slide-in-from-bottom-8 fade-in ease-in-out duration-500">
        {/* Character Image */}
        <div className="size-[160px] rounded-full overflow-hidden">
          <img
            src={mainCharacter}
            alt="캐릭터"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Package Options */}
        <div className="flex flex-col gap-3 w-full">
          {ENABLE_KAKAO_PAYMENTS && (
            <Button
              className="w-full h-14 text-lg bg-kakao-yellow hover:bg-kakao-yellow/90 text-black-700"
              onClick={() => onSelect("kakao")}
            >
              카카오페이로 송금하기
            </Button>
          )}
          <Button
            className="w-full h-14 text-lg text-primary"
            variant="secondary"
            onClick={() => onSelect("bank")}
          >
            직접 계좌로 입금하기
          </Button>
          <Button
            disabled={!price || !verificationCode}
            className={cn(
              "w-full h-14 text-lg bg-toss-blue hover:bg-toss-blue/90",
              deviceType === "desktop" && "hidden",
            )}
            onClick={() => onSelect("toss")}
            asChild
          >
            <a
              href={tossSendUrl(price!, verificationCode!)}
              target="_blank"
              rel="noopener noreferrer"
            >
              토스로 송금하기
            </a>
          </Button>
          <p
            className={cn(
              "text-xs text-gray-500 flex items-center gap-1",
              deviceType === "desktop" && "hidden",
            )}
          >
            <ShieldCheck className="inline size-3" />
            토스 송금 정보 | {ACCOUNT_BANK} {ACCOUNT_NO} {ACCOUNT_OWNER}
          </p>
          {/* Terms notice */}
          <p className="text-xs text-center mt-8">
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

export default PaymentSelectionStep;
