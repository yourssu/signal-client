import React from "react";
import TopBar from "@/components/home/TopBar";
import Background from "@/components/home/Background";
import MainContent from "@/components/home/MainContent";

const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen relative">
      {/* Background with gradient effects */}
      <Background />

      {/* Top bar with heart and ticket icons */}
      <TopBar heartCount={0} ticketCount={0} />

      {/* Main content with text, image, and buttons */}
      <MainContent />
    </div>
  );
};

export default HomePage;
