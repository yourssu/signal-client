import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { isValidMbti } from "@/lib/mbti";
import { cn, whenPressEnter } from "@/lib/utils";
import { Mbti, EgenTetoType } from "@/types/profile";
import React, { useState, useMemo } from "react";

const egenTetoOptions: { type: EgenTetoType; label: string }[] = [
  { type: "TETO", label: "테토 st" },
  { type: "EGEN", label: "에겐 st" },
];

interface EssentialInfoStepProps {
  birthYear?: number;
  mbti?: Mbti;
  department?: string;
  school?: string;
  egenTeto?: EgenTetoType;
  onSubmit: (data: {
    birthYear: number;
    mbti: Mbti;
    department: string;
    school?: string;
    egenTeto: EgenTetoType;
  }) => void;
}

const EssentialInfoStep: React.FC<EssentialInfoStepProps> = ({
  birthYear: defaultBirthYear,
  mbti: defaultMbti,
  department: defaultDepartment,
  school: defaultSchool,
  egenTeto: defaultEgenTeto,
  onSubmit,
}) => {
  const [birthYearInput, setBirthYearInput] = useState<number | null>(
    defaultBirthYear ?? null,
  );
  const [mbtiInput, setMbtiInput] = useState<string>(defaultMbti ?? "");
  const [departmentInput, setDepartmentInput] = useState<string>(
    defaultDepartment ?? "",
  );
  const [schoolInput, setSchoolInput] = useState<string>(defaultSchool ?? "");
  const [isAnotherSchool, setIsAnotherSchool] = useState<boolean>(
    defaultSchool ? true : false,
  );
  const [egenTetoInput, setEgenTetoInput] = useState<EgenTetoType | null>(
    defaultEgenTeto ?? null,
  );

  const isBirthYearValid = useMemo(
    () =>
      birthYearInput !== null &&
      birthYearInput >= 1900 &&
      birthYearInput <= 2010,
    [birthYearInput],
  );

  const isBirthYearError =
    birthYearInput !== null &&
    String(birthYearInput).length === 4 &&
    (birthYearInput < 1900 || birthYearInput > 2010);

  const isMbtiValid = useMemo(() => isValidMbti(mbtiInput), [mbtiInput]);

  const isDepartmentValid = useMemo(
    () => departmentInput.length > 0,
    [departmentInput],
  );

  const showMbti = isBirthYearValid;
  const showDepartment = isMbtiValid;
  const showStyle = isDepartmentValid;
  const isAllValid =
    isBirthYearValid &&
    isMbtiValid &&
    isDepartmentValid &&
    egenTetoInput !== null &&
    (!isAnotherSchool || schoolInput.length > 0);

  const isMbtiError = mbtiInput.length === 4 && !isValidMbti(mbtiInput);

  const handleBirthYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digitsOnly = e.target.value.replace(/\D/g, "");
    if (digitsOnly.length > 4) return;
    const value = digitsOnly === "" ? null : parseInt(digitsOnly);
    setBirthYearInput(value);
  };

  const handleMbtiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    if (value.length <= 4) {
      setMbtiInput(value);
    }
  };

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDepartmentInput(e.target.value);
  };

  const handleSubmit = () => {
    if (!isAllValid || !isValidMbti(mbtiInput) || !egenTetoInput) return;
    onSubmit({
      birthYear: birthYearInput!,
      mbti: mbtiInput.toUpperCase() as Mbti,
      department: departmentInput,
      school: isAnotherSchool ? schoolInput : undefined,
      egenTeto: egenTetoInput,
    });
  };

  const submitOnEnter = (e: React.KeyboardEvent<HTMLInputElement>) =>
    whenPressEnter(e, handleSubmit);

  return (
    <div className="flex flex-col items-center pt-2 w-full">
      <div className="flex flex-col items-stretch gap-10 w-full grow">
        <div className="flex flex-col items-start gap-2.5">
          <p className="text-lg text-muted-foreground animate-in slide-in-from-bottom fade-in ease-in-out duration-300">
            2 / 6
          </p>
          <h2 className="text-2xl font-semibold text-stone-700 whitespace-pre-line animate-in slide-in-from-bottom-8 fade-in ease-in-out duration-400">
            필수 정보를
            <br />
            입력해주세요
          </h2>
        </div>
        <div className="flex flex-col gap-4 w-full">
          <div className="animate-in slide-in-from-bottom-8 fade-in ease-in-out duration-500">
            <FormField
              type="text"
              inputMode="numeric"
              id="birthYear"
              name="birthYear"
              label="나이"
              value={birthYearInput ?? ""}
              onChange={handleBirthYearChange}
              onKeyDown={submitOnEnter}
              maxLength={4}
              required
              placeholder="태어난 연도를 입력해주세요 (ex:2002)"
              state={isBirthYearError ? "error" : undefined}
              errorText={isBirthYearError ? "잘못된 형식입니다." : undefined}
            />
          </div>

          {showMbti && (
            <div
              className={cn(
                "animate-in slide-in-from-bottom-8 fade-in ease-in-out duration-500",
              )}
            >
              <FormField
                type="text"
                id="mbti"
                label="MBTI"
                name="mbti"
                value={mbtiInput}
                onChange={handleMbtiChange}
                onKeyDown={submitOnEnter}
                maxLength={4}
                required
                placeholder="MBTI를 입력해주세요"
                state={isMbtiError ? "error" : undefined}
                errorText={isMbtiError ? "잘못된 MBTI입니다." : undefined}
              />
            </div>
          )}

          {showDepartment && (
            <div className="flex flex-col gap-0.5 animate-in slide-in-from-bottom-8 fade-in ease-in-out duration-500">
              <FormField
                type="text"
                id="department"
                name="department"
                label="학과/부"
                value={departmentInput}
                onChange={handleDepartmentChange}
                onKeyDown={submitOnEnter}
                maxLength={20}
                required
                placeholder="재학중인 학과/부를 입력해주세요"
              />
              <div className="flex gap-2 mt-4 items-center">
                <input
                  type="checkbox"
                  id="another_school"
                  className="size-4 cursor-pointer rounded border border-gray-300 text-primary accent-primary"
                  checked={isAnotherSchool}
                  onChange={(e) => setIsAnotherSchool(e.target.checked)}
                />
                <label
                  htmlFor="another_school"
                  className="cursor-pointer text-sm"
                >
                  다른 학교 학생인가요?
                </label>
              </div>
              {isAnotherSchool && (
                <div className="animate-in slide-in-from-bottom-4 fade-in ease-in-out duration-300">
                  <FormField
                    type="text"
                    id="school"
                    name="school"
                    value={schoolInput}
                    onChange={(e) => setSchoolInput(e.target.value)}
                    placeholder="학교 입력"
                  />
                </div>
              )}
              {showStyle && (
                <div className="flex flex-col gap-2 mt-4 animate-in slide-in-from-bottom-4 fade-in ease-in-out duration-300">
                  <p className="text-xs font-medium text-label-strong px-2">
                    나의 스타일
                  </p>
                  <div className="flex gap-2">
                    {egenTetoOptions.map((option) => (
                      <button
                        key={option.type}
                        type="button"
                        onClick={() => setEgenTetoInput(option.type)}
                        className={cn(
                          "flex-1 h-11 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer",
                          egenTetoInput === option.type
                            ? "bg-neutral-100 border border-pink-600 text-pink-600"
                            : "bg-neutral-100 text-label-strong",
                        )}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <Button
        onClick={handleSubmit}
        disabled={!isAllValid}
        className={cn(
          "w-full h-14 rounded-2xl text-lg font-medium transition-colors",
          isAllValid
            ? "bg-primary text-primary-foreground hover:bg-primary/90"
            : "bg-gray-300 text-white cursor-not-allowed",
        )}
      >
        입력 완료
      </Button>
    </div>
  );
};

export default EssentialInfoStep;
