import { getMemberSummaryParts, MEMBER_PART_SEPARATOR } from "@/lib/meeting";
import type { MeetingMemberRequest } from "@/types/meeting";
import { X } from "lucide-react";

interface MemberRowProps {
  member: MeetingMemberRequest;
  onRemove?: () => void;
}

const MemberRow = ({ member, onRemove }: MemberRowProps) => {
  const summary = getMemberSummaryParts(member).join(
    ` ${MEMBER_PART_SEPARATOR} `,
  );

  return (
    <div className="border border-line-normal rounded-xl px-3 py-2 w-full flex items-center justify-between">
      <p className="h4 text-label-normal">{summary}</p>
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
