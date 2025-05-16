import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Import shadcn/ui Input
// import { PERSONALITIES } from "@/env";
import { whenPressEnter } from "@/lib/utils";
import React, { useState, useMemo } from "react"; // Import useMemo

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
    "본인 특징 (ex. 영화 좋아함, 장난기 많음)",
    "함께 하고싶은 것 (ex. 공연 관람, 술 배틀)",
    "이런 사람 만나고 싶어요 (ex. 키 큰 사람)",
  ];
};

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
    return traits.filter((trait) => trait.trim() !== "").length >= 2;
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

  return (
    // Main container - Based on Figma Frame 1000011957
    <div className="flex flex-col items-center pt-2 w-full">
      <div className="flex flex-col gap-[43px] w-full grow">
        <div className="flex flex-col items-start gap-2.5">
          <p className="text-xs text-muted-foreground animate-in slide-in-from-bottom fade-in ease-in-out duration-300">
            6 / 8
          </p>
          <h2 className="text-2xl font-semibold text-stone-700 whitespace-pre-line animate-in slide-in-from-bottom-8 fade-in ease-in-out duration-400">
            나를 어필할 수 있는
            <br />
            <span className="text-primary">특징 3가지를 입력해주세요</span>
          </h2>
        </div>
        <div className="flex flex-col gap-4 w-full">
          {traits.map((trait, index) => (
            <div
              className="animate-in slide-in-from-bottom-8 fade-in ease-in-out duration-500 flex flex-col gap-0.5"
              key={index}
            >
              <Input
                type="text"
                id={`personality-${index}`}
                name={`personality-${index}`}
                value={trait}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => proceedWithEnter(index, e)}
                maxLength={20}
                required={true}
                // Styling based on Figma INPUT instances (style_TGM91S, fill_HGA9Q2, stroke_BLRCWW)
                className="w-full h-12 text-lg font-medium px-2.5" // Adjusted styles, placeholder style
                placeholder={personalityExamples[index]} // Placeholder from Figma
              />
              <p className="text-xs text-end">{trait.length}/20</p>
            </div>
          ))}
        </div>
      </div>
      <Button
        onClick={handleSubmit}
        disabled={!isValid} // Disable button if validation fails
        className={`w-full h-14 rounded-2xl text-lg font-medium transition-colors ${
          isValid
            ? "bg-primary text-primary-foreground hover:bg-primary/90" // Enabled state (Pink)
            : "bg-gray-300 text-white cursor-not-allowed" // Disabled state (Gray - #D1D5DC)
        }`}
      >
        입력 완료
      </Button>
    </div>
  );
};

export default PersonalityStep;
