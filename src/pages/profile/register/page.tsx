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
import TopBar from "@/components/home/TopBar";
import { useViewerSelf } from "@/hooks/queries/viewers";
import { Progress } from "@/components/ui/progress";

const ProfileRegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const uuid = useUserUuid();
  const { data: self } = useViewerSelf(uuid);
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

  const handleBack = () => {
    if (funnel.index == 0) {
      navigate(-1);
    } else {
      funnel.history.back();
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center">
      <TopBar
        heartCount={self?.usedTicket ?? 0}
        ticketCount={(self?.ticket ?? 0) - (self?.usedTicket ?? 0)}
        onBack={handleBack}
      />
      <div className="w-full max-w-md grow p-6 flex flex-col gap-10">
        {funnel.step !== "done" && (
          <Progress value={((funnel.index + 1) / 6) * 100} />
        )}
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
