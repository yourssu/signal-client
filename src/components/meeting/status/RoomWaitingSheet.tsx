import { useCallback, useEffect, useRef, useState } from "react";
import RoomStepper from "@/components/meeting/status/RoomStepper";
import { MEETING_ROOM_EXPIRY_WARNING_MS } from "@/lib/meeting";

interface RoomWaitingSheetProps {
  open: boolean;
  expiresAt: string;
  onCancel: () => void;
  onExpire?: () => void;
}

const formatCountdown = (remainingMs: number) => {
  const totalSeconds = Number.isFinite(remainingMs)
    ? Math.max(0, Math.round(remainingMs / 1000))
    : 0;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

export default function RoomWaitingSheet({
  open,
  expiresAt,
  onCancel,
  onExpire,
}: RoomWaitingSheetProps) {
  const [remainingMs, setRemainingMs] = useState(
    () => new Date(expiresAt).getTime() - Date.now(),
  );
  const timerRef = useRef<number | null>(null);
  const expiredRef = useRef(false);
  const onExpireRef = useRef(onExpire);

  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

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

    expiredRef.current = false;

    const tick = () => {
      const next = new Date(expiresAt).getTime() - Date.now();
      setRemainingMs(next);
      if (!Number.isFinite(next) || next > 0 || expiredRef.current) return;
      expiredRef.current = true;
      endTimer();
      onExpireRef.current?.();
    };

    timerRef.current = window.setInterval(tick, 1000);
    tick();

    return endTimer;
  }, [open, expiresAt, endTimer]);

  if (!open) return null;

  return (
    <div className="flex w-full flex-col gap-5 rounded-[20px] bg-white p-5 drop-shadow-[1px_1px_4px_rgba(0,0,0,0.25)]">
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-1">
          <p className="caption1 text-label-assistive">상대 팀 모집까지</p>
          <p className="h3 text-label-strong">{formatCountdown(remainingMs)}</p>
        </div>
        {remainingMs > 0 && remainingMs <= MEETING_ROOM_EXPIRY_WARNING_MS && (
          <p className="body2 bg-primary-light text-primary rounded-lg p-3">
            곧 방이 자동으로 종료돼요
          </p>
        )}
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
