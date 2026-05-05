import React from "react";
import TopBar from "@/components/Header";
import MainContent from "@/components/home/MainContent";
import { useUser } from "@/hooks/useUser";

const HomePage: React.FC = () => {
  const { profile } = useUser();
  return (
    <div className="flex flex-col min-h-dvh relative">
      <title>시그널 by YOURSSU</title>
      {/* Top bar with heart and ticket icons */}
      <TopBar />

      {/* Main content with text, image, and buttons */}
      <MainContent
        profileRegistered={!!profile}
      />
    </div>
  );
};

export default HomePage;
