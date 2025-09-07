import { userGenderAtom } from "@/atoms/userGender";
import { userProfileAtom } from "@/atoms/userProfile";
import { viewerSelfAtom } from "@/atoms/viewerSelf";
import { Button, buttonVariants } from "@/components/ui/button";
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
import {
  ACCOUNT_BANK,
  ACCOUNT_BANK_CODE,
  ACCOUNT_NO,
  ACCOUNT_OWNER,
  API_BASE_URL,
  ENABLE_SAVED,
  IS_LOCAL,
  MODE,
  PERSONALITIES,
  SHA,
  TICKET_COST,
} from "@/env";
import { useUserInfo } from "@/hooks/queries/users";
import { useIssueTicket, useTicketPackages } from "@/hooks/queries/viewers";
import { useAtomValue } from "jotai";
import { Code } from "lucide-react";
import { useRef } from "react";
import { createPortal } from "react-dom";

const resetData = () => {
  localStorage.clear();
  window.location.reload();
};

export const DevTools = () => {
  const { data } = useUserInfo();
  const userUuid = data?.uuid;
  const userGender = useAtomValue(userGenderAtom);
  const userProfile = useAtomValue(userProfileAtom);
  const viewerSelf = useAtomValue(viewerSelfAtom);
  const verificationRef = useRef<HTMLInputElement>(null);
  const countRef = useRef<HTMLInputElement>(null);
  const { mutateAsync: issueTicket } = useIssueTicket();
  const { data: ticketPackages } = useTicketPackages();

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
            {IS_LOCAL || !SHA ? (
              "LOCAL TEST BUILD"
            ) : (
              <a
                href={`https://github.com/yourssu/yourssu-signal-client/commit/${SHA}`}
                target="_blank"
                className="underline"
              >
                REV: {SHA.substring(0, 7)}
              </a>
            )}
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
              <p>self</p>
              <pre className="whitespace-pre-wrap break-all">
                {JSON.stringify(viewerSelf)}
              </pre>
            </div>
            <div>
              <h1 className="font-medium text-lg">ENV</h1>
              <p>NODE_ENV: {import.meta.env.NODE_ENV}</p>
              <p>MODE: {MODE}</p>
              <p>API_BASE_URL: {API_BASE_URL}</p>
              <p>SHA: {SHA}</p>
              <p>TICKET_COST: {TICKET_COST}</p>
              <p>PERSONALITIES: {PERSONALITIES}</p>
              <p>
                ACCOUNT/ACCOUNT_OWNER: {ACCOUNT_BANK}({ACCOUNT_BANK_CODE}){" "}
                {ACCOUNT_NO}/{ACCOUNT_OWNER}
              </p>
              <p>ENABLE_SAVED: {ENABLE_SAVED}</p>
            </div>
            <div>
              <h1 className="font-medium text-lg">PACKAGES</h1>
              <p>ticketPackages</p>
              <pre className="whitespace-pre-wrap break-all">
                {JSON.stringify(ticketPackages)}
              </pre>
            </div>
          </details>
        </div>
        <DrawerFooter>
          <Button onClick={resetData}>데이터 초기화</Button>
          <a
            href="https://www.notion.so/yourssu/Signal-QA-1ef6915d697880d8bf4cfef48e6aeb19"
            target="_blank"
            className={buttonVariants({})}
          >
            제안 & 버그 신고
          </a>
          <DrawerClose asChild>
            <Button variant="outline">닫기</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>,
    document.body,
  );
};
