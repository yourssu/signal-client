import GenderChips from "@/components/meeting/GenderChips";
import { FormField } from "@/components/ui/form-field";
import { cn } from "@/lib/utils";
import type { MeetingMemberRequest } from "@/types/meeting";
import type { Gender } from "@/types/profile";
import { useState } from "react";

interface MemberFormProps {
  ageLabel: string;
  showContact?: boolean;
  disabled?: boolean;
  addLabel?: string;
  onAdd: (member: MeetingMemberRequest, contact?: string) => void;
}

const CONTACT_REGEX = /^(?:010[2-9]\d{7}|@[a-zA-Z0-9._]{1,30})$/;

const MemberForm = ({
  ageLabel,
  showContact = false,
  disabled = false,
  addLabel = "친구 추가",
  onAdd,
}: MemberFormProps) => {
  const [birthYear, setBirthYear] = useState("");
  const [department, setDepartment] = useState("");
  const [contact, setContact] = useState("");
  const [gender, setGender] = useState<Gender>();

  const isBirthYearValid = /^\d{4}$/.test(birthYear);
  const isDepartmentValid = department.trim().length > 0;
  const isContactValid = !showContact || CONTACT_REGEX.test(contact);
  const isFormValid =
    isBirthYearValid && isDepartmentValid && !!gender && isContactValid;
  const showContactError =
    showContact && contact.length > 0 && !CONTACT_REGEX.test(contact);

  const handleAdd = () => {
    if (disabled || !isFormValid || !gender) return;

    onAdd(
      {
        birthYear: Number(birthYear),
        department: department.trim(),
        gender,
      },
      showContact ? contact : undefined,
    );

    setBirthYear("");
    setDepartment("");
    setContact("");
    setGender(undefined);
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      <FormField
        label={ageLabel}
        placeholder="년생을 입력해주세요(4자리)"
        inputMode="numeric"
        maxLength={4}
        value={birthYear}
        onChange={(e) =>
          setBirthYear(e.target.value.replace(/\D/g, "").slice(0, 4))
        }
      />
      <FormField
        label="학과"
        placeholder="학과를 넣어주세요"
        value={department}
        onChange={(e) => setDepartment(e.target.value)}
      />
      {showContact && (
        <FormField
          label="연락처"
          placeholder="전화번호 또는 인스타그램 아이디를 적어주세요"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          state={showContactError ? "error" : "default"}
          errorText={
            showContactError ? "올바른 연락처 형식이 아니에요" : undefined
          }
        />
      )}
      <GenderChips value={gender} onChange={setGender} />
      <button
        type="button"
        disabled={disabled || !isFormValid}
        onClick={handleAdd}
        className={cn(
          "self-end bg-primary rounded-lg px-3 py-1.5 text-static-white caption1",
          (disabled || !isFormValid) && "bg-line-normal cursor-not-allowed",
        )}
      >
        {addLabel}
      </button>
    </div>
  );
};

export default MemberForm;
export type { MemberFormProps };
