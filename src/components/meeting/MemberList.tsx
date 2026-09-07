import EmptyMemberSlot from "@/components/meeting/EmptyMemberSlot";
import MemberRow from "@/components/meeting/MemberRow";
import { MEETING_AVATARS } from "@/lib/meeting";
import userIcon from "@/assets/icons/user_icon.svg";
import type { MeetingMemberRequest } from "@/types/meeting";
import type { AnimalType } from "@/types/profile";
import { X } from "lucide-react";

interface MemberListProps {
  host?: { nickname: string; animal: AnimalType };
  /** 넘기면 첫 번째 멤버를 본인 행으로 그린다. 프로필이 없으면 기본 유저 아이콘을 쓴다. */
  self?: { animal?: AnimalType };
  members: MeetingMemberRequest[];
  emptySlotCount: number;
  onRemove?: (index: number) => void;
}

interface NamedRowProps {
  avatar: string;
  name: string;
  badge?: string;
  note?: string;
  onRemove?: () => void;
}

const NamedRow = ({ avatar, name, badge, note, onRemove }: NamedRowProps) => (
  <div className="border border-line-normal rounded-xl px-3 py-2 flex items-center justify-between">
    <div className="flex gap-2 items-center">
      <img src={avatar} alt="" className="size-8" />
      <p className="h4 text-label-normal">{name}</p>
    </div>
    {badge && (
      <div className="bg-primary-light rounded-lg px-1.5 py-1">
        <p className="caption2 text-primary">{badge}</p>
      </div>
    )}
    {note && <p className="caption2 text-label-assistive">{note}</p>}
    {onRemove && (
      <button type="button" onClick={onRemove}>
        <X className="size-4 text-label-assistive" />
      </button>
    )}
  </div>
);

const MemberList = ({
  host,
  self,
  members,
  emptySlotCount,
  onRemove,
}: MemberListProps) => {
  const selfAvatar = self?.animal ? MEETING_AVATARS[self.animal] : userIcon;

  return (
    <div className="border-t border-line-normal pt-4 flex flex-col gap-3 w-full">
      <p className="h4 text-label-alternative">함께할 친구들</p>
      <div className="flex flex-col gap-2 w-full">
        {host && (
          <NamedRow
            avatar={MEETING_AVATARS[host.animal]}
            name={host.nickname}
            badge="방장"
          />
        )}
        {self && members.length === 0 && (
          <NamedRow avatar={selfAvatar} name="나" note="지금 정보 입력 중" />
        )}
        {members.map((member, index) =>
          self && index === 0 ? (
            <NamedRow
              key={index}
              avatar={selfAvatar}
              name="나"
              onRemove={onRemove ? () => onRemove(index) : undefined}
            />
          ) : (
            <MemberRow
              key={index}
              member={member}
              onRemove={onRemove ? () => onRemove(index) : undefined}
            />
          ),
        )}
        {Array.from({ length: emptySlotCount }).map((_, index) => (
          <EmptyMemberSlot key={index} />
        ))}
      </div>
    </div>
  );
};

export default MemberList;
export type { MemberListProps };
