import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import React, { useState, useMemo } from "react";
import { useGenerateNickname } from "@/hooks/queries/profiles";
import { createPortal } from "react-dom";
import generatingImg from "@/assets/register/generating.png";
import sparkleImg from "@/assets/register/spakcle.png";
import { cn, whenPressEnter } from "@/lib/utils";
import { profileAiNicknameClick } from "@/lib/analytics";

const PROFANITY_LIST = [
  "씨발",
  "시발",
  "새끼",
  "병신",
  "지랄",
  "미친놈",
  "미친년",
  "개년",
  "창녀",
  "걸레",
  "찐따",
  "보지",
  "자지",
  "fuck",
  "shit",
  "bitch",
  "asshole",
  "cunt",
  "dick",
  "pussy",
  "bastard",
  "whore",
  "slut",
];

const PROFANITY_REGEX = new RegExp(PROFANITY_LIST.join("|"), "i");
const PROFANITY_ERROR_TEXT = "사용할 수 없는 닉네임입니다.";

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

  const profanityError = useMemo(
    () => PROFANITY_REGEX.test(nickname),
    [nickname],
  );
  const isValid = useMemo(
    () => nickname.trim() !== "" && !profanityError,
    [nickname, profanityError],
  );

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
    profileAiNicknameClick();
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
    <div className="flex flex-col items-center pt-2 w-full">
      <div className="flex flex-col items-stretch gap-[43px] w-full grow">
        <div className="flex flex-col gap-2.5">
          <p className="text-lg text-muted-foreground animate-in slide-in-from-bottom fade-in ease-in-out duration-300">
            5 / 6
          </p>
          <h2 className="text-2xl font-semibold text-stone-700 whitespace-pre-line animate-in slide-in-from-bottom-8 fade-in ease-in-out duration-400">
            나의 닉네임을
            <br />
            설정해주세요
          </h2>
        </div>
        <div className="flex flex-col items-end gap-4 w-full animate-in slide-in-from-bottom-8 fade-in ease-in-out duration-500">
          <div className="flex flex-col gap-0.5 self-stretch">
            <FormField
              type="text"
              id="nickname"
              name="nickname"
              value={nickname}
              onChange={handleChange}
              onKeyDown={submitOnEnter}
              required
              placeholder="닉네임을 입력하세요."
              maxLength={15}
              state={profanityError ? "error" : undefined}
              errorText={profanityError ? PROFANITY_ERROR_TEXT : undefined}
            />
            {!profanityError && (
              <p className="text-xs text-end">{nickname.length} / 15</p>
            )}
          </div>
          <button
            type="button"
            onClick={handleGenerateNickname}
            className="flex justify-center items-center gap-0.5 h-auto px-3 py-1.5 rounded-lg bg-[#ffe7fa] backdrop-blur-[6.5px] cursor-pointer transition-colors hover:bg-[#ffd4f3]"
          >
            <img src={sparkleImg} alt="" className="size-5" />
            <span className="text-xs font-medium text-pink-600 whitespace-nowrap">
              닉네임 AI 생성
            </span>
          </button>
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
