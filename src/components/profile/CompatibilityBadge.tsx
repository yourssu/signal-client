import heartIcon from "@/assets/icons/heart_icon.svg";
import { cn } from "@/lib/utils";
import React from "react";

interface CompatibilityBadgeProps {
  label: string;
  className?: string;
}

const CompatibilityBadge: React.FC<CompatibilityBadgeProps> = ({
  label,
  className,
}) => {
  return (
    <div
      className={cn(
        "bg-[#f7f7f7] rounded-xl flex items-center gap-1 px-4 py-4",
        className,
      )}
    >
      <div className="flex items-center gap-1 shrink-0">
        <img src={heartIcon} alt="" className="size-4" />
        <p className="caption1 text-[#ff449e] whitespace-nowrap">
          찰떡 궁합 PICK
        </p>
      </div>
      <p className="caption1 text-[#767a83] whitespace-nowrap truncate">
        {label}
      </p>
    </div>
  );
};

export default CompatibilityBadge;
