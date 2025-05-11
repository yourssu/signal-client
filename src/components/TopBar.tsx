import React from "react";
import heartIcon from "@/assets/icons/heart_icon.svg";
import ticketIcon from "@/assets/icons/ticket_icon.svg";
import { Link, To } from "react-router";
import { Button, buttonVariants } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAtomValue } from "jotai";
import { savedProfilesAtom } from "@/atoms/viewerProfiles";
import { useViewerSelf } from "@/hooks/queries/viewers";
import { useUserUuid } from "@/hooks/useUserUuid";

interface TopBarProps {
  onBack?: To | (() => void);
}

const TopBar: React.FC<TopBarProps> = ({ onBack }) => {
  const uuid = useUserUuid();
  const savedProfiles = useAtomValue(savedProfilesAtom);
  const heartCount = savedProfiles.length;
  const { data: self } = useViewerSelf(uuid);
  const ticketCount = (self?.ticket ?? 0) - (self?.usedTicket ?? 0);
  const handleBack = () => {
    if (typeof onBack === "function") {
      onBack();
    }
  };
  return (
    <div className="w-full h-11 pl-2 pr-6 flex justify-end items-center">
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
            >
              <ChevronLeft />
            </Link>
          )}
        </div>
      )}
      <div className="flex items-center gap-5">
        {heartCount > 0 ? (
          <Link to="/profile/saved" className="flex items-center gap-1">
            <div className="w-6 h-6 flex items-center justify-center rounded-full p-1">
              <img src={heartIcon} alt="Heart" className="w-4 h-4" />
            </div>
            <span className="text-xs font-medium text-black-700">
              {heartCount.toString().padStart(2, "0")}
            </span>
          </Link>
        ) : (
          <div className="flex items-center gap-1">
            <div className="w-6 h-6 flex items-center justify-center rounded-full p-1">
              <img src={heartIcon} alt="Heart" className="w-4 h-4" />
            </div>
            <span className="text-xs font-medium text-black-700">
              {heartCount.toString().padStart(2, "0")}
            </span>
          </div>
        )}

        <Link to="/verify" className="flex items-center gap-1">
          <div className="w-6 h-6 flex items-center justify-center rounded-full p-1">
            <img src={ticketIcon} alt="Ticket" className="w-4 h-4" />
          </div>
          <div className="flex items-center">
            <span className="text-xs font-medium text-black-700">
              {ticketCount.toString().padStart(2, "0")}
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default TopBar;
