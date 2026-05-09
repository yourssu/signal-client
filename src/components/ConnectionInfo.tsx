import connectionSignalIcon from "@/assets/icons/connection-signal.svg";
import { cn } from "@/lib/utils";
import React from "react";

interface ConnectionInfoProps {
  count: number;
  visible: boolean;
  className?: string;
}

const ConnectionInfo: React.FC<ConnectionInfoProps> = ({
  count,
  visible,
  className,
}) => {
  const displayCount = `${count}`.padStart(2, "0");

  return (
    <div
      className={cn(
        "bg-static-white border border-[#ffa4d0] rounded-3xl flex items-center justify-center gap-1 px-4 py-3 transition-all duration-500 ease-out",
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-4 pointer-events-none",
        className,
      )}
    >
      <img
        src={connectionSignalIcon}
        alt=""
        className="size-4 shrink-0"
      />
      <p className="caption1 text-primary text-center whitespace-nowrap">
        벌써 {displayCount}명이 시그널로 연결됐어요
      </p>
    </div>
  );
};

export default ConnectionInfo;
