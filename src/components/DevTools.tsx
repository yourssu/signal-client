import { desiredGenderAtom } from "@/atoms/desiredGender";
import { userGenderAtom } from "@/atoms/userGender";
import { userProfileAtom } from "@/atoms/userProfile";
import { userUuidAtom } from "@/atoms/userUuid";
import { viewerSelfAtom } from "@/atoms/viewerSelf";
import { Button } from "@/components/ui/button";
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
import { useAtomValue } from "jotai";
import { Code } from "lucide-react";
import { createPortal } from "react-dom";

const IS_LOCAL = import.meta.env.NODE_ENV !== "production";

const resetData = () => {
  localStorage.clear();
  window.location.reload();
};

export const DevTools = () => {
  const userUuid = useAtomValue(userUuidAtom);
  const desiredGender = useAtomValue(desiredGenderAtom);
  const userGender = useAtomValue(userGenderAtom);
  const userProfile = useAtomValue(userProfileAtom);
  const viewerSelf = useAtomValue(viewerSelfAtom);
  return createPortal(
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          size="icon"
          className="fixed top-0 left-1/2 my-2 -translate-x-1/2 opacity-50 hover:opacity-100 transition-all"
        >
          <Code />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>SIGNAL DEVTOOLS</DrawerTitle>
          <DrawerDescription>
            {IS_LOCAL ? "LOCAL TEST BUILD" : `SHA: ${import.meta.env.VITE_SHA}`}
            <br />
            {userUuid && `UUID: ${userUuid}`}
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-2 h-64 overflow-y-auto overflow-x-hidden mx-4">
          <div>
            <h1 className="font-medium text-lg">PROFILE</h1>
            <p>userGender: {userGender}</p>
            <p>userProfile</p>
            <pre className="whitespace-pre-wrap">
              {JSON.stringify(userProfile)}
            </pre>
          </div>
          <div>
            <h1 className="font-medium text-lg">VIEWER</h1>
            <p>desiredGender: {desiredGender}</p>
            <p>self</p>
            <pre className="whitespace-pre-wrap">
              {JSON.stringify(viewerSelf)}
            </pre>
          </div>
        </div>
        <DrawerFooter>
          <Button onClick={resetData}>데이터 초기화</Button>
          <Button>제안 & 버그 신고</Button>
          <DrawerClose asChild>
            <Button variant="outline">닫기</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>,
    document.body
  );
};
