import React from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router";
import { useFunnel } from "@use-funnel/react-router";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import TopBar from "@/components/Header";
import MemberForm from "@/components/meeting/MemberForm";
import MemberList from "@/components/meeting/MemberList";
import InvitationStep from "@/components/meeting/InvitationStep";
import { useUser } from "@/hooks/useUser";
import { useCreateMeetingRoom } from "@/hooks/queries/meetings";
import { getMeetingErrorMessage, MEETING_SLOTS } from "@/lib/meeting";
import {
  roomCreateCompleteClick,
  roomOnboardingNextClick,
} from "@/lib/analytics";
import { cn } from "@/lib/utils";
import type { MeetingMemberRequest, MeetingSlot } from "@/types/meeting";

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
  const queryClient = useQueryClient();
  const { profile } = useUser();
  const [searchParams] = useSearchParams();
  const slotParam = searchParams.get("slot");
  const slot = MEETING_SLOTS.find((s) => s === slotParam) ?? null;
  const { mutate: createRoom, isPending: isCreating } = useCreateMeetingRoom();
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
    roomOnboardingNextClick({
      members: funnel.context.members,
      leader: profile,
    });
    funnel.history.push("invitation", funnel.context);
  };

  const handleInvitationChange = (invitation: string) => {
    funnel.history.replace("invitation", { ...funnel.context, invitation });
  };

  const handleCreate = (targetSlot: MeetingSlot) => {
    roomCreateCompleteClick(funnel.context.invitation.trim());
    createRoom(
      {
        slot: targetSlot,
        invitation: funnel.context.invitation.trim(),
        companions: funnel.context.members,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["meetings", "board"] });
          navigate("/lobby");
        },
        onError: (error) => {
          toast.error(
            getMeetingErrorMessage(error.code, "방을 만들지 못했어요"),
          );
        },
      },
    );
  };

  const handleBack = () => {
    if (funnel.step === "members") {
      navigate("/lobby");
      return;
    }
    funnel.history.back();
  };

  // 어느 자리에 만들지는 로비에서 핀을 눌러야 정해진다.
  if (!slot) return <Navigate to="/lobby" replace />;

  return (
    <div className="flex h-full flex-col bg-white">
      <TopBar onBack={handleBack} hideInfo />
      <funnel.Render
        members={() => {
          // 정원은 방장을 포함한다. 친구를 한 명도 안 넣었으면 1인 방이 되므로 숫자를 쓰지 않는다.
          const friendCount = funnel.context.members.length;
          return (
            <>
              <title>함께할 친구를 알려주세요 - 시그널</title>
              <div className="flex flex-col gap-1.5 px-[18px] py-3">
                <h1 className="h1 text-label-normal">
                  함께할 친구를 알려주세요
                </h1>
                <p className="body1 text-label-alternative">
                  최대 4명까지 추가할 수 있어요
                </p>
              </div>
              <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-[18px]">
                <MemberForm
                  ageLabel="출생연도"
                  disabled={friendCount >= MAX_FRIEND_COUNT}
                  onAdd={handleAddMember}
                />
                <MemberList
                  host={
                    profile
                      ? { nickname: profile.nickname, animal: profile.animal }
                      : undefined
                  }
                  members={funnel.context.members}
                  emptySlotCount={MAX_FRIEND_COUNT - friendCount}
                  onRemove={handleRemoveMember}
                />
              </div>
              <div className="shrink-0 px-[18px] pt-3 pb-8">
                <button
                  type="button"
                  disabled={friendCount === 0}
                  onClick={handleMembersNext}
                  className={cn(
                    "button-l h-14 w-full rounded-2xl text-static-white",
                    friendCount > 0 ? "bg-primary" : "bg-line-normal",
                  )}
                >
                  {friendCount > 0 ? `${friendCount + 1}인 방 만들기` : "다음"}
                </button>
              </div>
            </>
          );
        }}
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
                  disabled={!isInvitationValid || isCreating}
                  onClick={() => handleCreate(slot)}
                  className={cn(
                    "button-l h-14 w-full rounded-2xl text-static-white",
                    isInvitationValid && !isCreating
                      ? "bg-primary"
                      : "bg-line-normal",
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
