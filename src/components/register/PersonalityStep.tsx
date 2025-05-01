import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Import shadcn/ui Input
import React, { useState, useMemo } from "react"; // Import useMemo

interface PersonalityStepProps {
  onSubmit: (personality: string[]) => void;
}

const PersonalityStep: React.FC<PersonalityStepProps> = ({ onSubmit }) => {
  // State for 3 input fields
  const [traits, setTraits] = useState<string[]>(["", "", ""]);

  // Validation: Check if at least 2 traits are entered
  const isValid = useMemo(() => {
    return traits.filter((trait) => trait.trim() !== "").length >= 2;
  }, [traits]);

  const handleSubmit = () => {
    if (!isValid) return;
    // Submit only non-empty traits
    onSubmit(traits.filter((trait) => trait.trim() !== ""));
  };

  const handleChange = (index: number, value: string) => {
    setTraits((prev) => {
      const newTraits = [...prev];
      newTraits[index] = value;
      return newTraits;
    });
  };

  return (
    // Main container - Based on Figma Frame 1000011957
    <div className="flex flex-col items-center pt-10 gap-[159px] w-full px-4">
      <div className="flex flex-col gap-[43px] w-full grow">
        <div className="flex flex-col items-start gap-[10px]">
          <p className="text-xs text-muted-foreground">4 / 6</p>
          <h2 className="text-2xl font-semibold text-stone-700 whitespace-pre-line">
            본인을 잘 드러내는
            <br />
            <span className="text-primary">특징을 입력해주세요</span>
          </h2>
        </div>
        <div className="flex flex-col gap-[26px] w-full">
          {traits.map((trait, index) => (
            <Input
              key={index}
              type="text"
              id={`personality-${index}`}
              name={`personality-${index}`}
              value={trait}
              onChange={(e) => handleChange(index, e.target.value)}
              required={index < 2} // Require at least the first two
              // Styling based on Figma INPUT instances (style_TGM91S, fill_HGA9Q2, stroke_BLRCWW)
              className="w-full h-[50px] text-lg font-medium px-2.5" // Adjusted styles, placeholder style
              placeholder="특징 입력 ex.숭실대 카리나" // Placeholder from Figma
            />
          ))}
        </div>
      </div>
      <Button
        onClick={handleSubmit}
        disabled={!isValid} // Disable button if validation fails
        className={`w-full h-[56px] rounded-2xl text-lg font-medium transition-colors ${
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
