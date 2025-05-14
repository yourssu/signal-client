import { userGenderAtom } from "@/atoms/userGender";
import { cn } from "@/lib/utils";
import { useAtomValue } from "jotai";
import { Copy } from "lucide-react";
import { toast } from "sonner";

const ACCOUNT: string =
  import.meta.env.VITE_ACCOUNT ?? "카카오뱅크 034353566343";
const ACCOUNT_OWNER: string = import.meta.env.VITE_ACCOUNT_OWNER ?? "유어슈";

interface VerifyStepProps {
  isLoading: boolean;
  verificationCode: number | null;
  onManualCheck: () => void;
}

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

export const VerifyStep = ({
  isLoading,
  verificationCode,
  onManualCheck,
}: VerifyStepProps) => {
  const gender = useAtomValue(userGenderAtom);
  const digits = getCodeDigits(verificationCode, isLoading);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(ACCOUNT).then(() => {
      toast.success("계좌번호가 복사되었습니다.");
    });
  };

  const handleManualCheck = () => {
    onManualCheck();
  };
  return (
    // Main container matching Figma's Frame 1000011868 structure (approximated)
    <div className="flex flex-col items-center grow w-full max-w-sm mx-auto py-8 px-4 gap-8">
      {/* Text content block */}
      <div className="flex flex-col items-center gap-1 text-center">
        {/* Title - Using style from 1544:2063 */}
        <h1 className="text-2xl font-semibold text-primary">
          시그널을 이용하시겠어요?
        </h1>
        <h2 className="text-2xl font-semibold text-stone-600 whitespace-pre-line">
          아래의 코드로 입금자명을
          <br />
          설정하여 입금해주세요.
        </h2>
      </div>

      {/* Verification Code and Bank Info Block */}
      <div className="flex flex-col items-center justify-center gap-5 w-full grow">
        {/* Code Boxes - Based on Frame 1000011942 */}
        <div className="flex justify-center items-center gap-2">
          {digits.map((digit, index) => (
            // Individual digit box - Based on Frame 1000011938 etc.
            <div
              key={index}
              className="flex justify-center items-center bg-white/60 rounded-lg w-[60px] h-[60px] shadow-sm" // Adjusted size, bg-white/60 for rgba(255, 255, 255, 0.6)
            >
              {/* Digit text - Based on style 1544:2043 */}
              <span
                className={cn(
                  "text-4xl font-medium",
                  gender === "MALE" ? "text-blue" : "text-primary",
                )}
              >
                {digit}
              </span>
            </div>
          ))}
        </div>
        {/* Bank Account Info - Based on 1544:2058 */}
        <p className="text-lg font-medium text-neutral-700">
          <a
            href="#"
            className="inline-flex items-baseline gap-2"
            onClick={copyToClipboard}
          >
            <Copy className="size-3 inline" />
            <span className="underline">{ACCOUNT}</span>
          </a>
          {` ${ACCOUNT_OWNER}`}
        </p>
        <p className="text-sm text-center">
          입금이 완료되면 자동으로 화면이 이동됩니다.
          <br />
          이동되지 않는다면{" "}
          <a onClick={handleManualCheck} className="underline cursor-pointer">
            여기를 눌러주세요
          </a>
          .
        </p>
      </div>
    </div>
  );
};
