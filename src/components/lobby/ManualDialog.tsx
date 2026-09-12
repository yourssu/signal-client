import { useState, type ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import manual1 from "@/assets/lobby/manual_1.png";
import manual2 from "@/assets/lobby/manual_2.png";
import manual3 from "@/assets/lobby/manual_3.png";
import manual4 from "@/assets/lobby/manual_4.png";

interface ManualDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ManualStep {
  image: string;
  title: ReactNode;
  description: ReactNode;
  caption: string;
}

const STEPS: ManualStep[] = [
  {
    image: manual1,
    title: (
      <>
        1/4
        <br />
        모두의 시그널
      </>
    ),
    description: (
      <>
        축제에서 친구들과 함께 즐기는
        <br />
        다대다 미팅 서비스예요
      </>
    ),
    caption: "방 생성은 프로필 등록이 필요해요",
  },
  {
    image: manual2,
    title: (
      <>
        2/4
        <br />
        미팅을 만들거나
        <br />
        직접 신청해보세요
      </>
    ),
    description: "친구들과 함께 미팅에 참여해보세요",
    caption: "방은 생성 후 1시간 동안만 유지돼요",
  },
  {
    image: manual3,
    title: (
      <>
        3/4
        <br />
        무조건 N:N
      </>
    ),
    description: "3명 방은 3명으로 입장 가능해요",
    caption: "하루에 한 번 매칭할 수 있어요",
  },
  {
    image: manual4,
    title: (
      <>
        4/4
        <br />
        즐기기만 하면 끝!
      </>
    ),
    description: "문자로 장소와 시간을 정해보세요",
    caption: "ex) 7시에 돌계에서 파닭 먹어요",
  },
];

export default function ManualDialog({
  open,
  onOpenChange,
}: ManualDialogProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const step = STEPS[stepIndex];
  const isLast = stepIndex === STEPS.length - 1;

  const handleOpenChange = (next: boolean) => {
    if (!next) setStepIndex(0);
    onOpenChange(next);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        hideClose
        className="flex w-[308px] flex-col items-center justify-center gap-3 rounded-[24px] border-none bg-white px-5 pt-5 pb-4"
      >
        <DialogHeader className="flex flex-col items-center gap-2 pb-1 text-center sm:text-center">
          <DialogTitle className="text-label-normal text-[20px] leading-[1.2] font-semibold">
            {step.title}
          </DialogTitle>
          <DialogDescription className="text-label-alternative text-[16px] leading-[1.35] font-medium">
            {step.description}
          </DialogDescription>
        </DialogHeader>

        <img
          src={step.image}
          alt=""
          className="h-40 w-[220px] rounded-2xl object-cover"
        />

        <p className="caption1 text-primary-heavy text-center">
          {step.caption}
        </p>

        <button
          type="button"
          onClick={() =>
            isLast ? handleOpenChange(false) : setStepIndex(stepIndex + 1)
          }
          className="button-m bg-primary text-static-white h-12 w-[268px] rounded-xl"
        >
          {isLast ? "시작하기" : "다음"}
        </button>
      </DialogContent>
    </Dialog>
  );
}
