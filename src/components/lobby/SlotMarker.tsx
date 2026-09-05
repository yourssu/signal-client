import pin from "@/assets/lobby/pin.svg";
import pinPlus from "@/assets/lobby/pin_plus.svg";
import pinShadow from "@/assets/lobby/pin_shadow.svg";
import { formatRemainingTime, getSlotAvatar } from "@/lib/meeting";
import type { MeetingRoomSummaryResponse } from "@/types/meeting";

interface SlotMarkerProps {
  room?: MeetingRoomSummaryResponse | null;
  position: { left: string; top: string };
  onClick: () => void;
}

export default function SlotMarker({
  room,
  position,
  onClick,
}: SlotMarkerProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="absolute flex w-[60px] -translate-x-1/2 flex-col items-center gap-[7px]"
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
        {room && (
          <div className="absolute top-1 right-[-14.94px] rounded-[15.556px] bg-[#ff675c] px-[4.444px] py-[2.222px]">
            <span className="text-static-white text-[12px]">
              {room.partySize}명
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
