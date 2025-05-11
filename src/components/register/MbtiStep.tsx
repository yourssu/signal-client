import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Import shadcn/ui Input
import { cn } from "@/lib/utils";
import { Mbti } from "@/types/profile"; // Assuming isValidMbti exists or needs creation
import React, { useState, useMemo } from "react"; // Import useMemo

const isValidMbti = (mbti: string): mbti is Mbti => {
  if (typeof mbti !== "string" || mbti.length !== 4) return false;
  const upperMbti = mbti.toUpperCase();
  const validChars = [
    ["E", "I"],
    ["S", "N"],
    ["T", "F"],
    ["J", "P"],
  ];
  for (let i = 0; i < 4; i++) {
    if (!validChars[i].includes(upperMbti[i])) {
      return false;
    }
  }
  return true;
};

interface MbtiStepProps {
  onSubmit: (mbti: Mbti) => void;
}

const MbtiStep: React.FC<MbtiStepProps> = ({ onSubmit }) => {
  const [mbtiInput, setMbtiInput] = useState<string>(""); // Store raw input

  // Validate MBTI input
  const isValid = useMemo(() => isValidMbti(mbtiInput), [mbtiInput]);

  const handleSubmit = () => {
    if (!isValid) return;
    onSubmit(mbtiInput.toUpperCase() as Mbti); // Submit validated and formatted MBTI
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only valid MBTI characters and limit length
    const value = e.target.value.toUpperCase();
    if (value.length <= 4) {
      setMbtiInput(value);
    }
  };

  return (
    // Main container - Based on Figma Frame 'Content' (1659:1810)
    <div className="flex flex-col items-center pt-10 w-full">
      <div className="flex flex-col items-stretch gap-10 w-full grow">
        <div className="flex flex-col items-start gap-2.5">
          {/* Progress Indicator - Based on 1412:6567 */}
          <p className="text-xs text-muted-foreground animate-in slide-in-from-bottom fade-in ease-in-out duration-300">
            3 / 6
          </p>
          {/* Using muted-foreground for #525252 */}
          {/* Title - Based on 1412:6569 */}
          <h2 className="text-2xl font-semibold text-stone-700 whitespace-pre-line animate-in slide-in-from-bottom-8 fade-in ease-in-out duration-400">
            당신의 성격이 궁금해요!
            <br />
            <span className="text-primary">MBTI를 적어주세요</span>
          </h2>
        </div>
        <Input
          type="text"
          id="mbti"
          name="mbti"
          value={mbtiInput}
          onChange={handleChange}
          maxLength={4} // Enforce max length
          required
          // Styling based on Figma: text-2xl, text-center, placeholder color, bottom border
          className="w-full h-12 text-2xl px-2.5 animate-in slide-in-from-bottom-8 fade-in ease-in-out duration-500" // Adjusted styles
          placeholder="MBTI 입력 ex.ENFP" // Placeholder from Figma
        />
      </div>
      <Button
        onClick={handleSubmit}
        disabled={!isValid} // Disable button if input is not valid
        className={cn(
          `w-full h-14 rounded-2xl text-lg font-medium transition-colors`,
          isValid
            ? "bg-primary text-primary-foreground hover:bg-primary/90"
            : "bg-gray-300 text-white cursor-not-allowed"
        )}
      >
        입력 완료
      </Button>
    </div>
  );
};

export default MbtiStep;
