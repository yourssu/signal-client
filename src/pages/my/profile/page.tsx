import { userProfileAtom } from "@/atoms/userProfile";
import TopBar from "@/components/Header";
import { DeleteConfirmationDialog } from "@/components/my/DeleteConfirmationDialog";
import ProfileCardEditor from "@/components/profile/ProfileCardEditor";
import TurnableProfileCard from "@/components/profile/TurnableProfileCard";
import { Button } from "@/components/ui/button";
import {
  useAddMyToBlacklist,
  useCheckMyBlacklistStatus,
} from "@/hooks/queries/blacklists";
import { useUpdateProfile } from "@/hooks/queries/profiles";
import { ProfileUpdateRequest } from "@/types/profile";
import { useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { useState } from "react";
import { Navigate } from "react-router";
import { toast } from "sonner";

const MyProfilePage: React.FC = () => {
  const [profile, setProfile] = useAtom(userProfileAtom);
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
  const { mutateAsync: deleteProfile } = useAddMyToBlacklist({
    onError: (error) =>
      toast.error("프로필 삭제가 실패했어요.", { description: error.message }),
  });

  if (!profile || profile === null) {
    return <Navigate to="/profile/register" />;
  }

  const handleUpdateStart = () => {
    setProfileDraft(profile);
    setIsEditing(true);
  };

  const handleProfileUpdate = (updated: ProfileUpdateRequest) => {
    setProfileDraft((prev) => ({ ...prev!, ...updated }));
  };

  const handleProfileDelete = async () => {
    await deleteProfile();
    queryClient.invalidateQueries({ queryKey: ["blacklists", "me", "status"] });
    setIsDeleteConfirmOpen(false);
    toast.success("프로필이 삭제되었어요.");
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
            <Button size="xl" disabled>
              삭제된 프로필이에요
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
                삭제하기
              </button>
            </>
          )}
        </div>
      </div>
      <DeleteConfirmationDialog
        open={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
        onConfirm={handleProfileDelete}
      />
    </div>
  );
};

export default MyProfilePage;
