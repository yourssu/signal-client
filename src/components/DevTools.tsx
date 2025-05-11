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
import { Input } from "@/components/ui/input";
import { useIssueTicket } from "@/hooks/queries/viewers";
import { useAtomValue } from "jotai";
import { Code } from "lucide-react";
import { useRef } from "react";
import { createPortal } from "react-dom";

const IS_LOCAL = import.meta.env.NODE_ENV === "development";

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
  const verificationRef = useRef<HTMLInputElement>(null);
  const countRef = useRef<HTMLInputElement>(null);
  const { mutateAsync: issueTicket } = useIssueTicket();

  const handleVerification = async () => {
    if (!verificationRef.current || !countRef.current) return;
    const verificationCode = Number(verificationRef.current.value);
    const ticket = Number(countRef.current.value);
    if (!verificationCode || isNaN(ticket)) return;

    try {
      await issueTicket({
        secretKey: "DonaEmilyEatSteakLeopold",
        verificationCode,
        ticket,
      });
      alert("티켓 발급 완료");
    } catch (error) {
      console.error(error);
      alert("티켓 발급 실패");
    }
  };
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
        <div className="flex flex-col gap-2 max-h-64 overflow-y-auto overflow-x-hidden mx-4">
          <div className="flex flex-col gap-1">
            <h1 className="font-medium text-lg">Verification</h1>
            <Input
              ref={verificationRef}
              placeholder="Enter verification code..."
            />
            <Input
              ref={countRef}
              type="number"
              placeholder="Enter ticket count..."
            />
            <Button onClick={handleVerification}>Provide Ticket</Button>
          </div>
          <details>
            <summary className="font-medium text-lg cursor-pointer">
              Debug Information
            </summary>
            <div className="flex flex-col gap-1">
              <h1 className="font-medium text-lg">PROFILE</h1>
              <p>userGender: {userGender}</p>
              <p>userProfile</p>
              <pre className="whitespace-pre-wrap break-all">
                {JSON.stringify(userProfile)}
              </pre>
            </div>
            <div>
              <h1 className="font-medium text-lg">VIEWER</h1>
              <p>desiredGender: {desiredGender}</p>
              <p>self</p>
              <pre className="whitespace-pre-wrap break-all">
                {JSON.stringify(viewerSelf)}
              </pre>
            </div>
          </details>
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
