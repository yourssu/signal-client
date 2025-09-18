import ProfileCard from "@/components/profile/ProfileCard";
import TurnableProfileCard from "@/components/profile/TurnableProfileCard";
import { cn } from "@/lib/utils";
import { ProfileResponse } from "@/types/profile";
import { useRef, useEffect, useCallback, useState } from "react";

interface ScrollableCardsProps {
  profiles: Array<ProfileResponse & { contact?: string }>;
  selectedId: number;
  onSelect: (profile: ProfileResponse) => void;
}

export const ScrollableCards = ({
  profiles,
  selectedId,
  onSelect,
}: ScrollableCardsProps) => {
  // Refs for scroll container and profile items
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const profileRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [currentIndex, setCurrentIndex] = useState(
    profiles.findIndex((p) => p.profileId === selectedId),
  );

  // Ensure refs array has the correct size
  useEffect(() => {
    profileRefs.current = profileRefs.current.slice(0, profiles.length);
    // Initialize with first profile if available
  }, [profiles]);
  // Function to set refs for profile items
  const setProfileRef = (el: HTMLDivElement | null, index: number) => {
    profileRefs.current[index] = el;
  };

  // Intersection Observer logic to detect which card is centered
  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.75) {
          const index = profileRefs.current.findIndex(
            (ref) => ref === entry.target,
          );
          if (index !== -1) {
            setCurrentIndex(index);
          }
        }
      });
    },
    [],
  );

  // Set up Intersection Observer
  useEffect(() => {
    if (!scrollContainerRef.current) return;

    const observer = new IntersectionObserver(handleIntersection, {
      root: scrollContainerRef.current,
      threshold: 0.75, // Trigger when 75% visible
      rootMargin: "0px",
    });

    profileRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      profileRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
      observer.disconnect();
    };
  }, [handleIntersection, profiles.length]);

  useEffect(() => {
    if (profiles.length > 0) {
      onSelect(profiles[currentIndex]);
    }
  }, [currentIndex, onSelect, profiles]);

  return (
    <div
      ref={scrollContainerRef}
      className="w-full flex overflow-x-auto snap-x snap-mandatory scroll-smooth gap-4 grow items-center py-2 no-scrollbar"
    >
      {profiles.map((p, index) => (
        <div
          key={p.profileId}
          ref={(el) => setProfileRef(el, index)}
          className={cn(
            "snap-center flex-shrink-0 w-[calc(100%-3rem)]",
            index === 0 && "ml-6",
            index > 0 && index === profiles.length - 1 && "mr-6",
          )}
        >
          {p.contact ? (
            <TurnableProfileCard
              profile={p}
              contact={p.contact}
              isFlipped={true}
            />
          ) : (
            <ProfileCard profile={p} />
          )}
        </div>
      ))}
    </div>
  );
};
