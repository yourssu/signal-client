import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Import shadcn/ui Input
import { cn, whenPressEnter } from "@/lib/utils";
import React, { useState, useMemo } from "react"; // Import useMemo

interface DepartmentStepProps {
  department?: string;
  onSubmit: (department: string) => void;
}

const DepartmentStep: React.FC<DepartmentStepProps> = ({
  department,
  onSubmit,
}) => {
  const [departmentInput, setDepartmentInput] = useState<string>(
    department ?? "",
  ); // Store raw input

  const isEmpty = useMemo(
    () => departmentInput.length === 0,
    [departmentInput],
  );

  const handleSubmit = () => {
    if (isEmpty) return;
    onSubmit(departmentInput);
  };

  const submitOnEnter = (e: React.KeyboardEvent<HTMLInputElement>) =>
    whenPressEnter(e, handleSubmit);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 20) {
      setDepartmentInput(value);
    }
  };

  return (
    // Main container - Based on Figma Frame 'Content' (1659:1810)
    <div className="flex flex-col items-center pt-2 w-full">
      <div className="flex flex-col items-stretch gap-10 w-full grow">
        <div className="flex flex-col items-start gap-2.5">
          {/* Progress Indicator - Based on 1412:6567 */}
          <p className="text-xs text-muted-foreground animate-in slide-in-from-bottom fade-in ease-in-out duration-300">
            4 / 8
          </p>
          {/* Using muted-foreground for #525252 */}
          {/* Title - Based on 1412:6569 */}
          <h2 className="text-2xl font-semibold text-stone-700 whitespace-pre-line animate-in slide-in-from-bottom-8 fade-in ease-in-out duration-400">
            어떤 분야를 공부하고 계신가요?
            <br />
            <span className="text-primary">학과/부 정보를 알려주세요</span>
          </h2>
        </div>
        <div className="flex flex-col gap-0.5 self-stretch animate-in slide-in-from-bottom-8 fade-in ease-in-out duration-500">
          <Input
            type="text"
            id="department"
            name="department"
            value={departmentInput}
            onChange={handleChange}
            onKeyDown={submitOnEnter}
            maxLength={20} // Enforce max length
            required
            // Styling based on Figma: text-2xl, text-center, placeholder color, bottom border
            className="w-full h-12 text-2xl px-2.5" // Adjusted styles
            placeholder="학과/부 입력" // Placeholder from Figma
          />
          <p className="text-xs text-end">{departmentInput.length} / 20</p>
        </div>
      </div>
      <Button
        onClick={handleSubmit}
        disabled={isEmpty}
        className={cn(
          `w-full h-14 rounded-2xl text-lg font-medium transition-colors`,
          isEmpty
            ? "bg-gray-300 text-white cursor-not-allowed"
            : "bg-primary text-primary-foreground hover:bg-primary/90",
        )}
      >
        입력 완료
      </Button>
    </div>
  );
};

export default DepartmentStep;
