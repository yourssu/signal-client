import React from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import TopBar from "@/components/TopBar";
import main from "@/assets/home/main.png";

const PurchaseFailPage: React.FC = () => {
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
              <h1 className="text-2xl font-semibold text-black-700 animate-in slide-in-from-bottom-8 fade-in ease-in-out duration-400">
                결제 승인 실패
                <br />
                <span className="text-red-500">다시 시도해주세요</span>
              </h1>
            </div>

            {/* Steps section */}
            <div className="grow flex flex-col w-full gap-4 animate-in slide-in-from-bottom-8 fade-in ease-in-out duration-500">
              <img src={main} alt="Cat Character" className="w-full h-auto" />
            </div>

            {/* Button section */}
            <div className="w-full flex flex-col gap-2">
              <Button
                className="w-full h-14 text-lg font-medium"
                variant={"default"}
                asChild
              >
                <Link to="/purchase">다시 시도하기</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseFailPage;
