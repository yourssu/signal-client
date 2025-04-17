import { Button } from "@/components/ui/button";

interface VerifyStepProps {
  isLoading: boolean;
  verificationCode: number | null;
  onVerify: () => void;
}

export const VerifyStep = ({
  onVerify,
  isLoading,
  verificationCode,
}: VerifyStepProps) => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-4 gap-12">
      <h2 className="text-2xl font-medium text-center mb-6">
        결제 후 STAFF에게
        <br />
        아래 화면을 보여주세요
      </h2>

      <div className="mb-8">
        <div className="text-6xl font-bold text-center p-4 bg-gray-100 rounded-lg tracking-widest">
          {isLoading
            ? "로드 중"
            : verificationCode?.toString().padStart(4, "0") ?? "인증 오류"}
        </div>
      </div>

      <div className="space-y-4 w-full">
        {/* {error && <p className="text-red-500 text-sm text-center">{error}</p>} */}

        <Button onClick={onVerify} size="xl" className="w-full">
          인증 완료
        </Button>
      </div>
    </div>
  );
};
