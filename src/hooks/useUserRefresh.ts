import { userProfileAtom } from "@/atoms/userProfile";
import { viewerSelfAtom } from "@/atoms/viewerSelf";
import { useSelfProfile } from "@/hooks/queries/profiles";
import { useViewerSelf } from "@/hooks/queries/viewers";
import { useQueryClient } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { useCallback, useEffect, useState } from "react";

export const useUserRefresh = () => {
  const [refreshInitiated, setRefreshInitiated] = useState(false);
  const [isRefreshed, setIsRefreshed] = useState(false);
  const setProfile = useSetAtom(userProfileAtom);
  const setViewerSelf = useSetAtom(viewerSelfAtom);

  const queryClient = useQueryClient();

  const { data: profile, isFetched: profileFetched } = useSelfProfile();
  const { data: viewerSelf, isFetched: viewerFetched } = useViewerSelf();

  const refreshUser = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["profiles", "me"] });
    queryClient.invalidateQueries({ queryKey: ["viewer", "me"] });
    setRefreshInitiated(true);
  }, [queryClient]);

  useEffect(() => {
    if (refreshInitiated) {
      if (profile && profileFetched) setProfile(profile);
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
  ]);

  return { refreshUser, isRefreshed };
};
