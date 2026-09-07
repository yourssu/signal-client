import ConfirmDialog from "@/components/lobby/ConfirmDialog";

interface ProfileRequiredDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ProfileRequiredDialog({
  open,
  onOpenChange,
}: ProfileRequiredDialogProps) {
  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title={
        <>
          방 생성(=방장)은
          <br />
          프로필 등록이 필요해요
        </>
      }
      description="아래 버튼을 누르면 바로 등록할 수 있어요"
      cancelLabel="취소"
      confirmLabel="프로필 등록하기"
      confirmHref="/profile/register"
    />
  );
}
