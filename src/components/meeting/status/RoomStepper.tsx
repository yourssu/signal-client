import { cn } from "@/lib/utils";
import stepDone from "@/assets/lobby/step_done.svg";
import stepActive from "@/assets/lobby/step_active.svg";
import stepPending from "@/assets/lobby/step_pending.svg";
import stepFailed from "@/assets/lobby/step_failed.svg";

type RoomStepperState = "recruiting" | "matched" | "failed";

interface RoomStepperProps {
  state: RoomStepperState;
}

interface StepperStyle {
  recruitIcon: string;
  lastLine: string;
  lastIcon: string;
  lastLabel: string;
  lastLabelClassName: string;
}

const STEPPER_STYLES: Record<RoomStepperState, StepperStyle> = {
  recruiting: {
    recruitIcon: stepActive,
    lastLine: "bg-line-normal",
    lastIcon: stepPending,
    lastLabel: "매칭",
    lastLabelClassName: "text-line-normal",
  },
  matched: {
    recruitIcon: stepDone,
    lastLine: "bg-primary",
    lastIcon: stepDone,
    lastLabel: "매칭",
    lastLabelClassName: "text-primary",
  },
  failed: {
    recruitIcon: stepActive,
    lastLine: "bg-negative",
    lastIcon: stepFailed,
    lastLabel: "실패",
    lastLabelClassName: "text-negative",
  },
};

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
  const style = STEPPER_STYLES[state];

  return (
    <div className="flex w-full items-center justify-between">
      <StepDot icon={stepDone} label="생성" labelClassName="text-primary" />
      <StepLine className="bg-primary" />
      <StepDot
        icon={style.recruitIcon}
        label="모집 중"
        labelClassName="text-primary"
      />
      <StepLine className={style.lastLine} />
      <StepDot
        icon={style.lastIcon}
        label={style.lastLabel}
        labelClassName={style.lastLabelClassName}
      />
    </div>
  );
}

export type { RoomStepperProps, RoomStepperState };
