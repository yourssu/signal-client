import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import TopBar from "@/components/Header";
import SlotMarker from "@/components/lobby/SlotMarker";
import PartySizeFilterCard, {
  PartySizeFilter,
} from "@/components/lobby/PartySizeFilterCard";
import LatestMatchBanner from "@/components/lobby/LatestMatchBanner";
import MatchChanceChip from "@/components/lobby/MatchChanceChip";
import ManualDialog from "@/components/lobby/ManualDialog";
import ProfileRequiredDialog from "@/components/lobby/ProfileRequiredDialog";
import RoomDeleteDialog from "@/components/lobby/RoomDeleteDialog";
import RoomPreviewSheet from "@/components/lobby/RoomPreviewSheet";
import RoomWaitingSheet from "@/components/meeting/status/RoomWaitingSheet";
import RoomMatchedSheet from "@/components/meeting/status/RoomMatchedSheet";
import RoomExpiredSheet from "@/components/meeting/status/RoomExpiredSheet";
import {
  useCancelMeetingRoom,
  useMeetingBoard,
  useMeetingResult,
  useMeetingRoom,
} from "@/hooks/queries/meetings";
import { useQueryClient } from "@tanstack/react-query";
import { useNow } from "@/hooks/useNow";
import { useUser } from "@/hooks/useUser";
import {
  getJoinBlockedReason,
  getRoomRunMinutes,
  MEETING_CREATION_BLOCK_MESSAGES,
  MEETING_SLOTS,
  SLOT_POSITIONS,
} from "@/lib/meeting";
import {
  lobbyViewed,
  meetingManualClick,
  meetingReferralClick,
  roomCreateClick,
  roomDeleteClick,
  roomDeleteCompleteClick,
  roomDetailClick,
  roomParticipateClick,
} from "@/lib/analytics";
import { shareReferralLink } from "@/lib/referral";
import { DISABLED_REGISTER_DESC, ENABLE_REGISTER } from "@/env";
import mapBackground from "@/assets/lobby/map_background.png";
import btnManual from "@/assets/lobby/btn_manual.svg";
import btnInvite from "@/assets/lobby/btn_invite.svg";
import type { MeetingRoomSummaryResponse, MeetingSlot } from "@/types/meeting";

/** 베타 정책상 하루 한 번이다. 서버에 남은 횟수 필드가 생기면 그 값으로 바꾼다. */
const MATCH_CHANCE_PER_DAY = 1;

/**
 * 마커의 남은 시간을 다시 그리는 주기(ms).
 * "N분 남음" 표시라 초 단위까지 맞출 필요는 없고, 마감된 핀이 눌리지 않을 만큼만 촘촘하면 된다.
 */
const MARKER_TICK_INTERVAL = 10_000;

/** 만료 안내를 본(로컬 타이머 만료) 방과, 안내를 닫아 더는 보지 않기로 한 방을 하나로 묶은 상태. */
interface RoomDismissal {
  roomId: number;
  phase: "expired" | "dismissed";
}

const LobbyPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { profile } = useUser();
  const { data: board, isError } = useMeetingBoard();
  const now = useNow(MARKER_TICK_INTERVAL);
  const [partySize, setPartySize] = useState<PartySizeFilter>(null);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [manualOpen, setManualOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [previewRoomId, setPreviewRoomId] = useState<number | null>(null);
  const [roomDismissal, setRoomDismissal] = useState<RoomDismissal | null>(
    null,
  );

  const myRoom = board?.myRoom ?? null;

  // dismissal이 지금 서버가 내려주는 방과 다른 방을 가리키면(예: 그 사이 새 방이 생겼다면)
  // 낡은 기록이므로 무시한다.
  const isDismissed =
    roomDismissal?.phase === "dismissed" &&
    (!myRoom || roomDismissal.roomId === myRoom.roomId);
  const activeRoom = myRoom && !isDismissed ? myRoom : null;
  const isMatched = activeRoom?.status === "MATCHED";

  const myRoomSlot = useMemo(
    () =>
      myRoom
        ? (board?.slots.find((s) => s.room?.id === myRoom.roomId) ?? null)
        : null,
    [board, myRoom],
  );
  const openRoomExpiresAt =
    myRoom?.status === "OPEN" ? myRoomSlot?.room?.expiresAt : undefined;

  // 로컬 타이머 만료(phase: "expired")가 최신 서버 상태와 어긋나면 해제한다.
  // - 만료 직전 매칭되면(타이머가 0에 닿은 뒤 폴링이 MATCHED를 주는 경우) 매칭 시트를 보여줘야 한다.
  // - 기기 시계가 서버보다 빨라 방이 여전히 OPEN이고 만료 시각이 미래이면 오탐이다.
  const isLocalExpiryOverridden =
    !!roomDismissal &&
    roomDismissal.phase === "expired" &&
    !!myRoom &&
    roomDismissal.roomId === myRoom.roomId &&
    (myRoom.status === "MATCHED" ||
      (myRoom.status === "OPEN" &&
        !!openRoomExpiresAt &&
        new Date(openRoomExpiresAt).getTime() > Date.now()));

  const isLocalExpiryActive =
    roomDismissal?.phase === "expired" &&
    (!myRoom || roomDismissal.roomId === myRoom.roomId) &&
    !isLocalExpiryOverridden;

  // OPEN인데 보드 슬롯에서 방을 찾을 수 없으면 대기 시트를 그릴 근거(만료 시각)가 없다.
  // useMeetingRoom은 staleTime: Infinity라 갱신되지 않고 목 데이터와도 어긋나므로 쓰지 않는다.
  // 이 경우 RoomWaitingSheet가 마운트되지 않아 onExpire가 불리지 않으므로 여기서 바로 만료로 본다.
  const isMissingFromBoard =
    activeRoom?.status === "OPEN" && !openRoomExpiresAt;

  // 만료 시트에 표시할 방 id. activeRoom과 무관하게 로컬 상태만으로 떠야 하므로
  // myRoom이 null이 되어도(서버가 방을 완전히 지워도) 계속 유지된다.
  let expiredRoomId: number | null = null;
  if (isLocalExpiryActive && roomDismissal) {
    expiredRoomId = roomDismissal.roomId;
  } else if (isMissingFromBoard && activeRoom) {
    expiredRoomId = activeRoom.roomId;
  }

  const { data: roomDetail, isError: isRoomDetailError } = useMeetingRoom(
    activeRoom?.roomId ?? 0,
    {
      enabled: isMatched,
      staleTime: Infinity,
    },
  );
  const { data: matchResult, isError: isMatchResultError } = useMeetingResult(
    activeRoom?.roomId ?? 0,
    {
      enabled: isMatched,
      staleTime: Infinity,
    },
  );
  const { mutate: cancelRoom, isPending: isCancellingRoom } =
    useCancelMeetingRoom();

  useEffect(() => {
    lobbyViewed();
  }, []);

  // 폴링이라 실패가 반복된다. id를 고정해 토스트가 쌓이지 않게 한다.
  useEffect(() => {
    if (!isError) return;
    toast.error("방 목록을 불러오지 못했어요. 잠시 후 다시 시도할게요", {
      id: "meeting-board-error",
    });
  }, [isError]);

  useEffect(() => {
    if (!isRoomDetailError && !isMatchResultError) return;
    toast.error("매칭 정보를 불러오지 못했어요. 잠시 후 다시 시도해주세요", {
      id: "meeting-room-detail-error",
    });
  }, [isRoomDetailError, isMatchResultError]);

  // 남은 횟수를 주는 필드가 없어 두 갈래로 판단한다. 서버는 사유를 하나만 주므로
  // 매칭된 방을 들고 있는 동안에는 ACTIVE_ROOM_EXISTS에 가려 한도 사유가 오지 않는다.
  // 그 구간은 myRoom이 MATCHED인지로 메운다.
  const isMatchChanceUsedUp =
    board?.creationEligibility?.reason === "DAILY_MEETING_LIMIT_EXCEEDED" ||
    myRoom?.status === "MATCHED";

  const joinBlockedReason = getJoinBlockedReason(myRoom);

  const roomBySlot = useMemo(
    () =>
      new Map(board?.slots.map((slotItem) => [slotItem.slot, slotItem.room])),
    [board],
  );

  const handleDeleteRoom = () => {
    if (!activeRoom) return;
    if (openRoomExpiresAt) {
      roomDeleteCompleteClick(getRoomRunMinutes(openRoomExpiresAt, Date.now()));
    }
    const roomId = activeRoom.roomId;
    cancelRoom(roomId, {
      onSuccess: () => {
        setDeleteDialogOpen(false);
        // 폴링이 다음 응답을 줄 때까지 대기 시트가 잠깐 남지 않도록 로컬로도 지운다.
        setRoomDismissal({ roomId, phase: "dismissed" });
        queryClient.invalidateQueries({ queryKey: ["meetings", "board"] });
      },
      onError: () => {
        setDeleteDialogOpen(false);
        toast.error("방을 삭제하지 못했어요. 잠시 후 다시 시도해주세요");
      },
    });
  };

  const handleReferralClick = async () => {
    // 시트가 뜨기 전에 보낸다. 공유했는지가 아니라 눌렀는지를 재는 이벤트다.
    meetingReferralClick();
    try {
      const result = await shareReferralLink();
      if (result === "copied") toast.success("초대 링크를 복사했어요");
    } catch {
      toast.error("초대 링크를 공유하지 못했어요. 잠시 후 다시 시도해주세요");
    }
  };

  const handleSlotClick = (
    slot: MeetingSlot,
    room?: MeetingRoomSummaryResponse | null,
  ) => {
    if (room) {
      if (myRoom && room.id === myRoom.roomId) return;
      roomDetailClick({
        targetRoomIntro: room.invitation,
        targetRoomPeopleCount: room.partySize,
      });
      setPreviewRoomId(room.id);
      return;
    }

    roomCreateClick(!!profile);
    const eligibility = board?.creationEligibility;
    if (!eligibility) return;

    if (eligibility.canCreate) {
      navigate(`/lobby/create?slot=${slot}`);
      return;
    }

    if (eligibility.reason === "PROFILE_REQUIRED") {
      // 등록 라우트가 닫혀 있으면 안내 모달의 버튼이 홈으로 튕긴다. 사유만 알린다.
      if (!ENABLE_REGISTER) {
        toast.error(DISABLED_REGISTER_DESC);
        return;
      }
      setProfileDialogOpen(true);
      return;
    }

    // 서버가 아직 모르는 사유를 주면 빈 토스트가 뜨므로 문구를 보장한다.
    toast.error(
      (eligibility.reason
        ? MEETING_CREATION_BLOCK_MESSAGES[eligibility.reason]
        : undefined) ?? "지금은 방을 만들 수 없어요",
    );
  };

  useEffect(() => {
    if (previewRoomId === null || !board) return;
    const stillOpen = board.slots.some((s) => s.room?.id === previewRoomId);
    if (!stillOpen) setPreviewRoomId(null);
  }, [board, previewRoomId]);

  const partySizeFilter = (
    <PartySizeFilterCard value={partySize} onChange={setPartySize} />
  );

  const renderBottomCard = () => {
    if (expiredRoomId !== null) {
      return (
        <RoomExpiredSheet
          open
          onConfirm={() =>
            setRoomDismissal({ roomId: expiredRoomId, phase: "dismissed" })
          }
        />
      );
    }

    if (!activeRoom) return partySizeFilter;

    if (activeRoom.status === "MATCHED") {
      const contact = matchResult?.counterpartContact;
      if (!roomDetail || !contact) return partySizeFilter;
      if (new Date(roomDetail.room.expiresAt).getTime() <= Date.now()) {
        return partySizeFilter;
      }

      return (
        <RoomMatchedSheet
          open
          teamSide={activeRoom.teamSide}
          counterpartContact={contact}
          members={roomDetail.members.filter(
            (member) => member.teamSide !== activeRoom.teamSide,
          )}
          invitation={roomDetail.room.invitation}
        />
      );
    }

    if (activeRoom.status === "OPEN") {
      if (!openRoomExpiresAt) return partySizeFilter;
      return (
        <RoomWaitingSheet
          open
          expiresAt={openRoomExpiresAt}
          onCancel={() => {
            roomDeleteClick();
            setDeleteDialogOpen(true);
          }}
          onExpire={() =>
            setRoomDismissal({ roomId: activeRoom.roomId, phase: "expired" })
          }
        />
      );
    }

    return partySizeFilter;
  };

  const bottomCard = renderBottomCard();
  // 시트가 하단을 차지하는 동안 인원 필터가 남아 있으면 마커가 흐린 채 되돌릴 수 없으므로 초기화한다.
  const isShowingFilterCard = bottomCard === partySizeFilter;
  useEffect(() => {
    if (!isShowingFilterCard) setPartySize(null);
  }, [isShowingFilterCard]);

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
          {board &&
            MEETING_SLOTS.map((slot) => {
              const room = roomBySlot.get(slot);
              return (
                <SlotMarker
                  key={slot}
                  room={room}
                  position={SLOT_POSITIONS[slot]}
                  matchesFilter={
                    partySize === null || partySize === "ANY" || !room
                      ? null
                      : room.partySize === partySize
                  }
                  now={now}
                  onClick={() => handleSlotClick(slot, room)}
                />
              );
            })}
        </div>

        {/* 보드를 받기 전에 그리면 남은 횟수를 아는 척하게 된다. */}
        {board && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2">
            <MatchChanceChip
              count={isMatchChanceUsedUp ? 0 : MATCH_CHANCE_PER_DAY}
            />
          </div>
        )}

        <div className="absolute top-3 right-4 flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={() => {
              meetingManualClick();
              setManualOpen(true);
            }}
            className="flex w-[53px] flex-col items-center"
          >
            <img src={btnManual} alt="" className="mb-[-4px] size-[40px]" />
            <span className="caption2 text-static-white w-[44px] rounded-[31px] bg-blue-600 py-[2px] text-center">
              설명서
            </span>
          </button>
          <button
            type="button"
            onClick={handleReferralClick}
            className="flex w-[53px] flex-col items-center"
          >
            <img src={btnInvite} alt="" className="mb-[-4px] size-[40px]" />
            <span className="caption2 bg-primary text-static-white w-[44px] rounded-[31px] py-[2px] text-center">
              친구초대
            </span>
          </button>
        </div>
      </div>

      <div className="relative shrink-0 px-[4.27%] pb-[43.65px]">
        {/*
          자리만 잡는 사본이다. 시트 높이가 그대로 흐름에 들어가면 지도 영역(flex-1)이
          줄었다 늘었다 하며 지도가 딸려 움직인다. 인원 필터만큼만 자리를 잡아 두고
          그보다 큰 시트는 위로 넘쳐 지도를 덮게 한다. 필터를 고쳐도 높이가 따라오도록
          숫자를 적지 않고 같은 카드를 그린다.
        */}
        <div aria-hidden className="invisible">
          {partySizeFilter}
        </div>
        {/* 배너는 카드에 붙어 함께 올라가야 시트에 가려지지 않는다. */}
        <div className="absolute inset-x-[4.27%] bottom-[43.65px] flex flex-col gap-3">
          {board?.latestMatch && (
            <LatestMatchBanner match={board.latestMatch} />
          )}
          {bottomCard}
        </div>
      </div>

      <ManualDialog open={manualOpen} onOpenChange={setManualOpen} />

      <ProfileRequiredDialog
        open={profileDialogOpen}
        onOpenChange={setProfileDialogOpen}
      />

      <RoomPreviewSheet
        roomId={previewRoomId}
        onOpenChange={(open) => {
          if (!open) setPreviewRoomId(null);
        }}
        joinBlockedReason={joinBlockedReason}
        onJoin={(id) => {
          roomParticipateClick(!!profile);
          navigate(`/lobby/join/${id}`);
        }}
      />

      <RoomDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteRoom}
        confirmDisabled={isCancellingRoom}
      />
    </div>
  );
};

export default LobbyPage;
