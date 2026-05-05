import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { whenPressEnter } from "@/lib/utils";
import React, { useState, useMemo } from "react";
import { ChevronDown } from "lucide-react";

const GUIDE_QUESTIONS = [
  {
    question: "Q1. 내 성격 특징이 뭐야?",
    example: "Ex) 너 엥쁘삐 그 자체야",
  },
  {
    question: "Q2. 내 닮은 꼴 뭐야?",
    example: "Ex) 억울한 최우식?",
  }
] as const;

// const shuffle = <T,>(array: T[]) =>
//   array
//     .map((value) => ({ value, sort: Math.random() }))
//     .sort((a, b) => a.sort - b.sort)
//     .map(({ value }) => value);

const getPersonalityExamples = (): string[] => {
  // try {
  //   if (PERSONALITIES.length < n) {
  //     throw new Error("Not enough personality examples");
  //   }
  //   return shuffle(PERSONALITIES).slice(0, n);
  // } catch (e) {
  //   console.error("Error parsing personality examples:", e);
  // }
  // return shuffle([
  //   "답장 빨라요",
  //   "낯가림 심한데 친해지면 말 많음",
  //   "힙합 좋아해요",
  // ]).slice(0, n);
  return [
    "EX) 가장 많이 들었던 닮은 꼴을 적어보세요",
    "EX) 나의 취미를 적어보세요",
    "EX) 나의 성격을 적어보세요",
  ];
};

const LABEL_LIST: string[] = [
  "첫번째",
  "두번째",
  "세번째",
];

interface PersonalityStepProps {
  traits?: string[];
  onSubmit: (traits: string[]) => void;
}

const PersonalityStep: React.FC<PersonalityStepProps> = ({
  traits: defaultTraits,
  onSubmit,
}) => {
  // State for 3 input fields
  const [traits, setTraits] = useState<string[]>(defaultTraits ?? ["", "", ""]);

  // Validation: Check if at least 2 traits are entered
  const isValid = useMemo(() => {
    return traits.every((trait) => trait.trim() !== "") && traits.every((trait) => trait.trim().length <= 20);
  }, [traits]);

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

  const personalityExamples = useMemo(() => getPersonalityExamples(), []);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  return (
    // Main container - Based on Figma Frame 1000011957
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
        <div className="flex flex-col gap-4 w-full">
          {traits.map((trait, index) => (
            <div
              className="animate-in slide-in-from-bottom-8 fade-in ease-in-out duration-500"
              key={index}
            >
              <FormField
                type="text"
                id={`personality-${index}`}
                name={`personality-${index}`}
                label={LABEL_LIST[index]}
                value={trait}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => proceedWithEnter(index, e)}
                required
                state={
                  trait.trim().length > 20
                    ? "error"
                    : trait.trim() !== ""
                      ? "filled"
                      : "default"
                }
                placeholder={personalityExamples[index]}
                errorText={
                  trait.trim().length > 20 ? "글자수는 최대 20자입니다." : undefined
                }
              />
            </div>
          ))}
        </div>
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
            <div className="flex flex-col gap-3 pt-[14px] mb-2 pb-3 px-3 bg-fill-pink-light rounded-2xl animate-in slide-in-from-top-2 fade-in ease-in-out duration-200"
            >
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
