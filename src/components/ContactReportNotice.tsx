import { useState } from "react";
import { toast } from "sonner";
import ContactReportDialog from "@/components/ContactReportDialog";
import {
  getReportErrorMessage,
  useCreateReport,
} from "@/hooks/queries/reports";
import { profileReportClick } from "@/lib/analytics";
import { cn } from "@/lib/utils";

interface ContactReportNoticeProps {
  profileId: number;
  contact: string;
  /** 택소노미의 source_page. 연락처 열람 직후는 signal_contact, 구매 목록은 my_page다. */
  sourcePage: string;
  className?: string;
}

export default function ContactReportNotice({
  profileId,
  contact,
  sourcePage,
  className,
}: ContactReportNoticeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { mutate: createReport, isPending } = useCreateReport();

  const handleClick = () => {
    profileReportClick({
      targetUserId: profileId,
      sourcePage,
      targetUserContactAdress: contact,
    });
    setIsOpen(true);
  };

  const handleConfirm = () => {
    createReport(
      { profileId },
      {
        onSuccess: () => {
          setIsOpen(false);
          toast.success("제보해 주셔서 감사해요! 확인 후 티켓이 지급돼요");
        },
        onError: (error) => {
          // 이미 제보했거나 열람하지 않은 프로필은 다시 눌러도 소용없다.
          setIsOpen(false);
          toast.error(getReportErrorMessage(error));
        },
      },
    );
  };

  return (
    <>
      <p
        className={cn("caption1 text-label-alternative text-center", className)}
      >
        등록된 아이디가 이상하다면?{" "}
        <button type="button" onClick={handleClick} className="underline">
          제보하기
        </button>
      </p>
      <ContactReportDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        onConfirm={handleConfirm}
        confirmDisabled={isPending}
      />
    </>
  );
}
