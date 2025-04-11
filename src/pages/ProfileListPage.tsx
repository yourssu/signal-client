import React, { useState, useRef } from "react";
import { useNavigate } from "react-router";
import ProfileCard, { Profile } from "../components/profile/ProfileCard";

// Mock data - in a real app, this would come from an API
const mockProfiles: Profile[] = [
  {
    id: "1",
    nickname: "멋쟁이",
    mbti: "ENFP",
    animal: "강아지",
    gender: "male",
    contact: "010-1234-5678",
  },
  {
    id: "2",
    nickname: "귀요미",
    mbti: "INTJ",
    animal: "고양이",
    gender: "female",
    contact: "010-8765-4321",
  },
  // Add more mock profiles as needed
];

const ProfileListPage: React.FC = () => {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState(mockProfiles);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);

    if (cardRef.current && touchStart !== null) {
      const distance = touchStart - e.targetTouches[0].clientX;
      const translateX = -distance;
      cardRef.current.style.transform = `translateX(${translateX}px)`;
    }
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (cardRef.current) {
      cardRef.current.style.transform = "";
    }

    if (isLeftSwipe) {
      handleViewContact();
    } else if (isRightSwipe) {
      handleSkip();
    }
  };

  const handleViewContact = () => {
    if (profiles.length === 0) return;

    const confirmView = window.confirm(
      "이용권이 1회 차감됩니다. 연락처를 확인하시겠습니까?"
    );
    if (confirmView) {
      navigate(`/profile/contact/${profiles[0].id}`);
    }
  };

  const handleSkip = () => {
    if (profiles.length === 0) return;
    setProfiles((prev) => prev.slice(1));
  };

  if (profiles.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">더 이상 프로필이 없습니다</h2>
          <button
            onClick={() => navigate("/")}
            className="py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div
        ref={cardRef}
        className="w-full max-w-sm transition-transform"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <ProfileCard
          profile={profiles[0]}
          onViewContact={handleViewContact}
          onSkip={handleSkip}
        />
      </div>
    </div>
  );
};

export default ProfileListPage;
