import React from "react";
import { useFunnel } from "@use-funnel/react-router-dom";
import GenderStep from "../../../components/GenderStep";
import AnimalStep from "../../../components/register/AnimalStep";
import PersonalInfoStep from "../../../components/register/PersonalInfoStep";
import {
  AnimalType,
  Gender,
  ProfileContactResponse,
  ProfileCreatedRequest,
} from "@/types/profile";
import { useCreateProfile } from "@/hooks/queries/profiles";
import { useNavigate } from "react-router";
import { useUserUuid } from "@/hooks/useUserUuid";

const ProfileRegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const uuid = useUserUuid();
  const funnel = useFunnel<{
    gender: Partial<ProfileContactResponse>;
    animal: Partial<ProfileContactResponse>;
    personal: Partial<ProfileContactResponse>;
  }>({
    id: "profile-register",
    initial: {
      step: "gender",
      context: {},
    },
  });

  const { mutateAsync: createProfile } = useCreateProfile();

  const handleGenderSelect = (gender: Gender) => {
    funnel.history.push("animal", { gender });
  };

  const handleAnimalSelect = (animal: AnimalType) => {
    // PersonalStep requires both gender and animal to be defined
    const { gender } = funnel.context;
    funnel.history.push("personal", { gender, animal });
  };

  const handlePersonalInfoSubmit = async (
    personalInfo: Omit<
      ProfileContactResponse,
      "gender" | "animal" | "profileId"
    >
  ) => {
    // Here you would typically submit the complete registration data to your backend
    const { gender, animal } = funnel.context;
    if (gender && animal) {
      const finalData: ProfileCreatedRequest = {
        uuid,
        gender,
        animal,
        ...personalInfo,
      };
      await createProfile(finalData);
      // Navigate back to home after registration
      navigate("/");
    }
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
