import { desiredGenderAtom } from "@/atoms/desiredGender";
import TopBar from "@/components/TopBar";
import GenderStep from "@/components/verify/GenderStep";
import { Gender } from "@/types/profile";
import { useSetAtom } from "jotai";
import { useNavigate } from "react-router";

const GenderSelectPage = () => {
  const setDesiredGender = useSetAtom(desiredGenderAtom);
  const navigate = useNavigate();
  const handleGenderSelect = (gender: Gender) => {
    setDesiredGender(gender);
    navigate("/profile");
  };
  return (
    // Main page container - Flex column, min height screen
    <div className="flex flex-col min-h-dvh">
      <TopBar onBack="/" />
      {/* Content area - Takes remaining height, centers content */}
      <div className="flex-grow flex flex-col items-center justify-center p-4">
        {/* Funnel container - Max width */}
        <div className="w-full max-w-md h-full flex flex-col grow items-stretch justify-stretch">
          <GenderStep onSelect={handleGenderSelect} />
        </div>
      </div>
    </div>
  );
};

export default GenderSelectPage;
