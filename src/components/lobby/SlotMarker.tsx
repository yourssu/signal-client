import pin from "@/assets/lobby/pin.svg";
import pinPlus from "@/assets/lobby/pin_plus.svg";
import pinShadow from "@/assets/lobby/pin_shadow.svg";
import { formatRemainingTime, getSlotAvatar } from "@/lib/meeting";
import { cn } from "@/lib/utils";
import type { MeetingRoomSummaryResponse } from "@/types/meeting";

interface SlotMarkerProps {
  room?: MeetingRoomSummaryResponse | null;
  position: { left: string; top: string };
  /**
   * 인원 필터에 걸리는 방인지. null이면 필터를 걸지 않은 상태다.
   * true면 인원 배지 대신 "가능"을 달고, false면 마커 전체를 흐린다.
   */
  matchesFilter?: boolean | null;
  onClick: () => void;
}

export default function SlotMarker({
  room,
  position,
  matchesFilter = null,
  onClick,
}: SlotMarkerProps) {
  const isDimmed = matchesFilter === false;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "absolute flex w-[60px] -translate-x-1/2 flex-col items-center gap-[7px] transition-opacity",
        isDimmed && "opacity-40",
      )}
      style={{ left: position.left, top: position.top }}
    >
      <div className="relative h-[72px] w-[60px] drop-shadow-[1px_2px_2px_rgba(0,0,0,0.12)]">
        {room && (
          <img
            src={pinShadow}
            alt=""
            className="absolute top-[61px] left-1/2 h-4 w-[60px] -translate-x-1/2"
          />
        )}
        <img src={pin} alt="" className="absolute inset-0 size-full" />
        {room ? (
          <img
            src={getSlotAvatar(room)}
            alt=""
            className="absolute top-1 left-1/2 size-[50px] -translate-x-1/2"
          />
        ) : (
          <div className="absolute top-1 left-1/2 size-[50px] -translate-x-1/2 rounded-full bg-[#d5d5d5]">
            <img src={pinPlus} alt="" className="absolute inset-[38.65%]" />
          </div>
        )}
        {room && matchesFilter !== false && (
          <div className="absolute top-1 right-[-14.94px] flex items-center justify-center rounded-[15.556px] bg-[#ff675c] px-[4.444px] py-[2.222px]">
            <span className="caption1 text-static-white leading-[1.2] whitespace-nowrap">
              {matchesFilter ? "가능" : `${room.partySize}명`}
            </span>
          </div>
        )}
      </div>
      <span className="caption1 text-label-normal">
        {room ? formatRemainingTime(room.expiresAt) : "방 생성"}
      </span>
    </button>
  );
}
