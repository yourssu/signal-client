import React from "react";
import TopBar from "@/components/home/TopBar";
import MainContent from "@/components/home/MainContent";
import { useViewerSelf } from "@/hooks/queries/viewers";
import { useUserUuid } from "@/hooks/useUserUuid";
import { useAtomValue } from "jotai";
import { userProfile } from "@/atoms/userProfile";

const HomePage: React.FC = () => {
  const uuid = useUserUuid();
  const profile = useAtomValue(userProfile);
  const { data: self } = useViewerSelf(uuid);
  return (
    <div className="flex flex-col min-h-dvh relative">
      {/* Top bar with heart and ticket icons */}
      <TopBar />

      {/* Main content with text, image, and buttons */}
      <MainContent
        profileRegistered={!!profile}
        verifyNeeded={!self || self.ticket - self.usedTicket === 0}
      />
    </div>
  );
};

export default HomePage;
