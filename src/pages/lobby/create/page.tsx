import React from "react";
import { useNavigate } from "react-router";
import { useFunnel } from "@use-funnel/react-router";
import TopBar from "@/components/Header";
import MemberForm from "@/components/meeting/MemberForm";
import MemberList from "@/components/meeting/MemberList";
import InvitationStep from "@/components/meeting/InvitationStep";
import { useUser } from "@/hooks/useUser";
import { cn } from "@/lib/utils";
import type { MeetingMemberRequest } from "@/types/meeting";

type CreateMeetingContext = {
  members: MeetingMemberRequest[];
  invitation: string;
};

type CreateMeetingFunnel = {
  members: CreateMeetingContext;
  invitation: CreateMeetingContext;
};

const MAX_FRIEND_COUNT = 3;

const MeetingCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { profile } = useUser();
  const funnel = useFunnel<CreateMeetingFunnel>({
    id: "meeting.create",
    initial: {
      step: "members",
      context: { members: [], invitation: "" },
    },
  });

  const handleAddMember = (member: MeetingMemberRequest) => {
    funnel.history.replace(funnel.step, {
      ...funnel.context,
      members: [...funnel.context.members, member],
    });
  };

  const handleRemoveMember = (index: number) => {
    funnel.history.replace(funnel.step, {
      ...funnel.context,
      members: funnel.context.members.filter((_, i) => i !== index),
    });
  };

  const handleMembersNext = () => {
    funnel.history.push("invitation", funnel.context);
  };

  const handleInvitationChange = (invitation: string) => {
    funnel.history.replace("invitation", { ...funnel.context, invitation });
  };

  const handleCreate = () => {
    // TODO: 방 생성 API 연결
    navigate("/lobby");
  };

  const handleBack = () => {
    if (funnel.step === "members") {
      navigate("/lobby");
      return;
    }
    funnel.history.back();
  };

  return (
    <div className="flex h-full flex-col bg-white">
      <TopBar onBack={handleBack} hideInfo />
      <funnel.Render
        members={() => (
          <>
            <title>함께할 친구를 알려주세요 - 시그널</title>
            <div className="flex flex-col gap-1.5 px-[18px] py-3">
              <h1 className="h1 text-label-normal">함께할 친구를 알려주세요</h1>
              <p className="body1 text-label-alternative">
                미팅에 보여질 기본 정보만 입력하면 돼요
              </p>
            </div>
            <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-[18px]">
              <MemberForm
                ageLabel="출생연도"
                disabled={funnel.context.members.length >= MAX_FRIEND_COUNT}
                onAdd={handleAddMember}
              />
              <MemberList
                host={
                  profile
                    ? { nickname: profile.nickname, animal: profile.animal }
                    : undefined
                }
                members={funnel.context.members}
                emptySlotCount={
                  MAX_FRIEND_COUNT - funnel.context.members.length
                }
                onRemove={handleRemoveMember}
              />
            </div>
            <div className="shrink-0 px-[18px] pt-3 pb-8">
              <button
                type="button"
                disabled={funnel.context.members.length === 0}
                onClick={handleMembersNext}
                className={cn(
                  "button-l h-14 w-full rounded-2xl text-static-white",
                  funnel.context.members.length > 0
                    ? "bg-primary"
                    : "bg-line-normal",
                )}
              >
                다음
              </button>
            </div>
          </>
        )}
        invitation={() => {
          const isInvitationValid = funnel.context.invitation.trim().length > 0;
          return (
            <>
              <title>오늘 뭐 하자고 해볼까요? - 시그널</title>
              <div className="flex flex-col gap-1.5 px-[18px] py-3">
                <h1 className="h1 text-label-normal">
                  오늘 뭐 하자고 해볼까요?
                </h1>
                <p className="body1 text-label-alternative">
                  만나서 하고 싶은 걸 가볍게 적어주세요
                </p>
              </div>
              <div className="flex flex-1 flex-col overflow-y-auto px-[18px]">
                <InvitationStep
                  value={funnel.context.invitation}
                  onChange={handleInvitationChange}
                />
              </div>
              <div className="shrink-0 px-[18px] pt-3 pb-8">
                <button
                  type="button"
                  disabled={!isInvitationValid}
                  onClick={handleCreate}
                  className={cn(
                    "button-l h-14 w-full rounded-2xl text-static-white",
                    isInvitationValid ? "bg-primary" : "bg-line-normal",
                  )}
                >
                  생성하기
                </button>
              </div>
            </>
          );
        }}
      />
    </div>
  );
};

export default MeetingCreatePage;
