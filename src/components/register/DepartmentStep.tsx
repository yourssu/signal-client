import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { cn, whenPressEnter } from "@/lib/utils";
import React, { useState, useMemo } from "react"; // Import useMemo
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface DepartmentStepProps {
  department?: string;
  school?: string;
  onSubmit: (department: string, school?: string) => void;
}

const DepartmentStep: React.FC<DepartmentStepProps> = ({
  department,
  school,
  onSubmit,
}) => {
  const [departmentInput, setDepartmentInput] = useState<string>(
    department ?? "",
  ); // Store raw input
  const [isAnotherSchool, setIsAnotherSchool] = useState<boolean>(
    school ? true : false,
  );
  const [schoolInput, setSchoolInput] = useState<string>(school ?? "");

  const isEmpty = useMemo(
    () => departmentInput.length === 0,
    [departmentInput],
  );

  const handleSubmit = () => {
    if (isEmpty) return;
    onSubmit(departmentInput, isAnotherSchool ? schoolInput : undefined);
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
          <p className="text-lg text-muted-foreground animate-in slide-in-from-bottom fade-in ease-in-out duration-300">
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
          <FormField
            type="text"
            id="department"
            name="department"
            label="학과/부"
            value={departmentInput}
            onChange={handleChange}
            onKeyDown={submitOnEnter}
            maxLength={20}
            required
            placeholder="재학중인 학과/부를 입력해주세요"
            helperText={`${departmentInput.length} / 20`}
          />
          <div className="flex gap-2 items-center">
            <Checkbox
              id="another_school"
              className="cursor-pointer"
              checked={isAnotherSchool}
              onCheckedChange={(checked) => setIsAnotherSchool(!!checked)}
            />
            <Label htmlFor="another_school" className="cursor-pointer">
              다른 학교 학생인가요?
            </Label>
          </div>
        </div>
        <div
          className={cn(
            "flex flex-col gap-0.5 self-stretch animate-in slide-in-from-bottom-8 fade-in ease-in-out duration-500",
            !isAnotherSchool && "hidden",
          )}
        >
          <FormField
            type="text"
            id="school"
            name="school"
            value={schoolInput}
            onChange={(e) => setSchoolInput(e.target.value)}
            disabled={!isAnotherSchool}
            placeholder="학교 입력"
            helperText={`${schoolInput.length} / 20`}
          />
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
