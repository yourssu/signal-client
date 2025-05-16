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
  onConfirm?: () => void;
}

export function ServiceDisabledDialog({
  open,
  onOpenChange,
  title,
  content,
  onConfirm,
}: ServiceDisabledDialogProps) {
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
            {title}
          </DialogTitle>
          <DialogDescription className="text-black-600 text-base font-medium text-center">
            {content}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="w-full">
          <Button onClick={handleConfirm} className="w-full" size="xl">
            확인
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
