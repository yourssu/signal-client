import React, { useState } from "react";

interface PersonalInfo {
  nickname: string;
  mbti: string;
  contact: string;
}

interface PersonalInfoStepProps {
  onSubmit: (info: PersonalInfo) => void;
}

const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({ onSubmit }) => {
  const [info, setInfo] = useState<PersonalInfo>({
    nickname: "",
    mbti: "",
    contact: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(info);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setInfo((prev) => ({ ...prev, [name]: value }));
  };

  const mbtiTypes = [
    "ISTJ",
    "ISFJ",
    "INFJ",
    "INTJ",
    "ISTP",
    "ISFP",
    "INFP",
    "INTP",
    "ESTP",
    "ESFP",
    "ENFP",
    "ENTP",
    "ESTJ",
    "ESFJ",
    "ENFJ",
    "ENTJ",
  ];

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">
        개인 정보를 입력해주세요
      </h2>

      <div className="space-y-6">
        <div>
          <label
            htmlFor="nickname"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            닉네임
          </label>
          <input
            type="text"
            id="nickname"
            name="nickname"
            value={info.nickname}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="닉네임을 입력하세요"
          />
        </div>

        <div>
          <label
            htmlFor="mbti"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            MBTI
          </label>
          <select
            id="mbti"
            name="mbti"
            value={info.mbti}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">MBTI 선택</option>
            {mbtiTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="contact"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            연락처
          </label>
          <input
            type="text"
            id="contact"
            name="contact"
            value={info.contact}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="연락처를 입력하세요"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 px-6 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          등록 완료
        </button>
      </div>
    </form>
  );
};

export default PersonalInfoStep;
