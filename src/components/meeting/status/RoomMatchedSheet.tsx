import { Fragment, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import RoomStepper from "@/components/meeting/status/RoomStepper";
import { getMemberSummaryParts, MEMBER_PART_SEPARATOR } from "@/lib/meeting";
import { cn, formatPhone, getDeviceType } from "@/lib/utils";
import type { MeetingMemberResponse, MeetingTeamSide } from "@/types/meeting";
import contactPhoneIcon from "@/assets/lobby/contact_phone.svg";

interface RoomMatchedSheetProps {
  open: boolean;
  teamSide: MeetingTeamSide;
  counterpartContact: string;
  members: MeetingMemberResponse[];
  invitation: string;
}

/** 이 이하로 움직이면 끌었다기보다 눌렀다고 본다. */
const DRAG_THRESHOLD_PX = 24;

const buildInvitationMessage = (invitation: string) =>
  `안녕하세요! 모두의 시그널에서 매칭돼 연락드려요 :) 오늘 ${invitation} 같이 하실래요? 가능한 시간 알려주세요!`;

const buildSmsHref = (contact: string, message: string) => {
  const separator = getDeviceType() === "ios" ? "&" : "?";
  return `sms:${contact}${separator}body=${encodeURIComponent(message)}`;
};

export default function RoomMatchedSheet({
  open,
  teamSide,
  counterpartContact,
  members,
  invitation,
}: RoomMatchedSheetProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const dragStartY = useRef<number | null>(null);
  const draggedRef = useRef(false);

  const handleHandleDown = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (!event.isPrimary) return;
    dragStartY.current = event.clientY;
    draggedRef.current = false;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleHandleUp = (event: React.PointerEvent<HTMLButtonElement>) => {
    const startY = dragStartY.current;
    dragStartY.current = null;
    if (startY === null) return;

    // 짧게 움직였으면 누른 것으로 보고 click에 맡긴다. 키보드도 그 경로로 온다.
    if (Math.abs(event.clientY - startY) < DRAG_THRESHOLD_PX) return;
    draggedRef.current = true;
    setIsCollapsed(event.clientY > startY);
  };

  const handleHandleClick = () => {
    if (draggedRef.current) {
      draggedRef.current = false;
      return;
    }
    setIsCollapsed((prev) => !prev);
  };

  const isCreator = teamSide === "CREATOR";
  const isInstagram = counterpartContact.startsWith("@");
  const displayContact = isInstagram
    ? counterpartContact
    : formatPhone(counterpartContact);
  const invitationMessage = buildInvitationMessage(invitation);
  const contactHref = isInstagram
    ? `https://www.instagram.com/${counterpartContact.slice(1)}`
    : buildSmsHref(counterpartContact, invitationMessage);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(invitationMessage);
      toast.success("문자 내용이 복사됐어요! 바로 연락해보세요");
    } catch {
      toast.error("복사에 실패했어요. 연락처를 직접 눌러 확인해주세요");
    }
  };

  if (!open) return null;

  return (
    <div
      className={cn(
        "flex w-full flex-col gap-3 rounded-[20px] bg-white pt-2.5 drop-shadow-[1px_1px_4px_rgba(0,0,0,0.25)]",
        isCollapsed ? "px-4 pb-4" : "px-5 pb-5",
      )}
    >
      <button
        type="button"
        aria-expanded={!isCollapsed}
        aria-label={isCollapsed ? "미팅 정보 펼치기" : "미팅 정보 접기"}
        onPointerDown={handleHandleDown}
        onPointerUp={handleHandleUp}
        onClick={handleHandleClick}
        className="mx-auto touch-none py-1"
      >
        <span className="bg-line-normal block h-1 w-[60px] rounded-full" />
      </button>

      <p className="h3 text-label-strong">
        {isCreator ? "매칭 완료!" : "신청한 미팅"}
      </p>

      {isCreator && <RoomStepper state="matched" />}

      {!isCreator && isCollapsed && (
        <p className="body2 text-label-alternative text-center">
          아래 버튼을 눌러
          <br />
          어디서 만날지 정해보세요
        </p>
      )}

      {!isCollapsed && (
        <>
          <div className="bg-fill-normal flex items-center justify-between rounded-lg p-3">
            <span className="body2 text-label-alternative">
              {isCreator ? "상대 팀 연락처" : "방장 연락처"}
            </span>
            <div className="flex items-center gap-1.5">
              {!isInstagram && (
                <img src={contactPhoneIcon} alt="" className="size-5" />
              )}
              <span className="h4 text-label-alternative underline">
                {displayContact}
              </span>
            </div>
          </div>

          <div className="border-line-normal flex flex-col gap-2 rounded-[10px] border px-2 pt-3 pb-2">
            <span className="body2 text-label-neutral px-2">상대 정보</span>
            <div className="flex flex-col">
              {members.map((member, index) => (
                <div
                  key={index}
                  className={cn(
                    "body2 text-label-alternative flex items-center gap-0.5 p-2",
                    index !== members.length - 1 &&
                      "border-line-normal border-b",
                  )}
                >
                  {getMemberSummaryParts(member).map((part, partIndex) => (
                    <Fragment key={partIndex}>
                      {partIndex > 0 && <span>{MEMBER_PART_SEPARATOR}</span>}
                      <span>{part}</span>
                    </Fragment>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="flex items-start gap-2">
        <Button
          type="button"
          variant="secondary"
          size="xl"
          className="flex-1"
          onClick={handleCopy}
        >
          문자 내용 복사
        </Button>
        <Button asChild size="xl" className="flex-1">
          {isInstagram ? (
            <a href={contactHref} target="_blank" rel="noreferrer">
              연락 보내기
            </a>
          ) : (
            <a href={contactHref}>문자 보내기</a>
          )}
        </Button>
      </div>
    </div>
  );
}

export type { RoomMatchedSheetProps };
