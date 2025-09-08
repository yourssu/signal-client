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

interface DeleteConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm?: () => void;
}

export function DeleteConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
}: DeleteConfirmationDialogProps) {
  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background p-6 flex flex-col items-center">
        <DialogHeader className="w-full text-center space-y-2">
          <DialogTitle className="text-primary text-xl font-bold text-center">
            정말 삭제하시겠어요?
          </DialogTitle>
          <DialogDescription className="text-black-600 text-base font-medium text-center">
            삭제하면 되돌릴 수 없어요.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="w-full">
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
            삭제
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
