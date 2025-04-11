import React from "react";
import { useFunnel } from "@use-funnel/react-router-dom";
import GenderStep from "../../../components/register/GenderStep";
import AnimalStep from "../../../components/register/AnimalStep";
import PersonalInfoStep from "../../../components/register/PersonalInfoStep";

type Gender = "male" | "female";
type AnimalType = "dog" | "bear" | "dinosaur" | "wolf" | "deer" | "cat";
interface PersonalInfo {
  nickname: string;
  mbti: string;
  contact: string;
}

// Step별 context 타입 정의
type GenderStep = {
  gender?: Gender;
  animal?: AnimalType;
  personalInfo?: PersonalInfo;
};
type AnimalStep = {
  gender: Gender;
  animal?: AnimalType;
  personalInfo?: PersonalInfo;
};
type PersonalStep = {
  gender: Gender;
  animal: AnimalType;
  personalInfo?: PersonalInfo;
};

const ProfileRegisterPage: React.FC = () => {
  const funnel = useFunnel<{
    gender: GenderStep;
    animal: AnimalStep;
    personal: PersonalStep;
  }>({
    id: "profile-register",
    initial: {
      step: "gender",
      context: {},
    },
  });

  const handleGenderSelect = (gender: Gender) => {
    funnel.history.push("animal", { gender });
  };

  const handleAnimalSelect = (animal: AnimalType) => {
    // PersonalStep requires both gender and animal to be defined
    const { gender } = funnel.context as AnimalStep;
    funnel.history.push("personal", { gender, animal });
  };

  const handlePersonalInfoSubmit = (personalInfo: PersonalInfo) => {
    // Here you would typically submit the complete registration data to your backend
    const { gender, animal } = funnel.context as PersonalStep;
    const finalData = { gender, animal, personalInfo };
    console.log("Registration complete:", finalData);

    // Navigate back to home after registration
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <funnel.Render
          gender={() => <GenderStep onSelect={handleGenderSelect} />}
          animal={() => <AnimalStep onSelect={handleAnimalSelect} />}
          personal={() => (
            <PersonalInfoStep onSubmit={handlePersonalInfoSubmit} />
          )}
        />
      </div>
    </div>
  );
};

export default ProfileRegisterPage;
