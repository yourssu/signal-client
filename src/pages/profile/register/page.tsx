import React, { useEffect } from "react";
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
import DepartmentStep from "@/components/register/DepartmentStep";
import BirthYearStep from "@/components/register/BirthYearStep";
import { funnelComplete, funnelStart, funnelStep } from "@/lib/analytics";

const ProfileRegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const uuid = useUserUuid();
  const [gender, setGender] = useAtom(userGenderAtom);
  const [profile, setProfile] = useAtom(userProfileAtom);
  const funnel = useFunnel<{
    gender: Partial<ProfileContactResponse>;
    animal: Partial<ProfileContactResponse>;
    mbti: Partial<ProfileContactResponse>;
    department: Partial<ProfileContactResponse>;
    birthYear: Partial<ProfileContactResponse>;
    personality: Partial<ProfileContactResponse>;
    nickname: Partial<ProfileContactResponse>;
    contact: Partial<ProfileContactResponse>;
    done: ProfileContactResponse;
  }>({
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

  useEffect(() => {
    if (funnel.historySteps.length === 1) {
      funnelStart("profile.register", "프로필 등록");
    }
  }, [funnel.historySteps.length]);

  const { mutateAsync: createProfile } = useCreateProfile();

  const handleGenderSelect = (gender: Gender) => {
    setGender(gender);
    funnel.history.replace("gender", { ...funnel.context, gender });
    funnel.history.push("animal", { ...funnel.context, gender });
    funnelStep("profile.register", "프로필 등록", "gender", funnel.context);
  };

  const handleAnimalSelect = (animal: AnimalType) => {
    funnel.history.replace("animal", { ...funnel.context, animal });
    funnel.history.push("mbti", { ...funnel.context, animal });
    funnelStep("profile.register", "프로필 등록", "animal", funnel.context);
  };

  const handleMbtiSubmit = async (mbti: Mbti) => {
    funnel.history.replace("mbti", { ...funnel.context, mbti });
    funnel.history.push("department", { ...funnel.context, mbti });
    funnelStep("profile.register", "프로필 등록", "mbti", funnel.context);
  };

  const handleDepartmentSubmit = async (department: string) => {
    funnel.history.replace("department", { ...funnel.context, department });
    funnel.history.push("birthYear", { ...funnel.context, department });
    funnelStep("profile.register", "프로필 등록", "department", funnel.context);
  };

  const handleBirthYearSubmit = async (birthYear: number) => {
    funnel.history.replace("birthYear", { ...funnel.context, birthYear });
    funnel.history.push("personality", { ...funnel.context, birthYear });
    funnelStep("profile.register", "프로필 등록", "birthYear", funnel.context);
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
    } = funnel.context;
    if (
      gender &&
      animal &&
      mbti &&
      department &&
      birthYear &&
      introSentences &&
      nickname
    ) {
      const finalData: ProfileCreatedRequest = {
        uuid,
        gender,
        animal,
        mbti,
        department,
        birthYear,
        introSentences,
        nickname,
        contact,
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
            department={() => (
              <DepartmentStep
                department={funnel.context.department}
                onSubmit={handleDepartmentSubmit}
              />
            )}
            birthYear={() => (
              <BirthYearStep
                birthYear={funnel.context.birthYear}
                onSubmit={handleBirthYearSubmit}
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
