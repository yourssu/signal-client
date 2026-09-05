import { useCallback, useEffect, useRef, useState } from "react";
import RoomStepper from "@/components/meeting/status/RoomStepper";

interface RoomWaitingSheetProps {
  open: boolean;
  expiresAt: string;
  onCancel: () => void;
}

const formatCountdown = (remainingMs: number) => {
  const totalSeconds = Math.max(0, Math.round(remainingMs / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

export default function RoomWaitingSheet({
  open,
  expiresAt,
  onCancel,
}: RoomWaitingSheetProps) {
  const [remainingMs, setRemainingMs] = useState(
    () => new Date(expiresAt).getTime() - Date.now(),
  );
  const timerRef = useRef<number | null>(null);

  const endTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!open) {
      endTimer();
      return;
    }

    setRemainingMs(new Date(expiresAt).getTime() - Date.now());
    timerRef.current = window.setInterval(() => {
      setRemainingMs(new Date(expiresAt).getTime() - Date.now());
    }, 1000);

    return endTimer;
  }, [open, expiresAt, endTimer]);

  if (!open) return null;

  return (
    <div className="flex w-full flex-col gap-5 rounded-[20px] bg-white p-5 drop-shadow-[1px_1px_4px_rgba(0,0,0,0.25)]">
      <div className="flex flex-col gap-1">
        <p className="caption1 text-label-assistive">상대 팀 모집까지</p>
        <p className="h3 text-label-strong">{formatCountdown(remainingMs)}</p>
      </div>

      <RoomStepper state="recruiting" />

      <button
        type="button"
        onClick={onCancel}
        className="caption2 text-label-assistive self-end underline"
      >
        방 삭제
      </button>
    </div>
  );
}

export type { RoomWaitingSheetProps };
