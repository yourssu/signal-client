import { cn } from "@/lib/utils";
import type { Gender } from "@/types/profile";

interface GenderChipsProps {
  value?: Gender;
  onChange: (gender: Gender) => void;
}

const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: "MALE", label: "남" },
  { value: "FEMALE", label: "여" },
];

const GenderChips = ({ value, onChange }: GenderChipsProps) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      <p className="caption1 text-label-normal px-2">성별</p>
      <div className="flex gap-2 w-full">
        {GENDER_OPTIONS.map((option) => {
          const selected = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={cn(
                "flex-1 h-11 rounded-lg bg-fill-normal flex items-center justify-center py-1 caption1 text-label-normal",
                selected && "border border-primary text-primary",
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default GenderChips;
export type { GenderChipsProps };
