import { userProfileAtom } from "@/atoms/user";
import TopBar from "@/components/Header";
import { BlacklistConfirmationDialog } from "@/components/my/BlacklistConfirmationDialog";
import ProfileCardEditor from "@/components/profile/ProfileCardEditor";
import TurnableProfileCard from "@/components/profile/TurnableProfileCard";
import { Button } from "@/components/ui/button";
import {
  useAddMyToBlacklist,
  useCheckMyBlacklistStatus,
  useRemoveMyFromBlacklist,
} from "@/hooks/queries/blacklists";
import { useUpdateProfile } from "@/hooks/queries/profiles";
import { useUser } from "@/hooks/useUser";
import { ProfileUpdateRequest } from "@/types/profile";
import { useQueryClient } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { useState } from "react";
import { Navigate } from "react-router";
import { toast } from "sonner";

const MyProfilePage: React.FC = () => {
  const { profile } = useUser();
  const setProfile = useSetAtom(userProfileAtom);
  const [isEditing, setIsEditing] = useState(false);
  const [profileDraft, setProfileDraft] = useState(profile);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const queryClient = useQueryClient();
  const { data } = useCheckMyBlacklistStatus();
  const isDeleted = data?.isBlacklisted ?? false;
  const { mutateAsync: updateProfile } = useUpdateProfile({
    onError: (error) =>
      toast.error("프로필 수정이 실패했어요.", { description: error.message }),
  });
  const { mutateAsync: addToBlacklist } = useAddMyToBlacklist({
    onError: (error) =>
      toast.error("프로필 비공개에 실패했어요.", {
        description: error.message,
      }),
  });

  const { mutateAsync: removeFromBlacklist } = useRemoveMyFromBlacklist({
    onError: (error) =>
      toast.error("프로필 공개에 실패했어요.", { description: error.message }),
  });

  if (!profile || profile === null) {
    return <Navigate to="/profile/register" replace />;
  }

  const handleUpdateStart = () => {
    setProfileDraft(profile);
    setIsEditing(true);
  };

  const handleProfileUpdate = (updated: ProfileUpdateRequest) => {
    setProfileDraft((prev) => ({ ...prev!, ...updated }));
  };

  const handleAddProfileToBlacklist = async () => {
    await addToBlacklist();
    queryClient.invalidateQueries({ queryKey: ["blacklists", "me", "status"] });
    setIsDeleteConfirmOpen(false);
    toast.success("프로필이 비공개되었어요.");
  };

  const handleRemoveProfileFromBlacklist = async () => {
    await removeFromBlacklist();
    queryClient.invalidateQueries({ queryKey: ["blacklists", "me", "status"] });
    toast.success("프로필이 공개되었어요.");
  };

  const handleUpdateCancelled = () => {
    setProfileDraft(profile);
    setIsEditing(false);
  };

  const handleUpdateDone = async () => {
    const ret = await updateProfile({
      nickname: profileDraft!.nickname,
      introSentences: profileDraft!.introSentences,
      contact: profileDraft!.contact,
    });
    setProfile(ret);
    setProfileDraft(ret);
    toast.success("프로필이 수정되었어요.");
    setIsEditing(false);
  };

  return (
    <div className="min-h-dvh flex flex-col items-center">
      <title>나의 프로필 - 시그널</title>
      <TopBar onBack="/my" />
      <div className="w-full max-w-md grow p-6 flex flex-col gap-10">
        <div className="w-full max-w-md mx-auto flex flex-col gap-2 grow">
          <h1 className="text-2xl font-semibold text-stone-700">나의 프로필</h1>
          <div className="grow flex flex-col justify-center items-stretch self-stretch">
            {isEditing ? (
              <ProfileCardEditor
                profile={profileDraft!}
                onChange={handleProfileUpdate}
              />
            ) : (
              <TurnableProfileCard
                profile={profile!}
                contact={profile!.contact}
              />
            )}
          </div>
          {isDeleted ? (
            <Button size="xl" onClick={handleRemoveProfileFromBlacklist}>
              프로필 공개
            </Button>
          ) : isEditing ? (
            <>
              <Button size="xl" onClick={handleUpdateDone}>
                수정 완료
              </Button>
              <button
                className="text-primary underline text-xs cursor-pointer"
                onClick={handleUpdateCancelled}
              >
                수정 취소
              </button>
            </>
          ) : (
            <>
              <Button
                variant="secondary"
                size="xl"
                className="w-full text-primary"
                onClick={handleUpdateStart}
              >
                수정하기
              </Button>
              <button
                className="text-primary underline text-xs cursor-pointer"
                onClick={() => setIsDeleteConfirmOpen(true)}
              >
                프로필 비공개
              </button>
            </>
          )}
        </div>
      </div>
      <BlacklistConfirmationDialog
        open={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
        onConfirm={handleAddProfileToBlacklist}
      />
    </div>
  );
};

export default MyProfilePage;
