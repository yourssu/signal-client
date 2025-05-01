import { userGender } from "@/atoms/userGender";
import { cn } from "@/lib/utils";
import { useAtomValue } from "jotai";

interface VerifyStepProps {
  isLoading: boolean;
  verificationCode: number | null;
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
}: VerifyStepProps) => {
  const gender = useAtomValue(userGender);
  const digits = getCodeDigits(verificationCode, isLoading);

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
          {"입금 후, 유어슈 STAFF에게\n화면을 보여주세요"}
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
                  gender === "MALE" ? "text-blue" : "text-primary"
                )}
              >
                {digit}
              </span>
            </div>
          ))}
        </div>
        {/* Bank Account Info - Based on 1544:2058 */}
        <p className="text-lg font-medium text-neutral-700">
          카카오뱅크 034353566343 유어슈
        </p>
      </div>
    </div>
  );
};
