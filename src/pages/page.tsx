import React from "react";
import TopBar from "@/components/TopBar";
import MainContent from "@/components/home/MainContent";
import { useViewerSelf } from "@/hooks/queries/viewers";
import { useAtomValue } from "jotai";
import { userProfileAtom } from "@/atoms/userProfile";

const HomePage: React.FC = () => {
  const profile = useAtomValue(userProfileAtom);
  const { data: self } = useViewerSelf();
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
