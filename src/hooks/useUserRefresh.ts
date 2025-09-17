import { userGenderAtom } from "@/atoms/userGender";
import { userProfileAtom } from "@/atoms/userProfile";
import { purchasedProfilesAtom } from "@/atoms/viewerProfiles";
import { viewerSelfAtom } from "@/atoms/viewerSelf";
import { usePurchasedProfiles, useSelfProfile } from "@/hooks/queries/profiles";
import { useViewerSelf } from "@/hooks/queries/viewers";
import { Gender } from "@/types/profile";
import { useQueryClient } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { useCallback, useEffect, useState } from "react";

export const useUserRefresh = () => {
  const [refreshInitiated, setRefreshInitiated] = useState(false);
  const [isRefreshed, setIsRefreshed] = useState(false);
  const setProfile = useSetAtom(userProfileAtom);
  const setViewerSelf = useSetAtom(viewerSelfAtom);
  const setPurchasedProfiles = useSetAtom(purchasedProfilesAtom);
  const setGender = useSetAtom(userGenderAtom);

  const queryClient = useQueryClient();

  const { data: profile, isPending: isProfilePending } = useSelfProfile({
    retry: false,
  });
  const { data: viewerSelf, isPending: isViewerSelfPending } = useViewerSelf({
    retry: false,
  });
  const { data: purchasedProfiles, isPending: isPurchasedProfilesPending } =
    usePurchasedProfiles({
      retry: false,
    });

  const refreshUser = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["profiles", "me"] });
    queryClient.invalidateQueries({ queryKey: ["viewer", "me"] });
    queryClient.invalidateQueries({ queryKey: ["profiles", "purchased"] });
    setRefreshInitiated(true);
  }, [queryClient]);

  useEffect(() => {
    if (refreshInitiated) {
      if (profile && !isProfilePending) {
        setProfile(profile);
        setGender(profile.gender as Gender);
      }
      if (viewerSelf && !isViewerSelfPending) setViewerSelf(viewerSelf);
      if (purchasedProfiles && !isPurchasedProfilesPending)
        setPurchasedProfiles(purchasedProfiles);
      if (
        !isProfilePending &&
        !isViewerSelfPending &&
        !isPurchasedProfilesPending
      )
        setIsRefreshed(true);
    }
  }, [
    profile,
    isProfilePending,
    setProfile,
    viewerSelf,
    setViewerSelf,
    refreshInitiated,
    setGender,
    isViewerSelfPending,
    purchasedProfiles,
    isPurchasedProfilesPending,
    setPurchasedProfiles,
  ]);

  return { refreshUser, isRefreshed };
};
