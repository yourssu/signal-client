import type { MeetingMemberRequest } from "@/types/meeting";
import { X } from "lucide-react";

interface MemberRowProps {
  member: MeetingMemberRequest;
  onRemove?: () => void;
}

const MemberRow = ({ member, onRemove }: MemberRowProps) => {
  const { department, birthYear, gender } = member;
  const shortYear = String(birthYear % 100).padStart(2, "0");
  const genderLabel = gender === "MALE" ? "남" : "여";

  return (
    <div className="border border-line-normal rounded-xl px-3 py-2 w-full flex items-center justify-between">
      <p className="h4 text-label-normal">
        {department} · {shortYear}년생 · {genderLabel}
      </p>
      {onRemove && (
        <button type="button" onClick={onRemove}>
          <X className="size-4 text-label-assistive" />
        </button>
      )}
    </div>
  );
};

export default MemberRow;
export type { MemberRowProps };
