import React from "react";
import heartIcon from "@/assets/figma/heart_icon.svg";
import ticketIcon from "@/assets/figma/ticket_icon.svg";
import { To } from "react-router";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

interface TopBarProps {
  heartCount?: number;
  ticketCount?: number;
  onBack?: To | (() => void);
}

const TopBar: React.FC<TopBarProps> = ({
  heartCount = 0,
  ticketCount = 0,
  onBack,
}) => {
  return (
    <div className="w-full h-11 px-6 flex justify-end items-center">
      {onBack && (
        <div className="grow flex items-center justify-start">
          <Button>
            <ChevronLeft />
          </Button>
        </div>
      )}
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-1">
          <div className="w-6 h-6 flex items-center justify-center bg-white rounded-full p-1">
            <img src={heartIcon} alt="Heart" className="w-4 h-4" />
          </div>
          <span className="text-xs font-medium text-black-700">
            {heartCount.toString().padStart(2, "0")}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <div className="w-6 h-6 flex items-center justify-center bg-white rounded-full p-1">
            <img src={ticketIcon} alt="Ticket" className="w-4 h-4" />
          </div>
          <div className="flex items-center">
            <span className="text-xs font-medium text-black-700">
              {ticketCount.toString().padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
