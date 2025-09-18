import {
  cleanDataAtom,
  isFirstProfileViewAtom,
  lastEntranceAtom,
  userGenderAtom,
  userProfileAtom,
  viewerAtom,
} from "@/atoms/user";
import {
  purchasedProfilesAtom,
  recentlyViewedProfilesAtom,
  savedProfilesAtom,
} from "@/atoms/profiles";
import { usePurchasedProfiles, useSelfProfile } from "@/hooks/queries/profiles";
import { useViewerSelf } from "@/hooks/queries/viewers";
import { Gender } from "@/types/profile";
import { useQueryClient } from "@tanstack/react-query";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useCallback, useEffect, useState } from "react";
import { UserData } from "@/types/user";
import { useAuth } from "@/hooks/useAuth";
import { useUserInfo } from "@/hooks/queries/users";
import { DATA_EXPIRY } from "@/env";

export const useUser = (): UserData & {
  setIsFirstProfileView: (value: boolean) => void;
  refreshUser: () => void;
  isRefreshed: boolean;
} => {
  // Refresh states
  const [refreshInitiated, setRefreshInitiated] = useState(false);
  const [isRefreshed, setIsRefreshed] = useState(false);

  // Check auth before fetching user data
  const { isAuthenticated } = useAuth();

  const { data: info } = useUserInfo();
  const uuid = info?.uuid ?? null;

  // user atoms
  const [gender, setGender] = useAtom(userGenderAtom);
  const [profile, setProfile] = useAtom(userProfileAtom);
  const [isFirstProfileView, setIsFirstProfileView] = useAtom(
    isFirstProfileViewAtom,
  );
  const [viewer, setViewer] = useAtom(viewerAtom);
  const [purchasedProfiles, setPurchasedProfiles] = useAtom(
    purchasedProfilesAtom,
  );
  const [lastEntranceTime, setLastEntranceTime] = useAtom(lastEntranceAtom);
  const savedProfiles = useAtomValue(savedProfilesAtom);
  const recentlyViewedProfileIds = useAtomValue(recentlyViewedProfilesAtom);
  const clearDataAtom = useSetAtom(cleanDataAtom);

  const queryClient = useQueryClient();

  const { data: profileRes, isPending: isProfilePending } = useSelfProfile({
    retry: false,
  });
  const { data: viewerRes, isPending: isViewerSelfPending } = useViewerSelf({
    retry: false,
  });
  const { data: purchasedProfilesRes, isPending: isPurchasedProfilesPending } =
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
    if (
      lastEntranceTime === null ||
      lastEntranceTime < new Date(DATA_EXPIRY).getTime()
    ) {
      clearDataAtom();
    } else {
      setLastEntranceTime(Date.now());
    }
  }, [clearDataAtom, lastEntranceTime, setLastEntranceTime]);

  useEffect(() => {
    if (isAuthenticated) {
      refreshUser();
    }
  }, [isAuthenticated, refreshUser]);

  useEffect(() => {
    if (refreshInitiated) {
      if (profileRes && !isProfilePending) {
        setProfile(profileRes);
        setGender(profileRes.gender as Gender);
      }
      if (viewerRes && !isViewerSelfPending) setViewer(viewerRes);
      if (purchasedProfilesRes && !isPurchasedProfilesPending)
        setPurchasedProfiles(purchasedProfilesRes);
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
    viewerRes,
    setViewer,
    refreshInitiated,
    setGender,
    isViewerSelfPending,
    purchasedProfiles,
    isPurchasedProfilesPending,
    setPurchasedProfiles,
    profileRes,
    purchasedProfilesRes,
  ]);

  return {
    uuid,
    isFirstProfileView,
    lastEntranceTime,
    gender,
    viewer,
    profile,
    purchasedProfiles,
    savedProfiles,
    recentlyViewedProfileIds,
    setIsFirstProfileView,
    refreshUser,
    isRefreshed,
  };
};
