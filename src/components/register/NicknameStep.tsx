import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Import shadcn/ui Input
import React, { useState, useMemo } from "react"; // Import useMemo
import { Sparkles } from "lucide-react";
import { useGenerateNickname } from "@/hooks/queries/profiles";
import { createPortal } from "react-dom";
import generatingImg from "@/assets/register/generating.png";
import { cn, whenPressEnter } from "@/lib/utils";

interface NicknameStepProps {
  onSubmit: (nickname: string) => void;
  nickname?: string;
  introSentences: string[];
}

const NicknameStep: React.FC<NicknameStepProps> = ({
  onSubmit,
  nickname: defaultNickname,
  introSentences,
}) => {
  const [nickname, setNickname] = useState<string>(defaultNickname ?? "");
  const { mutate: generateNickname, isPending } = useGenerateNickname();

  // Validation: Check if nickname is not empty
  const isValid = useMemo(() => nickname.trim() !== "", [nickname]);

  const handleSubmit = () => {
    if (!isValid) return;
    onSubmit(nickname.trim());
  };

  const submitOnEnter = (e: React.KeyboardEvent<HTMLInputElement>) =>
    whenPressEnter(e, handleSubmit);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
  };

  const handleGenerateNickname = () => {
    generateNickname(
      { introSentences },
      {
        onSuccess: (data) => {
          setNickname(data.nickname);
        },
      },
    );
  };

  return (
    // Main container - Based on Figma Frame 1000011961
    <div className="flex flex-col items-center pt-10 w-full">
      <div className="flex flex-col items-stretch gap-[43px] w-full grow">
        <div className="flex flex-col gap-2.5">
          <p className="text-xs text-muted-foreground animate-in slide-in-from-bottom fade-in ease-in-out duration-300">
            5 / 6
          </p>
          <h2 className="text-2xl font-semibold text-stone-700 whitespace-pre-line animate-in slide-in-from-bottom-8 fade-in ease-in-out duration-400">
            나를 잘 뽐낼 수 있는
            <br />
            <span className="text-primary">닉네임을 만들어주세요</span>
          </h2>
        </div>
        <div className="flex flex-col items-end gap-[17px] w-full animate-in slide-in-from-bottom-8 fade-in ease-in-out duration-500">
          <div className="flex flex-col gap-0.5">
            <Input
              type="text"
              id="nickname"
              name="nickname"
              value={nickname}
              onChange={handleChange}
              onKeyDown={submitOnEnter}
              required
              // Styling based on Figma: text-2xl, text-center, placeholder color, bottom border
              className="w-full h-12 text-2xl px-2.5" // Adjusted styles
              placeholder="닉네임을 입력하세요." // Using clearer placeholder
              maxLength={15}
            />
            <p className="text-xs text-end">{nickname.length} / 15</p>
          </div>
          <Button
            variant="ghost" // Use ghost variant for background blur effect potentially
            onClick={handleGenerateNickname}
            className="flex justify-center items-center gap-1 h-10 w-auto px-4 rounded-full bg-white/50 backdrop-blur-md shadow-sm hover:bg-white/70" // Adjusted styles based on Figma
          >
            <Sparkles className="text-primary fill-primary" />
            <span className="text-base font-medium text-primary">
              닉네임 생성기
            </span>
          </Button>
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
      {createPortal(
        <div
          className={cn(
            "fixed inset-0 flex flex-col items-center justify-center bg-black/50 text-white transition-opacity opacity-0 duration-500",
            isPending ? "opacity-100 delay-500" : "hidden",
          )}
        >
          <img src={generatingImg} alt="Generating..." />
          닉네임을 생성 중이에요...
        </div>,
        document.body,
      )}
    </div>
  );
};

export default NicknameStep;
