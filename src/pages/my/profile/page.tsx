import { userProfileAtom } from "@/atoms/userProfile";
import TopBar from "@/components/Header";
import TurnableProfileCard from "@/components/profile/TurnableProfileCard";
import { Button } from "@/components/ui/button";
import { useAtom } from "jotai";
import { Navigate } from "react-router";

const MyProfilePage: React.FC = () => {
  const [profile] = useAtom(userProfileAtom);
  if (!profile || profile === null) {
    return <Navigate to="/profile/register" />;
  }
  return (
    <div className="min-h-dvh flex flex-col items-center">
      <TopBar onBack="/my" />
      <div className="w-full max-w-md grow p-6 flex flex-col gap-10">
        <div className="w-full max-w-md mx-auto flex flex-col pt-2 gap-2 grow">
          <h1 className="text-2xl font-semibold text-stone-700">나의 프로필</h1>
          <div className="grow flex flex-col justify-center items-stretch self-stretch">
            <TurnableProfileCard
              profile={profile!}
              contact={profile!.contact}
            />
          </div>
          <Button variant="secondary" size="xl" className="w-full text-primary">
            수정하기
          </Button>
          <button className="text-primary underline text-xs cursor-pointer">
            삭제하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyProfilePage;
