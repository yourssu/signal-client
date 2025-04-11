import { userUuid } from "@/atoms/userUuid";
import { Button } from "@/components/ui/button";
import { useViewerVerification } from "@/queries/viewer";
import { useAtom } from "jotai";
import React, { useMemo } from "react";
import { useNavigate } from "react-router";

const ProfileVerificationPage: React.FC = () => {
  const navigate = useNavigate();
  const [uuid] = useAtom(userUuid);
  const { data, isLoading } = useViewerVerification(uuid);
  const verificationCode: number | null = useMemo(
    () => Number(data?.verificationCode ?? null) || null,
    [data]
  );
  // const { data: viewer } = useViewerMe(uuid); TODO: auto refetech viewer info when real endpoint is ready

  const handleVerify = () => {
    navigate("/profile");
  };

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

        <Button onClick={handleVerify} size="xl" className="w-full">
          인증 완료
        </Button>
      </div>
    </div>
  );
};

export default ProfileVerificationPage;
