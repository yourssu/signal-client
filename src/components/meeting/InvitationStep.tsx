import React, { useState } from "react";
import { FormField } from "@/components/ui/form-field";

interface InvitationStepProps {
  value: string;
  onChange: (value: string) => void;
}

const InvitationStep: React.FC<InvitationStepProps> = ({ value, onChange }) => {
  // react-router가 location 갱신을 transition으로 미루는데, React는 입력값을 되돌릴 때
  // sync 작업만 기다린다. 퍼널 컨텍스트를 input에 바로 물리면 조합 중인 값이 직전 값으로
  // 되감겨 자모가 분리된다. 입력은 로컬 상태로 즉시 반영해 되감길 틈을 없앤다.
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
