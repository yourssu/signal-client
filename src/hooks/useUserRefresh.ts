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

  const {
    data: profile,
    isFetched: profileFetched,
    refetch: refetchProfile,
  } = useSelfProfile({
    retry: false,
  });
  const {
    data: viewerSelf,
    isFetched: viewerFetched,
    refetch: refetchViewerSelf,
  } = useViewerSelf({
    retry: false,
  });

  const refreshUser = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["profiles", "me"] });
    queryClient.invalidateQueries({ queryKey: ["viewer", "me"] });
    setRefreshInitiated(true);
    refetchProfile();
    refetchViewerSelf();
  }, [queryClient, refetchProfile, refetchViewerSelf]);

  useEffect(() => {
    if (refreshInitiated) {
      if (profile && profileFetched) {
        setProfile(profile);
        setGender(profile.gender as Gender);
      }
      if (viewerSelf && viewerFetched) setViewerSelf(viewerSelf);
      if (profileFetched && viewerFetched) setIsRefreshed(true);
    }
  }, [
    profile,
    profileFetched,
    setProfile,
    viewerSelf,
    viewerFetched,
    setViewerSelf,
    refreshInitiated,
    setGender,
  ]);

  return { refreshUser, isRefreshed };
};
