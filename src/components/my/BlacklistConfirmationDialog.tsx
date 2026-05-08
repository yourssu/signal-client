import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { myprofileLockCheckClick } from "@/lib/analytics";

interface BlacklistConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm?: () => void;
  userId?: string | number;
}

export function BlacklistConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
  userId,
}: BlacklistConfirmationDialogProps) {
  const handleConfirm = () => {
    if (onConfirm) {
      if (userId) myprofileLockCheckClick(userId);
      onConfirm();
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white rounded-3xl pt-5 pb-4 px-5 flex flex-col items-center gap-3">
        <div className="flex flex-col items-center gap-2">
          <DialogTitle className="text-xl font-semibold text-neutral-600 text-center">
            비공개 처리
          </DialogTitle>
          <DialogDescription className="text-base font-medium text-neutral-400 text-center leading-snug">
            더 이상 연락이 오지 않아요!
            <br />
            정말 프로필을 비공개 처리하시겠어요?
          </DialogDescription>
        </div>
        <div className="flex gap-2">
          <DialogClose asChild>
            <Button variant="default" size="lg" className="w-[130px] rounded-xl">
              취소
            </Button>
          </DialogClose>
          <Button
            variant="secondary"
            size="lg"
            className="w-[130px] rounded-xl"
            onClick={handleConfirm}
          >
            확인
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
