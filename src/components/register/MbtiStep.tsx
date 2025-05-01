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
    <div className="flex flex-col items-center pt-10 w-full px-4">
      <div className="flex flex-col items-stretch gap-[43px] w-full grow">
        <div className="flex flex-col items-start gap-[10px]">
          {/* Progress Indicator - Based on 1412:6567 */}
          <p className="text-xs text-muted-foreground">3 / 6</p>
          {/* Using muted-foreground for #525252 */}
          {/* Title - Based on 1412:6569 */}
          <h2 className="text-2xl font-semibold text-stone-700 whitespace-pre-line">
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
          className="w-full h-[50px] text-2xl text-center bg-transparent border-0 border-b-2 border-stone-500 rounded-none px-2.5 focus:ring-0 focus:border-primary placeholder:text-stone-400" // Adjusted styles
          placeholder="MBTI 입력 ex.ENFP" // Placeholder from Figma
        />
      </div>
      <Button
        onClick={handleSubmit}
        disabled={!isValid} // Disable button if input is not valid
        className={cn(
          `w-full h-[56px] rounded-2xl text-lg font-medium transition-colors`,
          isValid
            ? "bg-primary text-primary-foreground hover:bg-primary/90" // Enabled state (Pink)
            : "bg-gray-300 text-white cursor-not-allowed" // Disabled state (Gray - #D1D5DC)
        )}
      >
        입력 완료
      </Button>
    </div>
  );
};

// Helper function (consider moving to types/profile.ts or utils)
// const isValidMbti = (mbti: string): mbti is Mbti => {
//   if (mbti.length !== 4) return false;
//   const validChars = [
//     ['E', 'I'],
//     ['S', 'N'],
//     ['T', 'F'],
//     ['J', 'P'],
//   ];
//   const upperMbti = mbti.toUpperCase();
//   for (let i = 0; i < 4; i++) {
//     if (!validChars[i].includes(upperMbti[i])) {
//       return false;
//     }
//   }
//   return true;
// };

export default MbtiStep;
