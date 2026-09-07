import type { ReactNode } from "react";
import { Link } from "react-router";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  description: ReactNode;
  cancelLabel: string;
  confirmLabel: string;
  /** 확인 버튼 대신 이동 링크를 그려야 할 때(예: 프로필 등록) 사용한다. */
  confirmHref?: string;
  confirmDisabled?: boolean;
  onConfirm?: () => void;
}

export default function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  cancelLabel,
  confirmLabel,
  confirmHref,
  confirmDisabled,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        hideClose
        className="flex w-[308px] flex-col items-center justify-center gap-3 rounded-[24px] border-none bg-white px-5 pt-5 pb-4"
      >
        <DialogHeader className="flex flex-col items-center gap-2 pb-1 text-center sm:text-center">
          <DialogTitle className="text-label-normal text-[20px] leading-[1.2] font-semibold">
            {title}
          </DialogTitle>
          <DialogDescription className="text-label-alternative text-[16px] leading-[1.35] font-medium">
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="button-m bg-primary text-static-white h-12 w-[130px] rounded-xl"
          >
            {cancelLabel}
          </button>
          {confirmHref ? (
            <Link
              to={confirmHref}
              className="button-m bg-primary-light text-primary flex h-12 w-[130px] items-center justify-center rounded-xl"
            >
              {confirmLabel}
            </Link>
          ) : (
            <button
              type="button"
              onClick={onConfirm}
              disabled={confirmDisabled}
              className="button-m bg-primary-light text-primary h-12 w-[130px] rounded-xl disabled:opacity-50"
            >
              {confirmLabel}
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
