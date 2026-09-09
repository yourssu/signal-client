import React, { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import TopBar from "@/components/Header";
import MemberForm from "@/components/meeting/MemberForm";
import MemberList from "@/components/meeting/MemberList";
import { useUser } from "@/hooks/useUser";
import { useMatchMeetingRoom, useMeetingRoom } from "@/hooks/queries/meetings";
import { getMeetingErrorMessage, getRoomEndedReason } from "@/lib/meeting";
import { useNow } from "@/hooks/useNow";
import { cn } from "@/lib/utils";
import type { MeetingMemberRequest } from "@/types/meeting";

const LobbyJoinPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { profile } = useUser();
  const { roomId } = useParams<{ roomId: string }>();
  const numericRoomId = Number(roomId);

  // 시트가 채워둔 캐시를 그대로 믿으면 끝난 방에도 폼이 열린다. 진입할 때마다 다시 확인한다.
  const { data: roomDetail, error: roomError } = useMeetingRoom(numericRoomId, {
    refetchOnMount: "always",
  });
  const { mutate: matchRoom, isPending: isMatching } =
    useMatchMeetingRoom(numericRoomId);

  // 폼을 채우는 사이에 방이 끝날 수 있어 초 단위로 다시 판단한다.
  const now = useNow(1000);
  const endedReason = roomDetail
    ? getRoomEndedReason(roomDetail.room, now)
    : null;

  // 프로필이 있으면 대표는 내 정보로 채운다. 같은 걸 또 적게 할 이유가 없다.
  const selfMember: MeetingMemberRequest | null = profile
    ? {
        gender: profile.gender,
        birthYear: profile.birthYear,
        department: profile.department,
      }
    : null;

  // 프로필이 없을 때만 첫 입력자가 대표가 되고, 연락처도 그때 받는다.
  const [members, setMembers] = useState<MeetingMemberRequest[]>([]);
  const [typedContact, setTypedContact] = useState<string>();
  const contact = profile?.contact ?? typedContact;

  const partySize = roomDetail?.room.partySize ?? 0;
  // 내 자리가 이미 찼으면 친구만 채우면 된다.
  const neededCount = selfMember ? partySize - 1 : partySize;
  const isFull = partySize > 0 && members.length >= neededCount;
  const canSubmit = isFull && !!contact;

  const handleAdd = (member: MeetingMemberRequest, memberContact?: string) => {
    if (isFull) return;
    if (!selfMember && members.length === 0 && memberContact) {
      setTypedContact(memberContact);
    }
    setMembers((prev) => [...prev, member]);
  };

  const handleRemove = (index: number) => {
    if (!selfMember && members.length === 1) {
      setTypedContact(undefined);
    }
    setMembers((prev) => prev.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    if (!canSubmit || !contact) return;
    const [representative, ...companions] = selfMember
      ? [selfMember, ...members]
      : members;
    matchRoom(
      { representative, contact, companions },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["meetings", "board"] });
          navigate("/lobby");
        },
        onError: (error) => {
          toast.error(
            getMeetingErrorMessage(error.code, "미팅에 참여하지 못했어요"),
          );
        },
      },
    );
  };

  // 방을 못 불러왔으면 참여할 수 없다.
  useEffect(() => {
    if (!roomError) return;
    toast.error(
      getMeetingErrorMessage(roomError.code, "방 정보를 불러오지 못했어요"),
      { id: "meeting-join-room-error" },
    );
    navigate("/lobby", { replace: true });
  }, [roomError, navigate]);

  // 조회는 성공해도 끝난 방일 수 있다. 폼을 열어두면 다 채운 뒤에야 거절당한다.
  useEffect(() => {
    if (!endedReason) return;
    toast.error(
      getMeetingErrorMessage(endedReason, "참여할 수 없는 방이에요"),
      {
        id: "meeting-join-room-ended",
      },
    );
    navigate("/lobby", { replace: true });
  }, [endedReason, navigate]);

  if (!roomId || Number.isNaN(numericRoomId)) {
    return <Navigate to="/lobby" replace />;
  }

  // 정원을 알아야 폼을 그릴 수 있다. 조회 실패와 끝난 방은 위 effect가 로비로 되돌린다.
  if (!roomDetail || endedReason) {
    return (
      <div className="flex h-full flex-col bg-white">
        <title>미팅 참여하기 - 시그널</title>
        <TopBar onBack="/lobby" hideInfo />
        <div className="flex flex-1 items-center justify-center">
          <p className="text-label-neutral text-lg">방 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-white">
      <title>미팅 참여하기 - 시그널</title>
      <TopBar onBack="/lobby" hideInfo />

      <div className="flex flex-col gap-1.5 px-[18px] py-3">
        <h1 className="h1 text-label-normal">
          {`${partySize}명이 기다리고 있어요`}
        </h1>
        <p className="body1 text-label-alternative">
          {selfMember
            ? "함께할 친구를 알려주세요"
            : members.length === 0
              ? "나의 정보를 적어주세요"
              : "참여자 정보를 적어주세요"}
        </p>
      </div>

      <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-[18px]">
        <MemberForm
          ageLabel="나이"
          showContact={!selfMember && members.length === 0}
          disabled={isFull}
          addLabel="추가하기"
          onAdd={handleAdd}
        />
        <MemberList
          host={
            profile ? { nickname: "나", animal: profile.animal } : undefined
          }
          self={profile ? undefined : { animal: undefined }}
          members={members}
          // 본인 행이 입력 전에도 한 칸을 차지하므로 정원에서 함께 뺀다.
          emptySlotCount={
            selfMember
              ? neededCount - members.length
              : partySize - Math.max(members.length, 1)
          }
          onRemove={handleRemove}
        />
      </div>

      <div className="shrink-0 px-[18px] pt-3 pb-8">
        <button
          type="button"
          onClick={handleNext}
          disabled={!canSubmit || isMatching}
          className={cn(
            "button-l h-14 w-full rounded-2xl text-static-white",
            canSubmit && !isMatching ? "bg-primary" : "bg-line-normal",
          )}
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default LobbyJoinPage;
