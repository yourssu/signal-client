import { useEffect, useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useMeetingRoom } from "@/hooks/queries/meetings";
import { formatCountdown } from "@/lib/meeting";
import invitationIcon from "@/assets/lobby/invitation.svg";
import type { MeetingMemberResponse } from "@/types/meeting";

interface RoomPreviewSheetProps {
  /** 미리 볼 방. null이면 닫힌다. */
  roomId: number | null;
  onOpenChange: (open: boolean) => void;
  onJoin: (roomId: number, partySize: number) => void;
}

const MemberChip = ({ member }: { member: MeetingMemberResponse }) => (
  <div className="bg-fill-normal caption1 text-label-alternative flex items-center gap-0.5 rounded-full px-2 py-1.5">
    <span>{member.department}</span>
    <span>∙</span>
    <span>{String(member.birthYear % 100).padStart(2, "0")}년생</span>
    <span>∙</span>
    <span>{member.gender === "MALE" ? "남" : "여"}</span>
  </div>
);

export default function RoomPreviewSheet({
  roomId,
  onOpenChange,
  onJoin,
}: RoomPreviewSheetProps) {
  const { data: detail } = useMeetingRoom(roomId ?? 0, {
    enabled: roomId !== null,
    staleTime: Infinity,
  });

  const expiresAt = detail?.room.expiresAt;
  const [remainingMs, setRemainingMs] = useState(0);

  useEffect(() => {
    if (!expiresAt) return;
    const tick = () =>
      setRemainingMs(new Date(expiresAt).getTime() - Date.now());
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [expiresAt]);

  const room = detail?.room;
  // 방장 팀만 보여준다. 아직 참여자가 없으므로 상대 팀은 비어 있다.
  const members =
    detail?.members.filter((member) => member.teamSide === "CREATOR") ?? [];

  return (
    <Drawer open={roomId !== null} onOpenChange={onOpenChange}>
      <DrawerContent className="items-center gap-5 bg-white px-5 pb-4">
        <DrawerTitle className="sr-only">미팅 방 정보</DrawerTitle>
        <DrawerDescription className="sr-only">
          방장과 참여자를 확인하고 참여할 수 있어요
        </DrawerDescription>

        {room && (
          <>
            <div className="flex w-full flex-col gap-3">
              <div className="bg-fill-normal flex flex-col gap-2 rounded-xl px-4 py-3">
                <div className="flex items-center gap-1">
                  <span className="caption2 text-label-alternative">방장</span>
                  <span className="caption1 text-label-neutral">
                    {room.creatorNickname}
                  </span>
                </div>
                <div className="flex items-center gap-0.5">
                  <img src={invitationIcon} alt="" className="size-4" />
                  <span className="h4 text-label-neutral">
                    {room.invitation}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="caption2 text-label-assistive">참여자</span>
                <div className="flex w-full flex-wrap gap-1.5">
                  {members.map((member, index) => (
                    <MemberChip key={index} member={member} />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex w-full flex-col items-center gap-2">
              <span className="caption1 text-primary">
                방 폭파까지 {formatCountdown(remainingMs)}초 남았어요
              </span>
              <button
                type="button"
                onClick={() => onJoin(room.id, room.partySize)}
                className="button-l bg-primary text-static-white h-14 w-full rounded-2xl"
              >
                참여하기
              </button>
            </div>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
}
