import { userGenderAtom, userProfileAtom, viewerAtom } from "@/atoms/user";
import { CLARITY_ID, GA_ID } from "@/env";
import { useAtomValue } from "jotai";
import { useEffect } from "react";
import ReactGA4 from "react-ga4";
import Clarity from "@microsoft/clarity";
import { useUserInfo } from "./queries/users";

export const useAnalytics = () => {
  const { data } = useUserInfo();
  const uuid = data?.uuid;
  const gender = useAtomValue(userGenderAtom);
  const profile = useAtomValue(userProfileAtom);
  const viewerSelf = useAtomValue(viewerAtom);

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
          profile_registered: !!profile,
          gender: gender ?? undefined,
          mbti: profile?.mbti ?? undefined,
          department: profile?.department ?? undefined,
          birth_year: profile?.birthYear?.toString() ?? undefined,
          ticket: viewerSelf?.ticket ?? undefined,
          used_ticket: viewerSelf?.usedTicket ?? undefined,
        },
      });
  }, [gender, profile, viewerSelf]);
};
