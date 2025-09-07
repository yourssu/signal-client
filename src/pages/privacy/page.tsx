import React, { useLayoutEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import TopBar from "@/components/Header";
import { Button } from "@/components/ui/button";
import { PRIVACY } from "@/env";

const PrivacyPage: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // Go back one step in browser history
  };

  const scrollRef = useRef<HTMLDivElement>(null);
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);

  const initScrollRef = (node: HTMLDivElement) => {
    if (node) {
      scrollRef.current = node;
      checkScrollPosition();
    }
  };

  const checkScrollPosition = () => {
    const scrollElement = scrollRef.current;
    if (!scrollElement) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollElement;
    // Check if content is scrollable at all
    const isScrollable = scrollHeight > clientHeight + 5; // Adding a small buffer

    if (!isScrollable) {
      // If content is not scrollable, consider it already at the bottom
      setIsScrolledToBottom(true);
      return;
    }

    // Consider "scrolled to bottom" when within 10px of the bottom
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 10;
    setIsScrolledToBottom(isAtBottom);
  };

  // Check scroll position on initial render and when terms change
  useLayoutEffect(() => {
    checkScrollPosition();
  }, []);

  const handleScroll = () => {
    checkScrollPosition();
  };

  const scrollDown = () => {
    const scrollElement = scrollRef.current;
    if (!scrollElement) return;

    // Scroll down by 80% of the viewport height
    scrollElement.scroll({
      top: scrollElement.scrollTop + scrollElement.clientHeight * 0.8,
      behavior: "smooth",
    });
    checkScrollPosition();
  };

  return (
    <div className="w-full h-full flex flex-col items-center">
      <TopBar onBack={handleBack} />
      <div className="flex flex-col gap-4 items-center w-full max-w-md grow p-6">
        <div className="flex flex-col items-start w-full">
          <h1 className="text-2xl font-semibold text-stone-700">
            개인정보처리방침
          </h1>
        </div>
        <div className="px-4 mb-4 self-stretch grow flex items-center">
          <div
            ref={initScrollRef}
            onScroll={handleScroll}
            className="h-[60vh] w-full rounded-md border overflow-auto p-4 bg-white"
          >
            <pre className="whitespace-pre-wrap font-sans text-xs">
              {PRIVACY}
            </pre>
          </div>
        </div>
        {isScrolledToBottom ? (
          <Button size="xl" className="w-full" onClick={handleBack}>
            닫기
          </Button>
        ) : (
          <Button size="xl" className="w-full" onClick={scrollDown}>
            더 보기
          </Button>
        )}
      </div>
    </div>
  );
};

export default PrivacyPage;
