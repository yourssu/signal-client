import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import TopBar from "@/components/TopBar";

const imgU1582974531A3DMinimalFloatingCatFairyCharacterWhiteA9E4C2D54Eccd419DAcf3D1De65C8D05F01 =
  "http://localhost:3845/assets/1c00f48c844ae173bfed694dda3a35840a04a428.png";

const PurchaseSuccessPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Auto redirect after 10 seconds if no user interaction
    const timer = setTimeout(() => {
      navigate("/profile", { replace: true });
    }, 10000);

    return () => clearTimeout(timer);
  }, [navigate]);

  const handleSendSignal = () => {
    navigate("/profile", { replace: true });
  };

  const handleBack = () => {
    navigate("/", { replace: true });
  };

  return (
    <div className="bg-gradient-to-b from-[#fff2f7] to-[#ffd4e4] relative size-full min-h-dvh">
      {/* Top Bar */}
      <TopBar onBack={handleBack} />

      {/* Main Content */}
      <div className="flex flex-col gap-2.5 h-[calc(100vh-41.28px)] items-center justify-start px-0 py-[33px]">
        <div className="flex-1 flex flex-col gap-5 items-center justify-start w-[315px] max-w-full px-4">
          {/* Content Section */}
          <div className="flex flex-col gap-[30px] items-center justify-start w-full">
            {/* Title Section */}
            <div className="flex flex-col gap-2.5 items-start justify-start w-full">
              <div className="flex flex-col gap-[7px] items-start justify-start w-full">
                <h1 className="font-['Pretendard:SemiBold',_sans-serif] leading-[1.3] text-[#44403b] text-[24px] tracking-[-0.24px]">
                  이용권 충전 완료!
                  <br />
                  <span className="text-[#ee518a]">
                    시그널을 보낼 수 있어요
                  </span>
                </h1>
              </div>
            </div>

            {/* Character Image */}
            <div
              className="bg-center bg-cover bg-no-repeat shrink-0 size-[193px]"
              style={{
                backgroundImage: `url('${imgU1582974531A3DMinimalFloatingCatFairyCharacterWhiteA9E4C2D54Eccd419DAcf3D1De65C8D05F01}')`,
              }}
            />
          </div>
        </div>

        {/* Bottom Action Section */}
        <div className="flex flex-col gap-2.5 h-[83px] items-center justify-end">
          <div className="flex flex-col gap-[11px] items-center justify-start">
            <div className="flex gap-[13px] h-14 items-center justify-center w-[350px] max-w-full px-4">
              <Button
                onClick={handleSendSignal}
                className="flex-1 bg-[#ee518a] hover:bg-[#ee518a]/90 h-14 items-center justify-center px-4 rounded-[16px] text-white font-['Pretendard:Medium',_sans-serif] text-[18px] tracking-[-0.18px]"
              >
                시그널 보내기
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseSuccessPage;
