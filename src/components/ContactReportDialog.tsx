import ConfirmDialog from "@/components/ConfirmDialog";

interface ContactReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  confirmDisabled?: boolean;
}

export default function ContactReportDialog({
  open,
  onOpenChange,
  onConfirm,
  confirmDisabled,
}: ContactReportDialogProps) {
  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="잘못 등록된 연락처인가요?"
      description={
        <>
          타인의 계정이거나
          <br />
          임의로 등록한 연락처를 제보할 수 있어요
        </>
      }
      cancelLabel="나가기"
      confirmLabel="제보하기"
      onConfirm={onConfirm}
      confirmDisabled={confirmDisabled}
    />
  );
}
