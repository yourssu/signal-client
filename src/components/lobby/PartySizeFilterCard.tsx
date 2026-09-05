import { cn } from "@/lib/utils";

export type PartySize = 2 | 3 | 4 | null;

interface PartySizeFilterCardProps {
  value: PartySize;
  onChange: (v: PartySize) => void;
}

const OPTIONS: { value: PartySize; label: string }[] = [
  { value: 2, label: "2명" },
  { value: 3, label: "3명" },
  { value: 4, label: "4명" },
  { value: null, label: "미정" },
];

export default function PartySizeFilterCard({
  value,
  onChange,
}: PartySizeFilterCardProps) {
  return (
    <div className="flex w-full flex-col gap-4 rounded-[20px] bg-white p-5 drop-shadow-[1px_1px_4px_rgba(0,0,0,0.25)]">
      <div className="flex flex-col gap-1">
        <h3 className="h3 text-label-strong">몇 명의 친구와 참여하나요?</h3>
        <h4 className="h4 text-label-assistive">
          참여 가능한 방을 빠르게 보여드려요!
        </h4>
      </div>
      <div className="flex w-full gap-1">
        {OPTIONS.map((option) => (
          <button
            key={option.label}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              "button-m bg-fill-normal text-label-neutral flex h-11 flex-1 items-center justify-center rounded-xl",
              value === option.value && "border-primary border",
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
