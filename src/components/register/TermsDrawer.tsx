import React, { useRef, useState, useLayoutEffect } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
  DrawerDescription,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

interface TermsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  terms: string;
}

const TermsDrawer: React.FC<TermsDrawerProps> = ({
  open,
  onOpenChange,
  title,
  terms,
}) => {
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
  }, [terms, open]);

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
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="px-6">
        <DrawerHeader className="text-center">
          <DrawerTitle className="text-xl font-semibold text-foreground">
            {title}
          </DrawerTitle>
          <DrawerDescription className="text-muted-foreground">
            스크롤을 내려 내용을 확인해주세요.
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-4 mb-4">
          <div
            ref={initScrollRef}
            onScroll={handleScroll}
            className="h-[40vh] w-full rounded-md border overflow-auto p-4"
          >
            <pre className="whitespace-pre-wrap font-sans text-xs">{terms}</pre>
          </div>
        </div>

        <DrawerFooter>
          {isScrolledToBottom ? (
            <DrawerClose asChild>
              <Button size="xl" className="w-full">
                닫기
              </Button>
            </DrawerClose>
          ) : (
            <Button size="xl" className="w-full" onClick={scrollDown}>
              더 보기
            </Button>
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default TermsDrawer;
