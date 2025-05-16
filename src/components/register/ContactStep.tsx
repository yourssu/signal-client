import { Input } from "@/components/ui/input"; // Import shadcn/ui Input
import { cn, whenPressEnter } from "@/lib/utils";
import React, { useState, useMemo } from "react"; // Import useMemo
import RegisterConfirmationDrawer from "./RegisterConfirmationDrawer";
import { ProfileResponse } from "@/types/profile";
import TermsDrawer from "@/components/register/TermsDrawer";
import { PRIVACY, TERMS } from "@/env";

interface ContactStepProps {
  profile?: ProfileResponse;
  contact?: string;
  onSubmit: (contact: string) => void;
}

const PHONE_REGEX = /^010\d{8}$/; // Regex to validate phone numbers
const INSTAGRAM_REGEX = /^^@[a-zA-Z0-9._]{1,30}$/; // Regex to validate Instagram IDs

const isValidContact = (contact: string): boolean => {
  // Check if the contact is a valid phone number or Instagram ID
  return PHONE_REGEX.test(contact) || INSTAGRAM_REGEX.test(contact);
};

const ContactStep: React.FC<ContactStepProps> = ({
  profile,
  contact: defaultContact,
  onSubmit,
}) => {
  const [contact, setContact] = useState<string>(defaultContact ?? ""); // Initialize with empty string
  const [isValid, setIsValid] = useState<boolean | null>(null); // State to track validity
  const [openTerms, setOpenTerms] = useState(false); // State to track terms modal
  const [openPrivacy, setOpenPrivacy] = useState(false); // State to track privacy modal

  // Validation: Check if contact is not empty
  const isEmpty = useMemo(() => contact.trim() === "", [contact]);

  const handleSubmit = () => {
    handleValidation(contact);
    if (isEmpty || !isValid) return;
    onSubmit(contact.trim());
  };

  const handleValidation = (value: string) => {
    setIsValid(isValidContact(value));
  };

  const submitOnEnter = (e: React.KeyboardEvent<HTMLInputElement>) =>
    whenPressEnter(e, handleSubmit);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContact(e.target.value);
    if (isEmpty) setIsValid(null);
  };

  const handleOpenTerms = () => {
    setOpenTerms(true);
  };

  const handleOpenPrivacy = () => {
    setOpenPrivacy(true);
  };

  return (
    // Main container - Based on Figma Frame 1000011964
    <div className="flex flex-col items-center pt-2 w-full">
      <div className="flex flex-col items-stretch gap-[43px] w-full grow">
        <div className="flex flex-col gap-2.5">
          {/* Progress Indicator - Based on 1412:7355 */}
          <p className="text-xs text-muted-foreground animate-in slide-in-from-bottom fade-in ease-in-out duration-300">
            8 / 8
          </p>
          {/* Using muted-foreground for #525252 */}
          {/* Title - Based on 1412:7357 */}
          <h2 className="text-2xl font-semibold text-stone-700 whitespace-pre-line animate-in slide-in-from-bottom-8 fade-in ease-in-out duration-400">
            시그널이 닿을 수 있도록
            <br />
            <span className="text-primary">
              인스타그램 or 전화번호를 알려주세요
            </span>
          </h2>
        </div>
        <div className="animate-in slide-in-from-bottom-8 fade-in ease-in-out duration-500">
          <Input
            type="text"
            id="contact"
            name="contact"
            value={contact}
            onChange={handleChange}
            onKeyDown={submitOnEnter}
            onBlur={(e) => handleValidation(e.target.value)}
            required
            className="w-full h-12 text-2xl px-2.5"
            placeholder="ex. @yourssu_official"
          />
          <p
            className={cn(
              "text-xs text-muted-foreground",
              isValid === false &&
                !isEmpty &&
                "text-red-500 font-bold animate-shake",
            )}
          >
            전화번호는 숫자만, 인스타그램 아이디는 <strong>@</strong>를 붙여
            입력해주세요.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2 w-full">
        <p className="text-xs text-center mb-2">
          프로필을 등록할 경우, '시그널'{" "}
          <a onClick={handleOpenTerms} className="underline cursor-pointer">
            서비스 이용약관
          </a>
          과<br />
          <a onClick={handleOpenPrivacy} className="underline cursor-pointer">
            개인정보 처리방침
          </a>
          에 동의하는 것으로 간주됩니다.
        </p>
        <RegisterConfirmationDrawer
          disabled={!isValid || isEmpty}
          profile={profile as ProfileResponse}
          contact={contact}
          onConfirm={handleSubmit}
        />
        <TermsDrawer
          open={openTerms}
          onOpenChange={() => setOpenTerms(false)}
          title="서비스 이용약관"
          terms={TERMS}
        />
        <TermsDrawer
          open={openPrivacy}
          onOpenChange={() => setOpenPrivacy(false)}
          title="개인정보 처리방침"
          terms={PRIVACY}
        />
      </div>
    </div>
  );
};

export default ContactStep;
