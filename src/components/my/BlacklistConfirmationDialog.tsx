import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { buttonClick } from "@/lib/analytics";

interface BlacklistConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm?: () => void;
}

export function BlacklistConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
}: BlacklistConfirmationDialogProps) {
  const handleConfirm = () => {
    if (onConfirm) {
      buttonClick("confirm_add_blacklist", "프로필 비공개 확인");
      onConfirm();
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background p-6 flex flex-col items-center">
        <DialogHeader className="w-full text-center space-y-2">
          <DialogTitle className="text-xl font-bold text-center">
            프로필을 비공개 하시겠어요?
          </DialogTitle>
          <DialogDescription className="text-black-600 text-base font-medium text-center">
            비공개하면 더 이상 시그널을 받을 수 없어요.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="w-full flex flex-row">
          <DialogClose asChild>
            <Button size="xl" className="grow">
              취소
            </Button>
          </DialogClose>
          <Button
            onClick={handleConfirm}
            variant="secondary"
            className="grow text-primary"
            size="xl"
          >
            확인
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
