import React from "react";

interface InvitationStepProps {
  value: string;
  onChange: (value: string) => void;
}

const InvitationStep: React.FC<InvitationStepProps> = ({ value, onChange }) => {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="예시) 저녁 6시에 백양관 앞에서 맥주 먹어요"
      className="body1 text-label-strong placeholder:text-label-assistive min-h-[120px] w-full resize-none rounded-xl bg-fill-normal p-4 outline-none"
    />
  );
};

export default InvitationStep;
