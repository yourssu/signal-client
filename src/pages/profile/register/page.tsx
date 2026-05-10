import { ChevronLeft } from "lucide-react";
import React, { useEffect, useRef } from "react";
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
  EgenTetoType,
} from "@/types/profile";
import {
  useCountProfile,
  useCreateProfile,
  useSelfProfile,
} from "@/hooks/queries/profiles";
import { useTicketPackages } from "@/hooks/queries/viewers";
import { useNavigate, Link } from "react-router";
import { useSetAtom } from "jotai";
import { userGenderAtom, userProfileAtom } from "@/atoms/user";
import PersonalityStep from "@/components/register/PersonalityStep";
import NicknameStep from "@/components/register/NicknameStep";
import ContactStep from "@/components/register/ContactStep";
import RegisterDoneStep from "@/components/register/RegisterDoneStep";
import TopBar from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  profileGenderSubmit,
  profileInfoSubmit,
  profileAnimalSubmit,
  profileFeaturesSubmit,
  profileNicknameSubmit,
  profileContactDetailSubmit,
} from "@/lib/analytics";
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
  const registerStartTime = useRef(Date.now());
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
  const { data: profileCountRes } = useCountProfile({
    enabled: funnel.step === "done",
  });
  const { data: ticketPackagesRes } = useTicketPackages({
    enabled: funnel.step === "done",
  });
  const discountRate = (() => {
    const firstPkg = ticketPackagesRes?.packages[0];
    if (!firstPkg || firstPkg.price[1] === 0) return 0;
    return Math.ceil(100 - (firstPkg.price[0] / firstPkg.price[1]) * 100);
  })();

  useEffect(() => {
    if (latestProfile && profile != latestProfile) {
      setProfile(latestProfile);
    }
  }, [profile, latestProfile, setProfile]);

  const { mutateAsync: createProfile } = useCreateProfile();

  const handleGenderSelect = (gender: Gender) => {
    setGender(gender);
    funnel.history.replace("gender", { ...funnel.context, gender });
    funnel.history.push("essentialInfo", { ...funnel.context, gender });
    profileGenderSubmit(gender === "MALE" ? "male" : "female");
  };

  const handleEssentialInfoSubmit = (data: {
    birthYear: number;
    mbti: Mbti;
    department: string;
    school?: string;
    egenTeto: EgenTetoType;
  }) => {
    const context = {
      ...funnel.context,
      birthYear: data.birthYear,
      mbti: data.mbti,
      department: data.department,
      school: data.school ? data.school : null,
      egenTeto: data.egenTeto,
    };
    funnel.history.replace("essentialInfo", context);
    funnel.history.push("animal", context);
    profileInfoSubmit({
      enteredMbti: data.mbti,
      selectedType: data.egenTeto === "EGEN" ? "에겐" : "테토",
      anotherSchool: !!data.school,
      enteredMajor: data.department,
      enteredAge: data.birthYear,
    });
  };

  const handleAnimalSelect = (animal: AnimalType) => {
    funnel.history.replace("animal", { ...funnel.context, animal });
    funnel.history.push("personality", { ...funnel.context, animal });
    profileAnimalSubmit(animal.toLowerCase());
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
    profileFeaturesSubmit(personality.length);
  };

  const handleNicknameSubmit = async (nickname: string) => {
    funnel.history.replace("nickname", { ...funnel.context, nickname });
    funnel.history.push("contact", {
      ...funnel.context,
      nickname,
    });
    profileNicknameSubmit(nickname);
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
      egenTeto,
    } = funnel.context;
    if (
      gender &&
      animal &&
      mbti &&
      department &&
      birthYear &&
      introSentences &&
      nickname &&
      egenTeto
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
        egenTeto,
      };
      const res = await createProfile(finalData);
      funnel.history.replace("contact", res);
      funnel.history.push("done", res);
      const totalTimeSpent = Math.round(
        (Date.now() - registerStartTime.current) / 1000,
      );
      profileContactDetailSubmit({
        contactInformation: contact,
        totalTimeSpent,
      });
      setProfile(res);
    }
  };

  const handleDone = () => {
    navigate("/profile");
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
      {funnel.step === "done" ? (
        <div className="w-full h-11 shrink-0 flex items-center justify-between px-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="text-black-700"
          >
            <ChevronLeft />
          </Button>
          <Link
            to="/purchase"
            className="bg-white border border-gray-200 rounded-full px-2.5 py-1 text-[10px] font-semibold text-[#767a83]"
          >
            이용권 구매
          </Link>
        </div>
      ) : (
        <TopBar onBack={handleBack} hideInfo />
      )}
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
                egenTeto={funnel.context.egenTeto}
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
                profileNumber={profileCountRes?.count ?? 1}
                discountRate={discountRate}
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
