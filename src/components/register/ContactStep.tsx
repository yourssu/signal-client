import { FormField } from "@/components/ui/form-field";
import { whenPressEnter } from "@/lib/utils";
import React, { useState, useMemo } from "react"; // Import useMemo
import TermsDrawer from "@/components/TermsDrawer";
import { PRIVACY, TERMS } from "@/env";
import { Button } from "@/components/ui/button";

interface ContactStepProps {
  contact?: string;
  onSubmit: (contact: string) => void;
}

const PHONE_REGEX = /^010\d{8}$/; // Regex to validate phone numbers
const INSTAGRAM_REGEX = /^@[a-zA-Z0-9._]{1,30}$/; // Regex to validate Instagram IDs

const isValidContact = (contact: string): boolean => {
  // Check if the contact is a valid phone number or Instagram ID
  return PHONE_REGEX.test(contact) || INSTAGRAM_REGEX.test(contact);
};

const ContactStep: React.FC<ContactStepProps> = ({
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
    const valid = isValidContact(contact);
    setIsValid(valid);
    if (isEmpty || !valid) return;
    onSubmit(contact.trim());
  };

  const handleValidation = (value: string) => {
    setIsValid(isValidContact(value));
  };

  const submitOnEnter = (e: React.KeyboardEvent<HTMLInputElement>) =>
    whenPressEnter(e, handleSubmit);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContact(e.target.value);
    if (e.target.value.trim() === "") setIsValid(null);
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
          <p className="text-lg text-muted-foreground animate-in slide-in-from-bottom fade-in ease-in-out duration-300">
            6 / 6
          </p>
          {/* Using muted-foreground for #525252 */}
          {/* Title - Based on 1412:7357 */}
          <h2 className="text-2xl font-semibold text-stone-700 whitespace-pre-line animate-in slide-in-from-bottom-8 fade-in ease-in-out duration-400">
            연락처를
            <br />
            적어주세요
          </h2>
        </div>
        <div className="animate-in slide-in-from-bottom-8 fade-in ease-in-out duration-500">
          <FormField
            type="text"
            id="contact"
            name="contact"
            value={contact}
            onChange={handleChange}
            onKeyDown={submitOnEnter}
            onBlur={(e) => handleValidation(e.target.value)}
            required
            placeholder="연락처를 입력해주세요"
            state={isValid === false && !isEmpty ? "error" : undefined}
            helperText="입력 형식 예시: @yourssu_offical 또는 01011119999"
            errorText="입력 형식 예시: @yourssu_offical 또는 01011119999"
          />
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
        <Button
          disabled={!isValid || isEmpty}
          className={`w-full h-14 rounded-2xl text-lg font-medium transition-colors ${
            !isValid || isEmpty
              ? "bg-gray-300 text-white cursor-not-allowed"
              : "bg-primary text-primary-foreground hover:bg-primary/90"
          }`}
          onClick={handleSubmit}
        >
          프로필 등록하기
        </Button>
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
