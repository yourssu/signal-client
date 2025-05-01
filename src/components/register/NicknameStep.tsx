import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Import shadcn/ui Input
import React, { useState, useMemo } from "react"; // Import useMemo
import { Sparkles } from "lucide-react";

interface NicknameStepProps {
  onSubmit: (nickname: string) => void;
  // TODO: Add props for personality traits if generator needs them
}

const NicknameStep: React.FC<NicknameStepProps> = ({ onSubmit }) => {
  const [nickname, setNickname] = useState<string>("");

  // Validation: Check if nickname is not empty
  const isValid = useMemo(() => nickname.trim() !== "", [nickname]);

  const handleSubmit = () => {
    if (!isValid) return;
    onSubmit(nickname.trim());
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // TODO: Add length validation if needed (e.g., max 15 chars from ProfileCreatedRequest)
    setNickname(e.target.value);
  };

  const handleGenerateNickname = () => {
    // TODO: Implement nickname generation logic (API call)
    // Example: fetch('/api/generate-nickname', { method: 'POST', body: JSON.stringify({ traits: [...] }) })
    //          .then(res => res.json())
    //          .then(data => setNickname(data.nickname));
    console.log("Nickname generator clicked - implementation pending");
    // Placeholder: setNickname("임시닉네임");
  };

  return (
    // Main container - Based on Figma Frame 1000011961
    <div className="flex flex-col items-center pt-10 gap-[255px] h-full w-full px-4">
      {" "}
      {/* Adjusted gap */}
      {/* Top section: Progress, Title, Input, Generator Button - Based on Frame 1000011960 */}
      <div className="flex flex-col items-center gap-[43px] w-full max-w-[324px]">
        {" "}
        {/* Adjusted gap and width */}
        {/* Progress and Title container - Based on Frame 1425 */}
        <div className="flex flex-col items-center gap-[10px]">
          {/* Progress Indicator - Based on 1421:3738 */}
          <p className="text-xs text-muted-foreground">5 / 6</p>{" "}
          {/* Using muted-foreground for #525252 */}
          {/* Title - Based on 1421:3740 */}
          <h2 className="text-2xl font-semibold text-stone-700 whitespace-pre-line text-center">
            {" "}
            {/* Using stone-700 for #44403B */}
            {`나를 잘 뽐낼 수 있는\n닉네임을 만들어주세요`}
          </h2>
        </div>
        {/* Input and Generator Button Container - Based on Frame 1000011959 */}
        <div className="flex flex-col items-end gap-[17px] w-full">
          {" "}
          {/* Adjusted gap */}
          {/* Input Field - Based on INPUT instance 1421:2125 */}
          <Input
            type="text"
            id="nickname"
            name="nickname"
            value={nickname}
            onChange={handleChange}
            required
            // Styling based on Figma: text-2xl, text-center, placeholder color, bottom border
            className="w-full h-[50px] text-2xl text-center bg-transparent border-0 border-b-2 border-stone-500 rounded-none px-2.5 focus:ring-0 focus:border-primary placeholder:text-stone-400 placeholder:text-xl" // Adjusted styles
            placeholder="닉네임을 입력하세요." // Using clearer placeholder
          />
          {/* Nickname Generator Button - Based on Frame 1000011906 */}
          <Button
            variant="ghost" // Use ghost variant for background blur effect potentially
            onClick={handleGenerateNickname}
            className="flex justify-center items-center gap-1 h-[42px] w-auto px-4 rounded-full bg-white/50 backdrop-blur-md shadow-sm hover:bg-white/70" // Adjusted styles based on Figma
          >
            <Sparkles />
            {/* Icon size approx */}
            <span className="text-base font-medium text-primary">
              닉네임 생성기
            </span>{" "}
            {/* Text style from Figma */}
          </Button>
        </div>
      </div>
      {/* Confirmation Button - Based on BoxBtn instance 1421:2394 */}
      <div className="mt-auto pb-10 w-full max-w-[342px]">
        {" "}
        {/* Push button to bottom, match width */}
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
    </div>
  );
};

export default NicknameStep;
