import ConfirmDialog from "@/components/lobby/ConfirmDialog";

interface RoomDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  confirmDisabled?: boolean;
}

export default function RoomDeleteDialog({
  open,
  onOpenChange,
  onConfirm,
  confirmDisabled,
}: RoomDeleteDialogProps) {
  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="방을 삭제할까요?"
      description="삭제하면 미팅 모집이 바로 종료돼요"
      cancelLabel="나가기"
      confirmLabel="삭제"
      onConfirm={onConfirm}
      confirmDisabled={confirmDisabled}
    />
  );
}
