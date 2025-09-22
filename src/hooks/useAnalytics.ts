import { CLARITY_ID, GA_ID } from "@/env";
import { useEffect } from "react";
import ReactGA4 from "react-ga4";
import Clarity from "@microsoft/clarity";
import { useUser } from "@/hooks/useUser";
import { useLocation } from "react-router";

export const useAnalytics = () => {
  const { uuid, gender, profile, viewer, authProvider } = useUser();
  const location = useLocation();

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
          ticket: viewer?.ticket ?? undefined,
          used_ticket: viewer?.usedTicket ?? undefined,
          school: profile?.school ?? undefined,
          auth_provider: authProvider ?? undefined,
        },
      });
  }, [authProvider, gender, profile, viewer, location]);
};
