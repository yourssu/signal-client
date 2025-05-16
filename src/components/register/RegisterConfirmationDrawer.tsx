import React from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerTrigger,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import TurnableProfileCard from "@/components/profile/TurnableProfileCard";
import { ProfileResponse } from "@/types/profile";

interface RegisterConfirmationDrawerProps {
  disabled: boolean;
  profile: ProfileResponse;
  contact: string;
  onConfirm: () => void;
}

const RegisterConfirmationDrawer: React.FC<RegisterConfirmationDrawerProps> = ({
  disabled,
  profile,
  contact,
  onConfirm,
}) => {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          disabled={disabled} // Disable button if validation fails
          className={`w-full h-14 rounded-2xl text-lg font-medium transition-colors ${
            disabled
              ? "bg-gray-300 text-white cursor-not-allowed" // Disabled state (Gray - #D1D5DC)
              : "bg-primary text-primary-foreground hover:bg-primary/90" // Enabled state (Pink)
          }`}
        >
          프로필 등록하기
        </Button>
      </DrawerTrigger>
      <DrawerContent className="px-6">
        <DrawerHeader className="text-center">
          <DrawerTitle className="text-xl font-semibold text-foreground">
            마지막으로 확인해주세요!
          </DrawerTitle>
          <DrawerDescription className="text-muted-foreground -mt-1">
            작성한 프로필이 정확한가요?
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col items-center gap-4 px-4 -mt-2">
          <div className="w-full max-w-sm">
            <TurnableProfileCard
              profile={profile}
              contact={contact}
              size="small"
            />
          </div>

          <p className="text-center text-xs font-medium text-primary">
            프로필은 한번 등록하면 수정할 수 없어요
          </p>
        </div>

        <DrawerFooter className="flex-row w-full max-w-md self-center -mt-2">
          <DrawerClose asChild>
            <Button variant="secondary" size="xl">
              취소
            </Button>
          </DrawerClose>
          <Button onClick={onConfirm} size="xl" className="grow">
            등록하기
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default RegisterConfirmationDrawer;
