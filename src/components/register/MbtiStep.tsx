import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { isValidMbti } from "@/lib/mbti";
import { cn, whenPressEnter } from "@/lib/utils";
import { Mbti } from "@/types/profile";
import React, { useState, useMemo } from "react";

interface MbtiStepProps {
  mbti?: Mbti;
  onSubmit: (mbti: Mbti) => void;
}

const MbtiStep: React.FC<MbtiStepProps> = ({ mbti, onSubmit }) => {
  const [mbtiInput, setMbtiInput] = useState<string>(mbti ?? ""); // Store raw input

  // Validate MBTI input
  const isValid = useMemo(() => isValidMbti(mbtiInput), [mbtiInput]);

  const handleSubmit = () => {
    if (!isValid) return;
    onSubmit(mbtiInput.toUpperCase() as Mbti); // Submit validated and formatted MBTI
  };

  const submitOnEnter = (e: React.KeyboardEvent<HTMLInputElement>) =>
    whenPressEnter(e, handleSubmit);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only valid MBTI characters and limit length
    const value = e.target.value.toUpperCase();
    if (value.length <= 4) {
      setMbtiInput(value);
    }
  };

  return (
    // Main container - Based on Figma Frame 'Content' (1659:1810)
    <div className="flex flex-col items-center pt-2 w-full">
      <div className="flex flex-col items-stretch gap-10 w-full grow">
        <div className="flex flex-col items-start gap-2.5">
          {/* Progress Indicator - Based on 1412:6567 */}
          <p className="text-lg text-muted-foreground animate-in slide-in-from-bottom fade-in ease-in-out duration-300">
            3 / 8
          </p>
          {/* Using muted-foreground for #525252 */}
          {/* Title - Based on 1412:6569 */}
          <h2 className="text-2xl font-semibold text-stone-700 whitespace-pre-line animate-in slide-in-from-bottom-8 fade-in ease-in-out duration-400">
            성격 먼저 볼까요?
            <br />
            <span className="text-primary">MBTI를 적어주세요</span>
          </h2>
        </div>
        <FormField
          type="text"
          id="mbti"
          label="MBTI"
          name="mbti"
          value={mbtiInput}
          onChange={handleChange}
          onKeyDown={submitOnEnter}
          maxLength={4}
          required
          className="animate-in slide-in-from-bottom-8 fade-in ease-in-out duration-500"
          placeholder="MBTI를 입력해주세요"
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

export default MbtiStep;
