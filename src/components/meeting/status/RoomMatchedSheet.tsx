import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import RoomStepper from "@/components/meeting/status/RoomStepper";
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
    <div className="flex w-full flex-col gap-3 rounded-[20px] bg-white p-5 pt-2.5 drop-shadow-[1px_1px_4px_rgba(0,0,0,0.25)]">
      <div className="bg-line-normal mx-auto h-1 w-[60px] rounded-full" />

      <p className="h3 text-label-strong">
        {isCreator ? "매칭 완료!" : "신청한 미팅"}
      </p>

      <RoomStepper state="matched" />

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
                index !== members.length - 1 && "border-line-normal border-b",
              )}
            >
              <span>{member.department}</span>
              <span>·</span>
              <span>{String(member.birthYear % 100).padStart(2, "0")}년생</span>
              <span>·</span>
              <span>{member.gender === "MALE" ? "남" : "여"}</span>
            </div>
          ))}
        </div>
      </div>

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
