import React, { useEffect, useState } from "react";
import TopBar from "@/components/Header";
import SlotMarker from "@/components/lobby/SlotMarker";
import PartySizeFilterCard, {
  PartySize,
} from "@/components/lobby/PartySizeFilterCard";
import LatestMatchBanner from "@/components/lobby/LatestMatchBanner";
import MatchChanceChip from "@/components/lobby/MatchChanceChip";
import ProfileRequiredDialog from "@/components/lobby/ProfileRequiredDialog";
import { useMeetingBoard } from "@/hooks/queries/meetings";
import { SLOT_POSITIONS } from "@/lib/meeting";
import { lobbyViewed } from "@/lib/analytics";
import mapBackground from "@/assets/lobby/map_background.png";
import btnManual from "@/assets/lobby/btn_manual.svg";
import btnInvite from "@/assets/lobby/btn_invite.svg";
import type { MeetingSlotResponse } from "@/types/meeting";

const LobbyPage: React.FC = () => {
  const { data: board } = useMeetingBoard();
  const [partySize, setPartySize] = useState<PartySize>(null);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);

  useEffect(() => {
    lobbyViewed();
  }, []);

  const handleSlotClick = (slotItem: MeetingSlotResponse) => {
    if (
      !slotItem.room &&
      board?.creationEligibility.reason === "PROFILE_REQUIRED"
    ) {
      setProfileDialogOpen(true);
    }
  };

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden">
      <title>모두의 시그널 - 시그널</title>

      <div className="relative z-10">
        <TopBar onBack="/" hideInfo />
      </div>

      <div className="relative flex-1">
        {/*
          맵을 하단 카드 블록에 앵커한다. bottom-[103px](마커 높이 93 + 여백 10)로 띄운 뒤
          translate-y로 자기 높이의 61.398%(마지막 마커 행 위치)만큼 되돌리면,
          뷰포트 높이와 무관하게 마지막 마커와 카드 간격이 10px로 고정된다.
        */}
        <div className="absolute inset-x-[-1.615%] bottom-[103px] aspect-[387.113/960.766] translate-y-[38.602%]">
          <img
            src={mapBackground}
            alt=""
            className="absolute inset-0 size-full object-cover"
          />
          {board?.slots.slice(0, SLOT_POSITIONS.length).map((slotItem, i) => (
            <SlotMarker
              key={slotItem.slot}
              room={slotItem.room}
              position={SLOT_POSITIONS[i]}
              onClick={() => handleSlotClick(slotItem)}
            />
          ))}
        </div>

        {/* TODO: 매칭 기회 횟수 API 필드가 없어 1로 고정 */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2">
          <MatchChanceChip count={1} />
        </div>

        <div className="absolute top-3 right-4 flex flex-col items-center gap-2">
          <div className="flex w-[53px] flex-col items-center">
            <img src={btnManual} alt="" className="mb-[-4px] size-[40px]" />
            <span className="caption2 text-static-white w-[44px] rounded-[31px] bg-blue-600 py-[2px] text-center">
              설명서
            </span>
          </div>
          <div className="flex w-[53px] flex-col items-center">
            <img src={btnInvite} alt="" className="mb-[-4px] size-[40px]" />
            <span className="caption2 bg-primary text-static-white w-[44px] rounded-[31px] py-[2px] text-center">
              친구초대
            </span>
          </div>
        </div>
      </div>

      <div className="flex shrink-0 flex-col gap-3 px-[4.27%] pb-[43.65px]">
        {board?.latestMatch && <LatestMatchBanner match={board.latestMatch} />}
        <PartySizeFilterCard value={partySize} onChange={setPartySize} />
      </div>

      <ProfileRequiredDialog
        open={profileDialogOpen}
        onOpenChange={setProfileDialogOpen}
      />
    </div>
  );
};

export default LobbyPage;
