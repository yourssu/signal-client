import React from "react";
import TopBar from "@/components/Header";
import MainContent from "@/components/home/MainContent";
import { useUser } from "@/hooks/useUser";

const HomePage: React.FC = () => {
  const { viewer, profile } = useUser();
  return (
    <div className="flex flex-col min-h-dvh relative">
      <title>시그널 by YOURSSU</title>
      {/* Top bar with heart and ticket icons */}
      <TopBar />

      {/* Main content with text, image, and buttons */}
      <MainContent
        profileRegistered={!!profile}
        verifyNeeded={!viewer || viewer.ticket - viewer.usedTicket === 0}
      />
    </div>
  );
};

export default HomePage;
