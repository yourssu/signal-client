import React from "react";
import { Link, To } from "react-router";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useViewerSelf } from "@/hooks/queries/viewers";
import { ENABLE_TIMESALE_TOOLTIP } from "@/env";
import userIcon from "@/assets/icons/user_icon.svg";

interface TopBarProps {
  onBack?: To | (() => void);
  hideInfo?: boolean;
  purchaseLink?: string;
}

const TopBar: React.FC<TopBarProps> = ({ onBack, hideInfo, purchaseLink }) => {
  useViewerSelf();
  const handleBack = () => {
    if (typeof onBack === "function") {
      onBack();
    }
  };

  const purchaseLinkEl = purchaseLink ? (
    <Link
      to={purchaseLink}
      className="bg-white border border-gray-200 rounded-full px-2.5 py-1 text-[10px] font-semibold text-[#767a83]"
    >
      이용권 구매
    </Link>
  ) : null;

  return (
    <div className="w-full h-13 pl-2 pr-6 shrink-0 flex justify-end items-center">
      {onBack && (
        <div className="grow flex items-center justify-start">
          {typeof onBack === "function" ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="text-black-700"
            >
              <ChevronLeft />
            </Button>
          ) : (
            <Link
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "text-black-700",
              )}
              to={onBack}
              replace
            >
              <ChevronLeft />
            </Link>
          )}
        </div>
      )}
      {!hideInfo && (
        <div className="flex items-center pt-2 gap-3">
          {purchaseLinkEl &&
            (ENABLE_TIMESALE_TOOLTIP ? (
              <Tooltip open>
                <TooltipTrigger asChild>{purchaseLinkEl}</TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  className="bg-rose-500 text-white border-none"
                  arrowClassName="bg-rose-500 fill-rose-500"
                >
                  타임세일 중!
                </TooltipContent>
              </Tooltip>
            ) : (
              purchaseLinkEl
            ))}
          <Link to="/my">
            <img src={userIcon} alt="User" className="size-9" />
          </Link>
        </div>
      )}
    </div>
  );
};

export default TopBar;
