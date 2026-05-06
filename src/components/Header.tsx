import React from "react";
import { Link, To } from "react-router";
import { Button, buttonVariants } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useViewerSelf } from "@/hooks/queries/viewers";
import userIcon from "@/assets/icons/user_icon.svg";

interface TopBarProps {
  onBack?: To | (() => void);
  hideInfo?: boolean;
}

const TopBar: React.FC<TopBarProps> = ({ onBack, hideInfo }) => {
  useViewerSelf();
  const handleBack = () => {
    if (typeof onBack === "function") {
      onBack();
    }
  };
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
        <div className="flex items-center pt-2 gap-2">
          <Link to="/my">
            <img src={userIcon} alt="User" className="size-9" />
          </Link>
        </div>
      )}
    </div>
  );
};

export default TopBar;
