import { useEffect, useState } from "react";

import ConfirmDialog from "@/components/lobby/ConfirmDialog";
import type { Gender } from "@/types/profile";

interface GenderRestrictionDialogProps {
  /** 신청할 수 있는 성별. null이면 제약이 없어 다이얼로그도 뜨지 않는다. */
  requiredGender: Gender | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export default function GenderRestrictionDialog({
  requiredGender,
  onOpenChange,
  onConfirm,
}: GenderRestrictionDialogProps) {
  // 닫히는 애니메이션 동안 requiredGender가 null로 떨어지면 문구가 반대 성별로 깜빡인다.
  const [lastGender, setLastGender] = useState<Gender | null>(null);
  useEffect(() => {
    if (requiredGender) setLastGender(requiredGender);
  }, [requiredGender]);

  const shownGender = requiredGender ?? lastGender;
  const allowed = shownGender === "MALE" ? "남자" : "여자";
  const blocked = shownGender === "MALE" ? "여자" : "남자";

  return (
    <ConfirmDialog
      open={requiredGender !== null}
      onOpenChange={onOpenChange}
      title={`${allowed}만 신청 가능한 방이에요`}
      description={
        <>
          {blocked}의 경우 매칭이 불가능하니
          <br />
          주의해주세요
        </>
      }
      cancelLabel="취소"
      confirmLabel="방 참여하기"
      onConfirm={onConfirm}
    />
  );
}
