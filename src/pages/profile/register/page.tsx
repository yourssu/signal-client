import React, { useEffect } from "react";
import { useFunnel } from "@use-funnel/react-router";
import GenderStep from "@/components/register/GenderStep";
import AnimalStep from "@/components/register/AnimalStep";
import EssentialInfoStep from "@/components/register/EssentialInfoStep";
import {
  AnimalType,
  Gender,
  Mbti,
  ProfileContactResponse,
  ProfileCreatedRequest,
  StyleType,
} from "@/types/profile";
import { useCreateProfile, useSelfProfile } from "@/hooks/queries/profiles";
import { useNavigate } from "react-router";
import { useSetAtom } from "jotai";
import { userGenderAtom, userProfileAtom } from "@/atoms/user";
import PersonalityStep from "@/components/register/PersonalityStep";
import NicknameStep from "@/components/register/NicknameStep";
import ContactStep from "@/components/register/ContactStep";
import RegisterDoneStep from "@/components/register/RegisterDoneStep";
import TopBar from "@/components/Header";
import { Progress } from "@/components/ui/progress";
import { funnelComplete, funnelStart, funnelStep } from "@/lib/analytics";
import { useUser } from "@/hooks/useUser";

type RegisterFunnel = {
  gender: Partial<ProfileContactResponse>;
  essentialInfo: Partial<ProfileContactResponse>;
  animal: Partial<ProfileContactResponse>;
  personality: Partial<ProfileContactResponse>;
  nickname: Partial<ProfileContactResponse>;
  contact: Partial<ProfileContactResponse>;
  done: ProfileContactResponse;
};

const REGISTER_STEPS = [
  "gender",
  "essentialInfo",
  "animal",
  "personality",
  "nickname",
  "contact",
] as const;
const REGISTER_STEPS_COUNT = REGISTER_STEPS.length;

const ProfileRegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { uuid, gender, profile } = useUser();
  const setGender = useSetAtom(userGenderAtom);
  const setProfile = useSetAtom(userProfileAtom);
  const funnel = useFunnel<RegisterFunnel>({
    id: "profile.register",
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
  const { data: latestProfile } = useSelfProfile({
    enabled: funnel.step === "done",
  });

  useEffect(() => {
    if (latestProfile && profile != latestProfile) {
      setProfile(latestProfile);
    }
  }, [profile, latestProfile, setProfile]);

  useEffect(() => {
    if (funnel.historySteps.length === 1) {
      funnelStart("profile.register", "프로필 등록");
    }
  }, [funnel.historySteps.length]);

  const { mutateAsync: createProfile } = useCreateProfile();

  const handleGenderSelect = (gender: Gender) => {
    setGender(gender);
    funnel.history.replace("gender", { ...funnel.context, gender });
    funnel.history.push("essentialInfo", { ...funnel.context, gender });
    funnelStep("profile.register", "프로필 등록", "gender", funnel.context);
  };

  const handleEssentialInfoSubmit = (data: {
    birthYear: number;
    mbti: Mbti;
    department: string;
    school?: string;
    style: StyleType;
  }) => {
    const context = {
      ...funnel.context,
      birthYear: data.birthYear,
      mbti: data.mbti,
      department: data.department,
      school: data.school ? data.school : null,
      style: data.style,
    };
    funnel.history.replace("essentialInfo", context);
    funnel.history.push("animal", context);
    funnelStep("profile.register", "프로필 등록", "essentialInfo", context);
  };

  const handleAnimalSelect = (animal: AnimalType) => {
    funnel.history.replace("animal", { ...funnel.context, animal });
    funnel.history.push("personality", { ...funnel.context, animal });
    funnelStep("profile.register", "프로필 등록", "animal", funnel.context);
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
    funnelStep(
      "profile.register",
      "프로필 등록",
      "personality",
      funnel.context,
    );
  };

  const handleNicknameSubmit = async (nickname: string) => {
    funnel.history.replace("nickname", { ...funnel.context, nickname });
    funnel.history.push("contact", {
      ...funnel.context,
      nickname,
    });
    funnelStep("profile.register", "프로필 등록", "nickname", funnel.context);
  };

  const handleContactSubmit = async (contact: string) => {
    const {
      gender,
      animal,
      mbti,
      department,
      birthYear,
      introSentences,
      nickname,
      school,
      style,
    } = funnel.context;
    if (
      gender &&
      animal &&
      mbti &&
      department &&
      birthYear &&
      introSentences &&
      nickname &&
      style
    ) {
      const finalData: ProfileCreatedRequest = {
        uuid: uuid ?? undefined,
        gender,
        animal,
        mbti,
        department,
        birthYear,
        introSentences,
        nickname,
        contact,
        school: school ?? null,
        style,
      };
      const res = await createProfile(finalData);
      funnel.history.replace("contact", res);
      funnel.history.push("done", res);
      funnelComplete("profile.register", "프로필 등록", {
        gender,
        animal,
        mbti,
        department,
        birthYear,
        introSentences,
        nickname,
      });
      setProfile(res);
    }
  };

  const handleDone = () => {
    navigate("/purchase");
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
    <div className="min-h-dvh flex flex-col items-center bg-static-white">
      <title>프로필 등록하기 - 시그널</title>
      <TopBar onBack={handleBack} />
      <div className="w-full max-w-md grow p-6 flex flex-col gap-10">
        {funnel.step !== "done" && (
          <Progress value={((funnel.index + 1) / REGISTER_STEPS_COUNT) * 100} />
        )}
        <div className="grow flex items-stretch justify-stretch">
          <funnel.Render
            gender={() => <GenderStep onSelect={handleGenderSelect} />}
            essentialInfo={() => (
              <EssentialInfoStep
                birthYear={funnel.context.birthYear}
                mbti={funnel.context.mbti}
                department={funnel.context.department}
                school={funnel.context.school ?? undefined}
                style={funnel.context.style}
                onSubmit={handleEssentialInfoSubmit}
              />
            )}
            animal={() => (
              <AnimalStep
                gender={funnel.context.gender ?? "MALE"}
                animal={funnel.context.animal}
                onSelect={handleAnimalSelect}
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
