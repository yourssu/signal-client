import { userGenderAtom } from "@/atoms/userGender";
import { userProfileAtom } from "@/atoms/userProfile";
import { viewerSelfAtom } from "@/atoms/viewerSelf";
import { useSelfProfile } from "@/hooks/queries/profiles";
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
  const setGender = useSetAtom(userGenderAtom);

  const queryClient = useQueryClient();

  const { data: profile, isPending: isProfilePending } = useSelfProfile({
    retry: false,
  });
  const { data: viewerSelf, isPending: isViewerSelfPending } = useViewerSelf({
    retry: false,
  });

  const refreshUser = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["profiles", "me"] });
    queryClient.invalidateQueries({ queryKey: ["viewer", "me"] });
    setRefreshInitiated(true);
  }, [queryClient]);

  useEffect(() => {
    if (refreshInitiated) {
      console.log(
        "refreshing user data...",
        profile,
        viewerSelf,
        isProfilePending,
        isViewerSelfPending,
      );
      if (profile && !isProfilePending) {
        setProfile(profile);
        setGender(profile.gender as Gender);
      }
      if (viewerSelf && !isViewerSelfPending) setViewerSelf(viewerSelf);
      if (!isProfilePending && !isViewerSelfPending) setIsRefreshed(true);
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
  ]);

  return { refreshUser, isRefreshed };
};
