import { Button } from "@/components/ui/button";
import RoomStepper from "@/components/meeting/status/RoomStepper";

interface RoomExpiredSheetProps {
  open: boolean;
  onConfirm: () => void;
}

export default function RoomExpiredSheet({
  open,
  onConfirm,
}: RoomExpiredSheetProps) {
  if (!open) return null;

  return (
    <div className="flex w-full flex-col gap-5 rounded-[20px] bg-white p-5 drop-shadow-[1px_1px_4px_rgba(0,0,0,0.25)]">
      <div className="flex w-full flex-col gap-2">
        <p className="h3 text-label-strong">방이 사라졌어요</p>
        <p className="body2 bg-primary-light text-primary rounded-lg p-3">
          아쉽지만 지금 열려 있는 다른 미팅에 참여해보세요
        </p>
      </div>

      <RoomStepper state="failed" />

      <Button onClick={onConfirm} size="xl" className="w-full">
        확인
      </Button>
    </div>
  );
}

export type { RoomExpiredSheetProps };
