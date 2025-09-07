import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"; // Assuming drawer is in ui
import { Button, buttonVariants } from "@/components/ui/button";
import HeartGif from "@/assets/profile/heart_filled.gif"; // Import the downloaded GIF
import { Link } from "react-router";
import { cn } from "@/lib/utils";

interface SaveDrawerProps {
  children: React.ReactNode; // To wrap the trigger element
  onFindPartnerClick?: () => void;
}

export function SaveDrawer({ children }: SaveDrawerProps) {
  return (
    <Drawer>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="rounded-t-[35px]">
        <div className="mx-auto w-full max-w-sm p-[22px] pt-[40px]">
          <DrawerHeader className="p-0">
            <div className="flex flex-col items-center gap-[17px]">
              <div className="flex flex-col items-center gap-[10px] py-[7px]">
                <DrawerTitle className="text-2xl font-semibold text-[#404040]">
                  저장 완료
                </DrawerTitle>
                <DrawerDescription className="text-center text-lg font-medium text-[#525252]">
                  상단 하트 아이콘을 누르면
                  <br />
                  저장 목록을 확인할 수 있어요
                </DrawerDescription>
              </div>
              <img
                src={HeartGif}
                alt="Heart animation"
                width={100}
                height={100}
              />
            </div>
          </DrawerHeader>
          <DrawerFooter className="mt-[27px] flex flex-col gap-[18px] p-0">
            <Link
              to="/my/signals"
              className={cn(
                buttonVariants(),
                "h-auto rounded-[16px] bg-[#EE518A] py-3 text-lg font-medium text-white hover:bg-[#d8487b]",
              )} /* Style first button */
            >
              저장 목록 보기
            </Link>
            {/* DrawerClose can be used, or a regular button with custom logic */}
            <DrawerClose asChild>
              <Button
                variant="outline" // Use outline or style manually
                className="h-auto rounded-[16px] border-none bg-[#FFF2F7] py-3 text-lg font-medium text-[#EE518A] hover:bg-[#fdeaf1]" /* Style second button */
              >
                이어서 시그널 보내기
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
