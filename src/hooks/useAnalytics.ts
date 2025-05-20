import { userGenderAtom } from "@/atoms/userGender";
import { userProfileAtom } from "@/atoms/userProfile";
import { CLARITY_ID, GA_ID } from "@/env";
import { useUserUuid } from "@/hooks/useUserUuid";
import { useAtomValue } from "jotai";
import { useEffect } from "react";
import ReactGA4 from "react-ga4";
import Clarity from "@microsoft/clarity";

export const useAnalytics = () => {
  const uuid = useUserUuid();
  const gender = useAtomValue(userGenderAtom);
  const profile = useAtomValue(userProfileAtom);

  useEffect(() => {
    if (GA_ID)
      ReactGA4.initialize(GA_ID, {
        gtagOptions: {
          user_id: uuid,
        },
      });

    if (CLARITY_ID) Clarity.init(CLARITY_ID);
  }, [uuid]);

  useEffect(() => {
    if (GA_ID)
      ReactGA4.set({
        user_properties: {
          gender: gender ?? undefined,
          mbti: profile?.mbti ?? undefined,
          department: profile?.department ?? undefined,
          birth_year: profile?.birthYear?.toString() ?? undefined,
        },
      });
  }, [gender, profile]);
};
