import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Import shadcn/ui Input
import React, { useState, useMemo } from "react"; // Import useMemo

interface ContactStepProps {
  onSubmit: (contact: string) => void;
}

const ContactStep: React.FC<ContactStepProps> = ({ onSubmit }) => {
  const [contact, setContact] = useState<string>(""); // Initialize with empty string

  // Validation: Check if contact is not empty
  const isValid = useMemo(() => contact.trim() !== "", [contact]);

  const handleSubmit = () => {
    if (!isValid) return;
    onSubmit(contact.trim());
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContact(e.target.value);
  };

  return (
    // Main container - Based on Figma Frame 1000011964
    <div className="flex flex-col items-center pt-10 w-full">
      <div className="flex flex-col items-stretch gap-[43px] w-full grow">
        <div className="flex flex-col gap-2.5">
          {/* Progress Indicator - Based on 1412:7355 */}
          <p className="text-xs text-muted-foreground animate-in slide-in-from-bottom fade-in ease-in-out duration-300">
            6 / 6
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
            required
            className="w-full h-12 text-2xl px-2.5"
            placeholder="ex. @yourssu_official"
          />
          <p className="text-sm text-muted-foreground">
            전화번호는 <strong>010-XXXX-XXXX</strong> 형태,
            <br />
            인스타그램 아이디는 앞에 <strong>@</strong>를 붙여 입력해주세요.
          </p>
        </div>
      </div>
      <Button
        onClick={handleSubmit}
        disabled={!isValid} // Disable button if validation fails
        className={`w-full h-14 rounded-2xl text-lg font-medium transition-colors ${
          isValid
            ? "bg-primary text-primary-foreground hover:bg-primary/90" // Enabled state (Pink)
            : "bg-gray-300 text-white cursor-not-allowed" // Disabled state (Gray - #D1D5DC)
        }`}
      >
        입력 완료
      </Button>
    </div>
  );
};

export default ContactStep;
