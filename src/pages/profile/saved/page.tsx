import React, { useState, useRef, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router";
import { useAtomValue } from "jotai";
import { Button, buttonVariants } from "@/components/ui/button";
import TopBar from "@/components/home/TopBar";
import { savedProfilesAtom } from "@/atoms/viewerProfiles";
import { ProfileResponse } from "@/types/profile";
import { cn } from "@/lib/utils";
import ProfileCard from "@/components/profile/ProfileCard";

const SavedProfilesPage: React.FC = () => {
  const navigate = useNavigate();
  const savedProfiles = useAtomValue(savedProfilesAtom);

  // State for tracking the currently selected profile and its index
  const [currentIndex, setCurrentIndex] = useState(0);
  const [profile, setProfile] = useState<ProfileResponse | null>(
    savedProfiles[0] || null
  );

  // Refs for scroll container and profile items
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const profileRefs = useRef<Array<HTMLDivElement | null>>([]);

  // Ensure refs array has the correct size
  useEffect(() => {
    profileRefs.current = profileRefs.current.slice(0, savedProfiles.length);
    // Initialize with first profile if available
    if (savedProfiles.length > 0 && !profile) {
      setProfile(savedProfiles[0]);
    }
  }, [profile, savedProfiles]);

  // Update profile state when index changes
  useEffect(() => {
    if (savedProfiles.length > 0) {
      setProfile(savedProfiles[currentIndex]);
    } else {
      setProfile(null);
    }
  }, [currentIndex, savedProfiles]);

  // Intersection Observer logic to detect which card is centered
  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.75) {
          const index = profileRefs.current.findIndex(
            (ref) => ref === entry.target
          );
          if (index !== -1) {
            setCurrentIndex(index);
          }
        }
      });
    },
    []
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
  }, [handleIntersection, savedProfiles.length]);

  const count = `${savedProfiles.length}`.padStart(2, "0");

  const handleBack = () => {
    navigate(-1); // Go back one step in browser history
  };

  const handleViewContact = () => {
    if (!profile?.profileId) return;
    navigate(`/profile/contact/${profile.profileId}?from=saved`, {
      state: {
        profile,
      },
    });
  };

  // Function to set refs for profile items
  const setProfileRef = (el: HTMLDivElement | null, index: number) => {
    profileRefs.current[index] = el;
  };

  return (
    <div className="w-full h-full flex flex-col items-center">
      <TopBar onBack={handleBack} />
      {profile ? (
        <>
          <div className="flex flex-col gap-4 items-center w-full max-w-md grow p-6">
            <div className="flex flex-col items-start w-full">
              <h1 className="text-2xl font-semibold text-stone-700">
                내 마음 속에 <span className="text-primary">{count}명</span>이
                <br />
                저장되어 있어요
              </h1>
            </div>
            {/* Scroll snap implementation */}
            <div
              ref={scrollContainerRef}
              className="w-full flex overflow-x-auto snap-x snap-mandatory scroll-smooth gap-4 grow items-center py-2 no-scrollbar"
            >
              {savedProfiles.map((p, index) => (
                <div
                  key={p.profileId}
                  ref={(el) => setProfileRef(el, index)}
                  className="snap-center flex-shrink-0 w-[calc(100%-2rem)]"
                >
                  <ProfileCard profile={p} />
                </div>
              ))}
            </div>
            <Button
              onClick={handleViewContact}
              size="xl"
              className="w-full rounded-3xl"
            >
              연락처 확인하기
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col gap-4 items-center w-full max-w-md grow p-6">
            <div className="flex flex-col items-start w-full">
              <h1 className="text-2xl font-semibold text-stone-700">
                아직 저장된 사람이 없어요
                <br />
                마음에 드는 사람을 저장해보세요
              </h1>
            </div>
            <Link
              to="/profile"
              className={cn(
                buttonVariants({ size: "xl" }),
                "w-full rounded-3xl mt-auto"
              )}
            >
              시그널 보내러 가기
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default SavedProfilesPage;
