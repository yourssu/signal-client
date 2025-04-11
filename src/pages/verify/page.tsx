import { userUuid } from "@/atoms/userUuid";
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
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">
          프로필 조회 인증
        </h2>

        <div className="mb-8">
          <p className="text-center text-gray-600 mb-4">
            아래 4자리 인증번호를 확인해주세요
          </p>
          <div className="text-4xl font-bold text-center p-4 bg-gray-100 rounded-lg">
            {isLoading ? "로드 중" : verificationCode ?? "인증 오류"}
          </div>
        </div>

        <div className="space-y-4">
          {/* {error && <p className="text-red-500 text-sm text-center">{error}</p>} */}

          <button
            onClick={handleVerify}
            className="w-full py-3 px-6 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
                    transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            인증 완료
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileVerificationPage;
