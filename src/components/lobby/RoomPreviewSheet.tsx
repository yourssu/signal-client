import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useMeetingRoom } from "@/hooks/queries/meetings";
import {
  formatRemainingDetail,
  getMeetingErrorMessage,
  getMemberSummaryParts,
  MEMBER_PART_SEPARATOR,
} from "@/lib/meeting";
import invitationIcon from "@/assets/lobby/invitation.svg";
import type { MeetingMemberResponse } from "@/types/meeting";

interface RoomPreviewSheetProps {
  /** 미리 볼 방. null이면 닫힌다. */
  roomId: number | null;
  onOpenChange: (open: boolean) => void;
  onJoin: (roomId: number) => void;
}

const MemberChip = ({ member }: { member: MeetingMemberResponse }) => (
  <div className="bg-fill-normal caption1 text-label-alternative flex items-center gap-0.5 rounded-full px-2 py-1.5">
    {getMemberSummaryParts(member).map((part, index) => (
      <Fragment key={index}>
        {index > 0 && <span>{MEMBER_PART_SEPARATOR}</span>}
        <span>{part}</span>
      </Fragment>
    ))}
  </div>
);

export default function RoomPreviewSheet({
  roomId,
  onOpenChange,
  onJoin,
}: RoomPreviewSheetProps) {
  // roomId가 null이 되어도 마지막 방을 들고 있어야 닫히는 0.5초 동안 내용이 남는다.
  const [shownRoomId, setShownRoomId] = useState<number | null>(null);
  useEffect(() => {
    if (roomId !== null) setShownRoomId(roomId);
  }, [roomId]);

  const {
    data: detail,
    isPending,
    error,
  } = useMeetingRoom(shownRoomId ?? 0, {
    enabled: shownRoomId !== null && roomId !== null,
    staleTime: Infinity,
  });

  const close = useCallback(() => onOpenChange(false), [onOpenChange]);

  useEffect(() => {
    if (roomId === null || !error) return;
    toast.error(
      getMeetingErrorMessage(error.code, "방 정보를 불러오지 못했어요"),
      {
        id: "meeting-preview-error",
      },
    );
    close();
  }, [roomId, error, close]);

  const expiresAt = detail?.room.expiresAt;
  const [remainingMs, setRemainingMs] = useState(0);
  const expiredRef = useRef(false);

  useEffect(() => {
    if (roomId === null || !expiresAt) return;
    expiredRef.current = false;

    const tick = () => {
      const next = new Date(expiresAt).getTime() - Date.now();
      setRemainingMs(next);
      if (!Number.isFinite(next) || next > 0 || expiredRef.current) return;
      // 끝난 방으로 참여 폼에 들어가면 인원을 다 넣은 뒤에야 거절당한다.
      expiredRef.current = true;
      toast.error("방이 종료됐어요", { id: "meeting-preview-expired" });
      close();
    };

    const timer = window.setInterval(tick, 1000);
    tick();
    return () => clearInterval(timer);
  }, [roomId, expiresAt, close]);

  const room = detail?.room;
  // 목·서버 모두 양 팀을 함께 내려주므로 방장 팀만 골라낸다.
  const members =
    detail?.members.filter((member) => member.teamSide === "CREATOR") ?? [];

  return (
    <Drawer open={roomId !== null} onOpenChange={onOpenChange}>
      <DrawerContent className="items-center gap-5 bg-white px-5 pb-4">
        <DrawerTitle className="sr-only">미팅 방 정보</DrawerTitle>
        <DrawerDescription className="sr-only">
          방장과 참여자를 확인하고 참여할 수 있어요
        </DrawerDescription>

        {isPending && !room ? (
          <p className="text-label-neutral py-10 text-lg">
            방 정보를 불러오는 중...
          </p>
        ) : (
          room && (
            <>
              <div className="flex w-full flex-col gap-3">
                <div className="bg-fill-normal flex flex-col gap-2 rounded-xl px-4 py-3">
                  <div className="flex items-center gap-1">
                    <span className="caption2 text-label-alternative">
                      방장
                    </span>
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
                    {members.map((member) => (
                      <MemberChip key={member.memberOrder} member={member} />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex w-full flex-col items-center gap-2">
                <span className="caption1 text-primary">
                  방 폭파까지 {formatRemainingDetail(remainingMs)} 남았어요
                </span>
                <button
                  type="button"
                  onClick={() => onJoin(room.id)}
                  className="button-l bg-primary text-static-white h-14 w-full rounded-2xl"
                >
                  참여하기
                </button>
              </div>
            </>
          )
        )}
      </DrawerContent>
    </Drawer>
  );
}
