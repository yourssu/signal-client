import { userProfileAtom } from "@/atoms/userProfile";
import TopBar from "@/components/Header";
import ProfileCardEditor from "@/components/profile/ProfileCardEditor";
import TurnableProfileCard from "@/components/profile/TurnableProfileCard";
import { Button } from "@/components/ui/button";
import { useUpdateProfile } from "@/hooks/queries/profiles";
import { ProfileUpdateRequest } from "@/types/profile";
import { useAtom } from "jotai";
import { useState } from "react";
import { Navigate } from "react-router";
import { toast } from "sonner";

const MyProfilePage: React.FC = () => {
  const [profile, setProfile] = useAtom(userProfileAtom);
  const [isEditing, setIsEditing] = useState(false);
  const [profileDraft, setProfileDraft] = useState(profile);
  const { mutateAsync: updateProfile } = useUpdateProfile({
    onError: (error) =>
      toast.error("프로필 수정이 실패했어요.", { description: error.message }),
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

  const handleUpdateDone = async () => {
    const ret = await updateProfile({
      nickname: profileDraft!.nickname,
      introSentences: profileDraft!.introSentences,
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
        <div className="w-full max-w-md mx-auto flex flex-col pt-2 gap-2 grow">
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
          {isEditing ? (
            <Button size="xl" onClick={handleUpdateDone}>
              수정 완료
            </Button>
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
              <button className="text-primary underline text-xs cursor-pointer">
                삭제하기
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyProfilePage;
