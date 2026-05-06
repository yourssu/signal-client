import { useNavigate } from "react-router";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface TicketRequiredModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TicketRequiredModal({
  open,
  onOpenChange,
}: TicketRequiredModalProps) {
  const navigate = useNavigate();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-[320px] p-0 gap-0 rounded-3xl border-none shadow-lg"
        hideClose
      >
        <DialogTitle className="sr-only">티켓 필요 안내</DialogTitle>
        <DialogDescription className="sr-only">
          티켓을 충전해야 시그널을 보낼 수 있습니다.
        </DialogDescription>
        <div className="flex flex-col items-center gap-3 pt-5 pb-4 px-5">
          <div className="flex flex-col items-center gap-2 pb-1">
            <p className="text-xl font-semibold leading-[1.2] text-label-strong">
              티켓이 필요해요
            </p>
            <p className="text-base font-medium leading-[1.35] text-label-neutral text-center">
              티켓을 충전해야 운명의 상대에게
              <br />
              시그널을 보낼 수 있어요
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="lg"
              className="w-[130px] rounded-xl"
              onClick={() => onOpenChange(false)}
            >
              취소
            </Button>
            <Button
              variant="default"
              size="lg"
              className="w-[130px] rounded-xl"
              onClick={() => navigate("/purchase")}
            >
              충전하러가기
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
