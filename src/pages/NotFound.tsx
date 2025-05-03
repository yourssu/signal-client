import Background from "@/components/home/Background";
import TopBar from "@/components/home/TopBar";
import { buttonVariants } from "@/components/ui/button";
import React from "react";
import { Link } from "react-router";

const NotFound: React.FC = () => {
  return (
    <div className="h-dvh min-h-dvh">
      <Background />
      <main className="max-w-md mx-auto w-full h-full shadow-sm">
        {/* Top bar with heart and ticket icons */}
        <TopBar />

        {/* Main content with text, image, and buttons */}
        <div className="flex flex-col items-center justify-center h-full gap-4 p-6">
          <h1 className="text-2xl font-bold text-pink md:text-3xl">
            페이지를 찾을 수 없어요!
          </h1>
          <p className="text-gray-600">
            잘못된 페이지로 이동된 것 같아요. 처음으로 돌아갈까요?
          </p>
          <Link to="/" className={buttonVariants({ size: "xl" })}>
            처음으로 돌아가기
          </Link>
        </div>
      </main>
    </div>
  );
};

export default NotFound;
