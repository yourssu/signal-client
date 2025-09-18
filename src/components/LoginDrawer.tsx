import * as React from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import googleLogo from "@/assets/google.png";
import loginImage from "@/assets/login.png";
import { Button } from "@/components/ui/button";
import { useGoogleLogin } from "@react-oauth/google";

interface LoginDrawerProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  showNextTime?: boolean;
  trigger?: React.ReactNode;
  children?: React.ReactNode;
}

export function LoginDrawer({
  open,
  onOpenChange,
  showNextTime,
  trigger,
  children,
}: LoginDrawerProps) {
  const login = useGoogleLogin({
    redirect_uri: `${window.location.origin}/auth/google`,
    flow: "auth-code",
    ux_mode: "redirect",
    scope: "openid email",
  });
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      {trigger && <DrawerTrigger asChild>{trigger}</DrawerTrigger>}
      {children && <DrawerTrigger asChild>{children}</DrawerTrigger>}

      <DrawerContent className="px-6">
        <DrawerHeader className="text-center">
          <DrawerDescription className="text-muted-foreground -mt-1">
            나의 프로필이 얼마나 열람됐는지 궁금하다면?
          </DrawerDescription>
          <DrawerTitle className="text-2xl font-semibold text-foreground">
            <p className="text-neutral-700 text-center">
              구글 계정으로 간편하게
            </p>
            <p className="tex text-center">
              <span className="text-primary">시그널</span>
              <span className="text-neutral-700">에 로그인 해보세요</span>
            </p>
          </DrawerTitle>
        </DrawerHeader>

        <div className="flex flex-col gap-10 items-center justify-start px-4 py-6">
          {/* Image */}
          <div
            className="w-[213px] h-[143px] bg-no-repeat bg-center bg-cover"
            style={{ backgroundImage: `url('${loginImage}')` }}
          />
        </div>

        <DrawerFooter className="flex-col w-full max-w-md self-center gap-3">
          {/* Google Login Button */}
          <Button
            onClick={login}
            variant="outline"
            className="g-signin2 bg-white h-14 justify-start rounded-full"
          >
            <div className="flex items-center gap-2.5 pl-2 pr-5">
              <div className="size-6 flex-shrink-0">
                <img src={googleLogo} alt="Google" className="w-full h-full" />
              </div>
            </div>
            <span className="text-base font-medium text-center">
              Google 계정으로 로그인
            </span>
          </Button>
          {showNextTime && (
            <DrawerClose className="text-xs underline text-primary cursor-pointer">
              다음에 할래요
            </DrawerClose>
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
