import React from "react";
import ticketIcon from "@/assets/icons/ticket_icon.svg";
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
  const { data: self } = useViewerSelf();
  const ticketCount = (self?.ticket ?? 0) - (self?.usedTicket ?? 0);
  const handleBack = () => {
    if (typeof onBack === "function") {
      onBack();
    }
  };
  return (
    <div className="w-full h-11 pl-2 pr-6 shrink-0 flex justify-end items-center">
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
        <div className="flex items-center gap-2">
          <Link
            to="/purchase"
            className="flex items-center gap-1 bg-white px-4 py-0.5 rounded-full hover:bg-[#FFDFEB] transition-colors"
          >
            <div className="w-6 h-6 flex items-center justify-center rounded-full p-1">
              <img src={ticketIcon} alt="Ticket" className="w-4 h-4" />
            </div>
            <div className="flex items-center">
              <span className="text-xs font-medium text-black-700">
                {ticketCount.toString().padStart(2, "0")}
              </span>
            </div>
          </Link>
          <Link to="/my">
            <img src={userIcon} alt="User" className="size-6" />
          </Link>
        </div>
      )}
    </div>
  );
};

export default TopBar;
