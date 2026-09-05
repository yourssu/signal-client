import { Link } from "react-router";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ProfileRequiredDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ProfileRequiredDialog({
  open,
  onOpenChange,
}: ProfileRequiredDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        hideClose
        className="flex w-[308px] flex-col items-center justify-center gap-3 rounded-[24px] border-none bg-white px-5 pt-5 pb-4"
      >
        <DialogHeader className="flex flex-col items-center gap-2 pb-1 text-center sm:text-center">
          <DialogTitle className="text-label-normal text-[20px] leading-[1.2] font-semibold">
            방 생성(=방장)은
            <br />
            프로필 등록이 필요해요
          </DialogTitle>
          <DialogDescription className="text-label-alternative text-[16px] leading-[1.35] font-medium">
            아래 버튼을 누르면 바로 등록할 수 있어요
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="button-m bg-primary text-static-white h-12 w-[130px] rounded-xl"
          >
            취소
          </button>
          <Link
            to="/profile/register"
            className="button-m bg-primary-light text-primary flex h-12 w-[130px] items-center justify-center rounded-xl"
          >
            프로필 등록하기
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}
