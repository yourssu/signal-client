import React, { useState } from "react";
import { FormField } from "@/components/ui/form-field";

interface InvitationStepProps {
  value: string;
  onChange: (value: string) => void;
}

const InvitationStep: React.FC<InvitationStepProps> = ({ value, onChange }) => {
  // 퍼널 컨텍스트는 라우터 히스토리를 거쳐 돌아오느라 입력보다 한 박자 늦다.
  // 그 값을 그대로 input에 물리면 한글 조합 중에 되감겨 자모가 분리된다.
  const [draft, setDraft] = useState(value);

  const handleChange = (next: string) => {
    setDraft(next);
    onChange(next);
  };

  return (
    <FormField
      placeholder="예시) 저녁 6시에 백마상 앞에서 맥주 먹어요"
      value={draft}
      onChange={(e) => handleChange(e.target.value)}
    />
  );
};

export default InvitationStep;
