import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ServiceDisabledDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  content: string;
  confirmLabel?: string;
  confirmDisabled?: boolean;
  /** 바깥을 눌러도 닫히지 않는다. 눌러야만 벗어날 수 있는 상태에 쓴다. */
  blocking?: boolean;
  onConfirm?: () => void;
}

export function ServiceDisabledDialog({
  open,
  onOpenChange,
  title,
  content,
  confirmLabel = "확인",
  confirmDisabled = false,
  blocking = false,
  onConfirm,
}: ServiceDisabledDialogProps) {
  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (blocking && !next) return;
        onOpenChange(next);
      }}
    >
      <DialogContent
        hideClose={blocking}
        className="bg-background p-6 flex flex-col items-center"
      >
        <DialogHeader className="w-full text-center space-y-2">
          <DialogTitle className="text-primary text-xl font-bold text-center">
            {title}
          </DialogTitle>
          <DialogDescription className="text-black-600 text-base font-medium text-center">
            {content}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="w-full">
          <Button
            onClick={handleConfirm}
            disabled={confirmDisabled}
            className="w-full"
            size="xl"
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
