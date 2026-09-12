import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import CelebrityTags from "@/components/register/CelebrityTags";
import { whenPressEnter } from "@/lib/utils";
import React, { useState, useMemo } from "react";
import { ChevronDown } from "lucide-react";
import { AnimalType, Gender } from "@/types/profile";

const GUIDE_QUESTIONS = [
  {
    question: "Q1. 내 성격 특징이 뭐야?",
    example: "Ex) 너 엥쁘삐 그 자체야",
  },
  {
    question: "Q2. 내 닮은 꼴 뭐야?",
    example: "Ex) 억울한 최우식?",
  },
] as const;

const TRAIT_FIELDS = [
  { label: "첫번째", placeholder: "EX) 나의 취미를 적어보세요" },
  { label: "두번째", placeholder: "EX) 나의 성격을 적어보세요" },
  { label: "세번째", placeholder: "EX) 가장 많이 들었던 닮은 꼴을 적어보세요" },
] as const;

/** 연예인 태그가 붙는 칸. */
const LOOKALIKE_INDEX = 2;

const isTraitFilled = (trait: string) =>
  trait.trim() !== "" && trait.trim().length <= 20;

interface PersonalityStepProps {
  traits?: string[];
  gender?: Gender;
  animal?: AnimalType;
  isAnotherSchool?: boolean;
  onSubmit: (traits: string[]) => void;
}

const PersonalityStep: React.FC<PersonalityStepProps> = ({
  traits: defaultTraits,
  gender,
  animal,
  isAnotherSchool,
  onSubmit,
}) => {
  // 복원된 값이 세 개보다 적어도 칸 수는 항상 세 개다.
  const [traits, setTraits] = useState<string[]>(() =>
    TRAIT_FIELDS.map((_, index) => defaultTraits?.[index] ?? ""),
  );

  const isValid = useMemo(() => traits.every(isTraitFilled), [traits]);

  // 제출과 같은 판정을 쓴다. 20자를 넘기면 다음 칸이 열리지 않는다.
  const showSecond = isTraitFilled(traits[0]);
  const showThird = showSecond && isTraitFilled(traits[1]);

  const handleSubmit = () => {
    if (!isValid) return;
    onSubmit(traits);
  };

  const proceedWithEnter = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) =>
    whenPressEnter(e, () => {
      if (index < traits.length - 1) {
        const nextInput = document.getElementById(`personality-${index + 1}`);
        if (nextInput) {
          nextInput.focus();
        }
      } else {
        handleSubmit();
      }
    });

  const handleChange = (index: number, value: string) => {
    setTraits((prev) => {
      const newTraits = [...prev];
      newTraits[index] = value;
      return newTraits;
    });
  };

  const [isGuideOpen, setIsGuideOpen] = useState(false);

  return (
    <div className="flex flex-col items-center pt-2 w-full">
      <div className="flex flex-col gap-[43px] w-full grow">
        <div className="flex flex-col items-start gap-2.5">
          <p className="text-lg text-muted-foreground animate-in slide-in-from-bottom fade-in ease-in-out duration-300">
            4 / 6
          </p>
          <h2 className="text-2xl font-semibold text-stone-700 whitespace-pre-line animate-in slide-in-from-bottom-8 fade-in ease-in-out duration-400">
            나만의
            <br />
            특징을 적어주세요
          </h2>
        </div>
        <div className="flex flex-col gap-5 w-full">
          <div className="flex flex-col gap-4 w-full">
            {TRAIT_FIELDS.map((field, index) => {
              if (index === 1 && !showSecond) return null;
              if (index === 2 && !showThird) return null;
              const trait = traits[index];
              const isTooLong = trait.trim().length > 20;

              return (
                <FormField
                  key={field.label}
                  className="animate-in slide-in-from-bottom-8 fade-in ease-in-out duration-500"
                  type="text"
                  id={`personality-${index}`}
                  name={`personality-${index}`}
                  label={field.label}
                  value={trait}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => proceedWithEnter(index, e)}
                  required
                  state={
                    isTooLong
                      ? "error"
                      : trait.trim() !== ""
                        ? "filled"
                        : "default"
                  }
                  placeholder={field.placeholder}
                  errorText={
                    isTooLong ? "글자수는 최대 20자입니다." : undefined
                  }
                />
              );
            })}
          </div>
          {showThird && (
            <div className="animate-in slide-in-from-bottom-4 fade-in ease-in-out duration-300">
              <CelebrityTags
                gender={gender}
                animal={animal}
                isAnotherSchool={isAnotherSchool}
                value={traits[LOOKALIKE_INDEX]}
                onSelect={(value) => handleChange(LOOKALIKE_INDEX, value)}
              />
            </div>
          )}
          <div className="flex flex-col gap-2 w-full">
            <button
              type="button"
              className="flex items-center justify-center gap-0.5 cursor-pointer"
              onClick={() => setIsGuideOpen(!isGuideOpen)}
            >
              <span className="text-xs font-medium leading-[1.2] text-label-neutral whitespace-nowrap">
                작성 가이드 보기
              </span>
              <ChevronDown
                className={`size-4 text-label-neutral transition-transform duration-200 ${isGuideOpen ? "rotate-0" : "-rotate-90"}`}
              />
            </button>
            {isGuideOpen && (
              <div className="flex flex-col gap-3 pt-[14px] mb-2 pb-3 px-3 bg-fill-pink-light rounded-2xl animate-in slide-in-from-top-2 fade-in ease-in-out duration-200">
                <p className="px-2 text-sm font-semibold leading-[1.35] text-primary whitespace-pre-line">
                  나의 매력.. 고민 된다면?{"\n"}친구한테 물어보세요
                </p>
                <div className="flex flex-col gap-3 w-full">
                  {GUIDE_QUESTIONS.map((g, i) => (
                    <div
                      key={i}
                      className="flex flex-col gap-1 justify-center h-16 px-4 bg-static-white rounded-xl"
                    >
                      <p className="text-sm font-semibold leading-[1.35] text-label-strong">
                        {g.question}
                      </p>
                      <p className="text-xs font-medium leading-[1.2] text-label-neutral">
                        {g.example}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Button
        onClick={handleSubmit}
        disabled={!isValid}
        className={`w-full h-14 rounded-2xl text-lg font-medium transition-colors ${
          isValid
            ? "bg-primary text-primary-foreground hover:bg-primary/90"
            : "bg-gray-300 text-white cursor-not-allowed"
        }`}
      >
        입력 완료
      </Button>
    </div>
  );
};

export default PersonalityStep;
