import React from "react";
import { useFunnel } from "@use-funnel/react-router-dom";
import GenderStep from "../../../components/GenderStep";
import AnimalStep from "../../../components/register/AnimalStep";
import MbtiStep from "../../../components/register/MbtiStep";
import {
  AnimalType,
  Gender,
  Mbti,
  ProfileContactResponse,
  ProfileCreatedRequest,
} from "@/types/profile";
import { useCreateProfile } from "@/hooks/queries/profiles";
import { useNavigate } from "react-router";
import { useUserUuid } from "@/hooks/useUserUuid";
import { useAtom } from "jotai";
import { userGender } from "@/atoms/userGender";
import PersonalityStep from "@/components/register/PersonalityStep";
import NicknameStep from "@/components/register/NicknameStep";
import ContactStep from "@/components/register/ContactStep";
import RegisterDoneStep from "@/components/register/RegisterDoneStep";

const ProfileRegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const uuid = useUserUuid();
  const [gender, setGender] = useAtom(userGender);
  const funnel = useFunnel<{
    gender: Partial<ProfileContactResponse>;
    animal: Partial<ProfileContactResponse>;
    mbti: Partial<ProfileContactResponse>;
    personality: Partial<ProfileContactResponse>;
    nickname: Partial<ProfileContactResponse>;
    contact: Partial<ProfileContactResponse>;
    done: ProfileContactResponse;
  }>({
    id: "profile-register",
    initial: {
      step: gender ? "animal" : "gender",
      context: {
        ...(gender && { gender }),
      },
    },
  });

  const { mutateAsync: createProfile } = useCreateProfile();

  const handleGenderSelect = (gender: Gender) => {
    setGender(gender);
    funnel.history.push("animal", { ...funnel.context, gender });
  };

  const handleAnimalSelect = (animal: AnimalType) =>
    funnel.history.push("mbti", { ...funnel.context, animal });

  const handleMbtiSubmit = async (mbti: Mbti) =>
    funnel.history.push("personality", { ...funnel.context, mbti });

  const handlePersonalitySubmit = async (personality: string[]) =>
    funnel.history.push("nickname", {
      ...funnel.context,
      introSentences: personality,
    });

  const handleNicknameSubmit = async (nickname: string) =>
    funnel.history.push("contact", {
      ...funnel.context,
      nickname,
    });

  const handleContactSubmit = async (contact: string) => {
    const { gender, animal, mbti, introSentences, nickname } = funnel.context;
    if (gender && animal && mbti && introSentences && nickname) {
      const finalData: ProfileCreatedRequest = {
        uuid,
        gender,
        animal,
        mbti,
        introSentences,
        nickname,
        contact,
      };
      const res = await createProfile(finalData);
      if (res.result) {
        funnel.history.push("done", res.result);
      }
    }
  };

  const handleDone = () => {
    navigate("/verify");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <funnel.Render
          gender={() => <GenderStep onSelect={handleGenderSelect} />}
          animal={() => <AnimalStep onSelect={handleAnimalSelect} />}
          mbti={() => <MbtiStep onSubmit={handleMbtiSubmit} />}
          personality={() => (
            <PersonalityStep onSubmit={handlePersonalitySubmit} />
          )}
          nickname={() => <NicknameStep onSubmit={handleNicknameSubmit} />}
          contact={() => <ContactStep onSubmit={handleContactSubmit} />}
          done={() => (
            <RegisterDoneStep
              profile={funnel.context as ProfileContactResponse}
              onSubmit={handleDone}
            />
          )}
        />
      </div>
    </div>
  );
};

export default ProfileRegisterPage;
