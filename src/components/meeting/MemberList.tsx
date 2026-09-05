import EmptyMemberSlot from "@/components/meeting/EmptyMemberSlot";
import MemberRow from "@/components/meeting/MemberRow";
import avatarBear from "@/assets/lobby/avatar_bear.svg";
import avatarCat from "@/assets/lobby/avatar_cat.svg";
import avatarDeer from "@/assets/lobby/avatar_deer.svg";
import avatarDinosaur from "@/assets/lobby/avatar_dinosaur.svg";
import avatarDog from "@/assets/lobby/avatar_dog.svg";
import avatarFox from "@/assets/lobby/avatar_fox.svg";
import avatarHamster from "@/assets/lobby/avatar_hamster.svg";
import avatarRabbit from "@/assets/lobby/avatar_rabbit.svg";
import avatarTurtle from "@/assets/lobby/avatar_turtle.svg";
import avatarWolf from "@/assets/lobby/avatar_wolf.svg";
import type { MeetingMemberRequest } from "@/types/meeting";
import type { AnimalType } from "@/types/profile";

interface MemberListProps {
  host?: { nickname: string; animal: AnimalType };
  members: MeetingMemberRequest[];
  emptySlotCount: number;
  onRemove?: (index: number) => void;
}

const HOST_AVATARS: Record<AnimalType, string> = {
  HAMSTER: avatarHamster,
  CAT: avatarCat,
  DOG: avatarDog,
  WOLF: avatarWolf,
  FOX: avatarFox,
  BEAR: avatarBear,
  DEER: avatarDeer,
  TURTLE: avatarTurtle,
  DINOSAUR: avatarDinosaur,
  RABBIT: avatarRabbit,
};

const MemberList = ({
  host,
  members,
  emptySlotCount,
  onRemove,
}: MemberListProps) => {
  return (
    <div className="border-t border-line-normal pt-4 flex flex-col gap-3 w-full">
      <p className="h4 text-label-alternative">함께할 친구들</p>
      <div className="flex flex-col gap-2 w-full">
        {host && (
          <div className="border border-line-normal rounded-xl px-3 py-2 flex items-center justify-between">
            <div className="flex gap-2 items-center">
              <img src={HOST_AVATARS[host.animal]} alt="" className="size-8" />
              <p className="h4 text-label-normal">{host.nickname}</p>
            </div>
            <div className="bg-primary-light rounded-lg px-1.5 py-1">
              <p className="caption2 text-primary">방장</p>
            </div>
          </div>
        )}
        {members.map((member, index) => (
          <MemberRow
            key={index}
            member={member}
            onRemove={onRemove ? () => onRemove(index) : undefined}
          />
        ))}
        {Array.from({ length: emptySlotCount }).map((_, index) => (
          <EmptyMemberSlot key={index} />
        ))}
      </div>
    </div>
  );
};

export default MemberList;
export type { MemberListProps };
