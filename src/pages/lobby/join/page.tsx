import React, { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import TopBar from "@/components/Header";
import MemberForm from "@/components/meeting/MemberForm";
import MemberList from "@/components/meeting/MemberList";
import { useUser } from "@/hooks/useUser";
import {
  useMatchMeetingRoom,
  useMeetingBoard,
  useMeetingRoom,
} from "@/hooks/queries/meetings";
import {
  getJoinBlockedReason,
  getMeetingErrorMessage,
  getRoomEndedReason,
  getRequiredApplicantGender,
  hasIneligibleApplicant,
  isMeetingContact,
} from "@/lib/meeting";
import { useNow } from "@/hooks/useNow";
import { roomParticipateOnboardingCompleteClick } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import type { MeetingMemberRequest } from "@/types/meeting";

const LobbyJoinPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { profile, isRefreshed } = useUser();
  const { roomId } = useParams<{ roomId: string }>();
  const numericRoomId = Number(roomId);

  // 시트가 채워둔 캐시를 그대로 믿으면 끝난 방에도 폼이 열린다. 진입할 때마다 다시 확인한다.
  const { data: roomDetail, error: roomError } = useMeetingRoom(numericRoomId, {
    refetchOnMount: "always",
  });
  const { mutate: matchRoom, isPending: isMatching } =
    useMatchMeetingRoom(numericRoomId);
  // 로비를 거치지 않고 주소로 바로 들어와도 막아야 한다. 시트에서만 잠그면 새어 나간다.
  const { data: board } = useMeetingBoard();
  const joinBlockedReason = getJoinBlockedReason(board?.myRoom);

  // 폼을 채우는 사이에 방이 끝날 수 있어 초 단위로 다시 판단한다.
  const now = useNow(1000);
  const endedReason = roomDetail
    ? getRoomEndedReason(roomDetail.room, now)
    : null;

  // 프로필이 있어도 연락처가 미팅에서 쓸 수 있는 형태여야 건너뛸 수 있다.
  // 등록 화면의 검사가 더 느슨해 여기서 거르지 않으면 서버가 마지막에 거절한다.
  const profileContact =
    profile && isMeetingContact(profile.contact) ? profile.contact : null;

  // 대표를 내 정보로 채운다. 같은 걸 또 적게 할 이유가 없다.
  const selfMember: MeetingMemberRequest | null =
    profile && profileContact
      ? {
          gender: profile.gender,
          birthYear: profile.birthYear,
          department: profile.department,
        }
      : null;

  // 대표를 채우지 못하면 첫 입력자가 대표가 되고, 연락처도 그때 받는다.
  const [members, setMembers] = useState<MeetingMemberRequest[]>([]);
  const [typedContact, setTypedContact] = useState<string>();
  const contact = profileContact ?? typedContact;

  const partySize = roomDetail?.room.partySize ?? 0;
  // 내 자리가 이미 찼으면 친구만 채우면 된다.
  const neededCount = selfMember ? partySize - 1 : partySize;
  const isFull = partySize > 0 && members.length >= neededCount;

  // 제출할 때와 같은 식으로 한 번만 조립한다. 판정과 제출이 다른 배열을 보면 어긋난다.
  const applicants = selfMember ? [selfMember, ...members] : members;
  const requiredGender = getRequiredApplicantGender(roomDetail?.members ?? []);
  const isIneligible = hasIneligibleApplicant(requiredGender, applicants);

  const canSubmit = isFull && !!contact && !isIneligible;

  const handleAdd = (member: MeetingMemberRequest, memberContact?: string) => {
    if (isFull) return;
    if (!selfMember && members.length === 0 && memberContact) {
      setTypedContact(memberContact);
    }
    setMembers((prev) => [...prev, member]);
  };

  const handleRemove = (index: number) => {
    // 연락처는 대표 것이다. 대표가 빠지면 남은 사람 것이 아니므로 함께 지운다.
    if (!selfMember && index === 0) {
      setTypedContact(undefined);
    }
    setMembers((prev) => prev.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    if (!canSubmit || !contact) return;
    const [representative, ...companions] = applicants;
    roomParticipateOnboardingCompleteClick([representative, ...companions]);
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

  useEffect(() => {
    if (!joinBlockedReason) return;
    toast.error(getMeetingErrorMessage(joinBlockedReason, "참여할 수 없어요"), {
      id: "meeting-join-blocked",
    });
    navigate("/lobby", { replace: true });
  }, [joinBlockedReason, navigate]);

  if (!roomId || Number.isNaN(numericRoomId)) {
    return <Navigate to="/lobby" replace />;
  }

  // 프로필이 늦게 도착하면 이미 나를 입력한 뒤에 대표가 또 채워져 두 번 들어간다.
  // 있는지 없는지 확정되기 전에는 폼을 열지 않는다.
  const isProfileSettled = !!profile || isRefreshed;

  // 정원을 알아야 폼을 그릴 수 있다. 조회 실패와 끝난 방은 위 effect가 로비로 되돌린다.
  if (!roomDetail || endedReason || joinBlockedReason || !isProfileSettled) {
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
          // 팀 연락처는 하나다. 아직 없으면 계속 받아야 다시 넣을 길이 생긴다.
          showContact={!selfMember && !contact}
          disabled={isFull}
          addLabel="추가하기"
          onAdd={handleAdd}
        />
        <MemberList
          self={{ animal: profile?.animal, filled: !!selfMember }}
          members={members}
          // 본인 행이 입력 전에도 한 칸을 차지하므로 정원에서 함께 뺀다.
          emptySlotCount={
            neededCount - Math.max(members.length, selfMember ? 0 : 1)
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
          {isIneligible ? "조건에 맞지 않는 신청이에요" : "다음"}
        </button>
      </div>
    </div>
  );
};

export default LobbyJoinPage;
