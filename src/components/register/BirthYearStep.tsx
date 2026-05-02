import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { cn, whenPressEnter } from "@/lib/utils";
import React, { useState, useMemo } from "react"; // Import useMemo

interface BirthYearStepProps {
  birthYear?: number;
  onSubmit: (birthYear: number) => void;
}

const BirthYearStep: React.FC<BirthYearStepProps> = ({
  birthYear,
  onSubmit,
}) => {
  const [birthYearInput, setBirthYearInput] = useState<number | null>(
    birthYear ?? null,
  ); // Store raw input

  // Validate MBTI input
  const isValid = useMemo(
    () => birthYearInput !== null && birthYearInput > 0 && birthYearInput < 2007,
    [birthYearInput],
  );

  const handleSubmit = () => {
    if (!isValid) return;
    onSubmit(birthYearInput!);
  };

  const submitOnEnter = (e: React.KeyboardEvent<HTMLInputElement>) =>
    whenPressEnter(e, handleSubmit);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digitsOnly = e.target.value.replace(/\D/g, "");
    if (digitsOnly.length > 4) return;
    const value = digitsOnly === "" ? null : parseInt(digitsOnly);
    setBirthYearInput(value);
  };

  return (
    // Main container - Based on Figma Frame 'Content' (1659:1810)
    <div className="flex flex-col items-center pt-2 w-full">
      <div className="flex flex-col items-stretch gap-10 w-full grow">
        <div className="flex flex-col items-start gap-2.5">
          {/* Progress Indicator - Based on 1412:6567 */}
          <p className="text-xs text-muted-foreground animate-in slide-in-from-bottom fade-in ease-in-out duration-300">
            5 / 8
          </p>
          {/* Using muted-foreground for #525252 */}
          {/* Title - Based on 1412:6569 */}
          <h2 className="text-2xl font-semibold text-stone-700 whitespace-pre-line animate-in slide-in-from-bottom-8 fade-in ease-in-out duration-400">
            얼마나 고였는지 궁금해요! ㅎㅎ
            <br />
            <span className="text-primary">출생년도를 입력해주세요</span>
          </h2>
        </div>
        <FormField
          type="text"
          inputMode="numeric"
          id="birthYear"
          name="birthYear"
          label="나이"
          value={birthYearInput ?? ""}
          onChange={handleChange}
          onKeyDown={submitOnEnter}
          maxLength={4}
          required
          className="animate-in slide-in-from-bottom-8 fade-in ease-in-out duration-500"
          placeholder="태어난 연도를 입력해주세요 (ex:2002)"
        />
      </div>
      <Button
        onClick={handleSubmit}
        disabled={!isValid} // Disable button if input is not valid
        className={cn(
          `w-full h-14 rounded-2xl text-lg font-medium transition-colors`,
          isValid
            ? "bg-primary text-primary-foreground hover:bg-primary/90"
            : "bg-gray-300 text-white cursor-not-allowed",
        )}
      >
        입력 완료
      </Button>
    </div>
  );
};

export default BirthYearStep;
