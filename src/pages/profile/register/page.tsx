import React from "react";
import { useFunnel } from "@use-funnel/react-router";
import GenderStep from "@/components/register/GenderStep";
import AnimalStep from "@/components/register/AnimalStep";
import MbtiStep from "@/components/register/MbtiStep";
import {
  AnimalType,
  Gender,
  Mbti,
  ProfileContactResponse,
  ProfileCreatedRequest,
  ProfileResponse,
} from "@/types/profile";
import { useCreateProfile } from "@/hooks/queries/profiles";
import { useNavigate } from "react-router";
import { useUserUuid } from "@/hooks/useUserUuid";
import { useAtom } from "jotai";
import { userGenderAtom } from "@/atoms/userGender";
import PersonalityStep from "@/components/register/PersonalityStep";
import NicknameStep from "@/components/register/NicknameStep";
import ContactStep from "@/components/register/ContactStep";
import RegisterDoneStep from "@/components/register/RegisterDoneStep";
import TopBar from "@/components/TopBar";
import { Progress } from "@/components/ui/progress";
import { userProfileAtom } from "@/atoms/userProfile";

const ProfileRegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const uuid = useUserUuid();
  const [gender, setGender] = useAtom(userGenderAtom);
  const [profile, setProfile] = useAtom(userProfileAtom);
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
    initial: profile
      ? {
          step: "done",
          context: profile,
        }
      : {
          step: "gender",
          context: {
            ...(gender && { gender }),
          },
        },
  });

  const { mutateAsync: createProfile } = useCreateProfile();

  const handleGenderSelect = (gender: Gender) => {
    setGender(gender);
    funnel.history.replace("gender", { ...funnel.context, gender });
    funnel.history.push("animal", { ...funnel.context, gender });
  };

  const handleAnimalSelect = (animal: AnimalType) => {
    funnel.history.replace("animal", { ...funnel.context, animal });
    funnel.history.push("mbti", { ...funnel.context, animal });
  };

  const handleMbtiSubmit = async (mbti: Mbti) => {
    funnel.history.replace("mbti", { ...funnel.context, mbti });
    funnel.history.push("personality", { ...funnel.context, mbti });
  };

  const handlePersonalitySubmit = async (personality: string[]) => {
    funnel.history.replace("personality", {
      ...funnel.context,
      introSentences: personality,
    });
    funnel.history.push("nickname", {
      ...funnel.context,
      introSentences: personality,
    });
  };

  const handleNicknameSubmit = async (nickname: string) => {
    funnel.history.replace("nickname", { ...funnel.context, nickname });
    funnel.history.push("contact", {
      ...funnel.context,
      nickname,
    });
  };

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
      funnel.history.replace("contact", res);
      funnel.history.push("done", res);
      setProfile(res);
    }
  };

  const handleDone = () => {
    navigate("/verify");
  };

  const handleBack = () => {
    if (funnel.step === "done") {
      navigate("/");
      return;
    }
    if (funnel.index == 0) {
      navigate(-1);
    } else {
      funnel.history.back();
    }
  };

  return (
    <div className="min-h-dvh flex flex-col items-center">
      <TopBar onBack={handleBack} />
      <div className="w-full max-w-md grow p-6 flex flex-col gap-10">
        {funnel.step !== "done" && (
          <Progress value={((funnel.index + 1) / 6) * 100} />
        )}
        <div className="grow flex items-stretch justify-stretch">
          <funnel.Render
            gender={() => <GenderStep onSelect={handleGenderSelect} />}
            animal={() => (
              <AnimalStep
                gender={funnel.context.gender ?? "MALE"}
                animal={funnel.context.animal}
                onSelect={handleAnimalSelect}
              />
            )}
            mbti={() => (
              <MbtiStep
                mbti={funnel.context.mbti}
                onSubmit={handleMbtiSubmit}
              />
            )}
            personality={() => (
              <PersonalityStep
                traits={funnel.context.introSentences}
                onSubmit={handlePersonalitySubmit}
              />
            )}
            nickname={() => (
              <NicknameStep
                onSubmit={handleNicknameSubmit}
                nickname={funnel.context.nickname}
                introSentences={funnel.context.introSentences ?? []}
              />
            )}
            contact={() => (
              <ContactStep
                profile={funnel.context as ProfileResponse}
                contact={funnel.context.contact}
                onSubmit={handleContactSubmit}
              />
            )}
            done={() => (
              <RegisterDoneStep
                profile={funnel.context as ProfileContactResponse}
                onSubmit={handleDone}
              />
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileRegisterPage;
