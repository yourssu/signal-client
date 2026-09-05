import { cn } from "@/lib/utils";
import stepDone from "@/assets/lobby/step_done.svg";
import stepActive from "@/assets/lobby/step_active.svg";
import stepPending from "@/assets/lobby/step_pending.svg";
import stepFailed from "@/assets/lobby/step_failed.svg";

type RoomStepperState = "recruiting" | "failed";

interface RoomStepperProps {
  state: RoomStepperState;
}

function StepDot({
  icon,
  label,
  labelClassName,
}: {
  icon: string;
  label: string;
  labelClassName?: string;
}) {
  return (
    <div className="flex w-[30px] flex-col items-center justify-center gap-1">
      <img src={icon} alt="" className="size-4" />
      <span className={cn("caption2 whitespace-nowrap", labelClassName)}>
        {label}
      </span>
    </div>
  );
}

function StepLine({ className }: { className?: string }) {
  return (
    <div className="flex flex-1 items-center py-2">
      <div className={cn("h-[1.5px] w-full rounded-full", className)} />
    </div>
  );
}

export default function RoomStepper({ state }: RoomStepperProps) {
  const isFailed = state === "failed";

  return (
    <div className="flex w-full items-center justify-between">
      <StepDot icon={stepDone} label="생성" labelClassName="text-primary" />
      <StepLine className="bg-primary" />
      <StepDot
        icon={stepActive}
        label="모집 중"
        labelClassName="text-primary"
      />
      <StepLine className={isFailed ? "bg-negative" : "bg-line-normal"} />
      <StepDot
        icon={isFailed ? stepFailed : stepPending}
        label={isFailed ? "실패" : "매칭"}
        labelClassName={isFailed ? "text-negative" : "text-line-normal"}
      />
    </div>
  );
}

export type { RoomStepperProps, RoomStepperState };
