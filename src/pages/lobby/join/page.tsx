import React, { useState } from "react";
import {
  Navigate,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router";
import TopBar from "@/components/Header";
import MemberForm from "@/components/meeting/MemberForm";
import MemberList from "@/components/meeting/MemberList";
import { cn } from "@/lib/utils";
import type { MeetingMemberRequest } from "@/types/meeting";

const DEFAULT_PARTY_SIZE = 4;

const LobbyJoinPage: React.FC = () => {
  const navigate = useNavigate();
  const { roomId } = useParams<{ roomId: string }>();
  const [searchParams] = useSearchParams();
  // TODO: 방 정보 API 연동 시 partySize를 응답값으로 교체
  const partySize = Number(searchParams.get("partySize") ?? DEFAULT_PARTY_SIZE);

  const [members, setMembers] = useState<MeetingMemberRequest[]>([]);
  const [contact, setContact] = useState<string>();

  const isFull = members.length >= partySize;
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
    if (!canSubmit) return;
    // TODO: roomId로 참여 매칭 API 연동 (members, contact 전송) 후 결과 화면으로 이동
    navigate("/lobby");
  };

  if (!roomId) return <Navigate to="/lobby" replace />;

  return (
    <div className="flex h-full flex-col bg-white">
      <title>미팅 참여하기 - 시그널</title>
      <TopBar onBack="/lobby" />

      <div className="flex flex-col gap-1.5 px-[18px] py-3">
        <h1 className="h1 text-label-normal">
          {`${partySize}명이 기다리고 있어요`}
        </h1>
        <p className="body1 text-label-alternative">참여자 정보를 적어주세요</p>
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
          members={members}
          emptySlotCount={partySize - members.length}
          onRemove={handleRemove}
        />
      </div>

      <div className="shrink-0 px-[18px] pt-3 pb-8">
        <button
          type="button"
          onClick={handleNext}
          disabled={!canSubmit}
          className={cn(
            "button-l h-14 w-full rounded-2xl text-static-white",
            canSubmit ? "bg-primary" : "bg-line-normal",
          )}
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default LobbyJoinPage;
