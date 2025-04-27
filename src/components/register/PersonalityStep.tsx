import { Button } from "@/components/ui/button";
import React, { useState } from "react";

interface PersonalityStepProps {
  onSubmit: (personality: string[]) => void;
}

const PersonalityStep: React.FC<PersonalityStepProps> = ({ onSubmit }) => {
  const [personality, setPersonality] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (personality.length < 2) return;
    onSubmit(personality);
  };

  const handleChange = (index: number, value: string) => {
    setPersonality((prev) => {
      const newPersonality = [...prev];
      newPersonality[index] = value;
      return newPersonality;
    });
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
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index}>
            <label
              htmlFor="mbti"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              특징 {index + 1}
            </label>
            <input
              type="text"
              id={`personality-${index}`}
              name={`personality-${index}`}
              value={personality[index] || ""}
              onChange={(e) => handleChange(index, e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="특징 입력"
            />
          </div>
        ))}

        <Button type="submit" size="xl" className="w-full">
          등록 완료
        </Button>
      </div>
    </form>
  );
};

export default PersonalityStep;
