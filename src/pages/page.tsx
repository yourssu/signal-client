import React, { useEffect } from "react";
import TopBar from "@/components/Header";
import MainContent from "@/components/home/MainContent";
import { useUser } from "@/hooks/useUser";
import { startPageViewed } from "@/lib/analytics";

const HomePage: React.FC = () => {
  const { profile } = useUser();

  useEffect(() => {
    startPageViewed();
  }, []);

  return (
    <div className="flex flex-col min-h-dvh relative">
      <title>시그널 by YOURSSU</title>
      <TopBar />
      <MainContent profileRegistered={!!profile} />
    </div>
  );
};

export default HomePage;
