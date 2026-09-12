import { useCelebrities } from "@/hooks/queries/profiles";
import { profileSimilarCelebClick } from "@/lib/analytics";
import { CELEBRITY_LIST, toLookalikeTrait } from "@/lib/celebrity";
import { cn } from "@/lib/utils";
import { AnimalType, Gender } from "@/types/profile";

interface CelebrityTagsProps {
  gender?: Gender;
  animal?: AnimalType;
  /** 닮은꼴 특징 칸의 현재 값 */
  value: string;
  isAnotherSchool?: boolean;
  onSelect: (value: string) => void;
}

const CelebrityTags = ({
  gender,
  animal,
  value,
  isAnotherSchool,
  onSelect,
}: CelebrityTagsProps) => {
  // 표에 없는 조합은 서버도 400을 주므로 아예 묻지 않는다.
  const fallback =
    gender && animal ? CELEBRITY_LIST[gender][animal] : undefined;
  const { data } = useCelebrities(gender!, animal!, { enabled: !!fallback });

  // 받아오기 전에도 태그가 보이도록 사본을 먼저 그리고, 응답이 오면 그쪽으로 바뀐다.
  const names = data ?? fallback;
  if (!names?.length) return null;

  return (
    <div className="flex flex-col gap-3 px-1.5 w-full">
      <p className="h4 text-label-neutral">닮은 꼴이 떠오르지 않나요?</p>
      <div className="flex w-full flex-wrap gap-1">
        {names.map((name) => {
          const trait = toLookalikeTrait(name, isAnotherSchool);
          const isSelected = trait === value;

          return (
            <button
              key={name}
              type="button"
              // 입력창이 포커스를 잃으면 키보드가 닫히며 화면이 밀려 탭이 빗나간다.
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => {
                if (!isSelected) profileSimilarCelebClick(name);
                onSelect(isSelected ? "" : trait);
              }}
              className={cn(
                "button-s text-label-alternative border-line-normal flex h-8 items-center rounded-full border px-[11px] whitespace-nowrap transition-colors duration-200",
                isSelected && "border-primary text-primary",
              )}
            >
              {name}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CelebrityTags;
