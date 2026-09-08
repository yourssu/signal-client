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
  /** 모집이 실제로 진행 중일 때만 물결을 준다. 끝났거나 실패한 흐름에는 없다. */
  recruitRipple: boolean;
  lastLine: string;
  lastIcon: string;
  lastLabel: string;
  lastLabelClassName: string;
}

const STEPPER_STYLES: Record<RoomStepperState, StepperStyle> = {
  recruiting: {
    recruitIcon: stepActive,
    recruitRipple: true,
    lastLine: "bg-line-normal",
    lastIcon: stepPending,
    lastLabel: "매칭",
    lastLabelClassName: "text-line-normal",
  },
  matched: {
    recruitIcon: stepDone,
    recruitRipple: false,
    lastLine: "bg-primary",
    lastIcon: stepDone,
    lastLabel: "매칭",
    lastLabelClassName: "text-primary",
  },
  failed: {
    recruitIcon: stepActive,
    recruitRipple: false,
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
  ripple = false,
}: {
  icon: string;
  label: string;
  labelClassName?: string;
  ripple?: boolean;
}) {
  return (
    <div className="flex w-[30px] flex-col items-center justify-center gap-1">
      <span className="relative flex size-[18px] items-center justify-center">
        {ripple && (
          <span
            aria-hidden
            className="bg-primary animate-ripple absolute inset-0 rounded-full motion-reduce:hidden"
          />
        )}
        <img src={icon} alt="" className="relative size-[18px]" />
      </span>
      <span className={cn("caption2 whitespace-nowrap", labelClassName)}>
        {label}
      </span>
    </div>
  );
}

function StepLine({ className }: { className?: string }) {
  // 상자 높이를 점 아이콘(size-[18px])과 맞춰야 선이 점의 중심에 걸린다.
  // 라벨까지 포함한 열 전체를 기준으로 잡으면 라벨 높이의 절반만큼 내려간다.
  return (
    <div className="flex h-[18px] flex-1 items-center">
      <div className={cn("h-[1.5px] w-full rounded-full", className)} />
    </div>
  );
}

export default function RoomStepper({ state }: RoomStepperProps) {
  const style = STEPPER_STYLES[state];

  return (
    <div className="flex w-full items-start justify-between">
      <StepDot icon={stepDone} label="생성" labelClassName="text-primary" />
      <StepLine className="bg-primary" />
      <StepDot
        icon={style.recruitIcon}
        label="모집 중"
        labelClassName="text-primary"
        ripple={style.recruitRipple}
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
