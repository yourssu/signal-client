import { Button } from "@/components/ui/button";
import { Mbti } from "@/types/profile";
import React, { useState } from "react";

interface MbtiStepProps {
  onSubmit: (mbti: Mbti) => void;
}

const MbtiStep: React.FC<MbtiStepProps> = ({ onSubmit }) => {
  const [mbti, setMbti] = useState<Mbti | "">("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mbti) return;
    onSubmit(mbti);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value as Mbti;
    setMbti(value);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center">
        개인 정보를 입력해주세요.
      </h2>
      <p className="text-center mb-6">
        인스타그램 연락처는 앞에 @을 붙여주세요.
      </p>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="mbti"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            MBTI
          </label>
          <input
            type="text"
            id="mbti"
            name="contact"
            value={mbti}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="연락처를 입력하세요."
          />
        </div>

        <Button type="submit" size="xl" className="w-full">
          등록 완료
        </Button>
      </div>
    </form>
  );
};

export default MbtiStep;
