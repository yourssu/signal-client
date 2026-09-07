import React, { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import TopBar from "@/components/Header";
import MemberForm from "@/components/meeting/MemberForm";
import MemberList from "@/components/meeting/MemberList";
import { useUser } from "@/hooks/useUser";
import { useMatchMeetingRoom, useMeetingRoom } from "@/hooks/queries/meetings";
import { getMeetingErrorMessage } from "@/lib/meeting";
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

  const [members, setMembers] = useState<MeetingMemberRequest[]>([]);
  const [contact, setContact] = useState<string>();

  const partySize = roomDetail?.room.partySize ?? 0;
  const isFull = partySize > 0 && members.length >= partySize;
  const canSubmit = isFull && !!contact;

  const handleAdd = (member: MeetingMemberRequest, memberContact?: string) => {
    if (isFull) return;
    if (members.length === 0 && memberContact) {
      setContact(memberContact);
    }
    setMembers((prev) => [...prev, member]);
  };

  const handleRemove = (index: number) => {
    if (members.length === 1) {
      setContact(undefined);
    }
    setMembers((prev) => prev.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    if (!canSubmit || !contact) return;
    const [representative, ...companions] = members;
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

  // 방이 없거나 이미 끝났으면 참여할 수 없다.
  useEffect(() => {
    if (!roomError) return;
    toast.error(
      getMeetingErrorMessage(roomError.code, "방 정보를 불러오지 못했어요"),
      { id: "meeting-join-room-error" },
    );
    navigate("/lobby", { replace: true });
  }, [roomError, navigate]);

  if (!roomId || Number.isNaN(numericRoomId)) {
    return <Navigate to="/lobby" replace />;
  }

  // 정원을 알아야 폼을 그릴 수 있다. 조회 실패는 위 effect가 로비로 되돌린다.
  if (!roomDetail) {
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
          {members.length === 0
            ? "나의 정보를 적어주세요"
            : "참여자 정보를 적어주세요"}
        </p>
      </div>

      <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-[18px]">
        <MemberForm
          ageLabel="나이"
          showContact={members.length === 0}
          disabled={isFull}
          addLabel="추가하기"
          onAdd={handleAdd}
        />
        <MemberList
          self={{ animal: profile?.animal }}
          members={members}
          // 본인 행이 입력 전에도 한 칸을 차지하므로 정원에서 함께 뺀다.
          emptySlotCount={partySize - Math.max(members.length, 1)}
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
