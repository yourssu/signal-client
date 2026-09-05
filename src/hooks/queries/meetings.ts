import {
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";
import {
  MeetingBoardResponse,
  MeetingMatchRequest,
  MeetingMatchResponse,
  MeetingResultResponse,
  MeetingRoomCreateRequest,
  MeetingRoomDetailResponse,
  MeetingRoomResponse,
} from "@/types/meeting";
import { SignalError } from "@/lib/error";
import { authedFetch } from "@/lib/fetch";
import { API_BASE_URL } from "@/env";

const meetingBase = `${API_BASE_URL ?? ""}/api/meetings`;

/** 미팅 보드 폴링 주기(ms). */
export const MEETING_BOARD_POLL_INTERVAL = 5000;

/** 생성 가능 여부, 슬롯별 열린 방과 최근 30초 이내 매칭 안내를 조회합니다. */
export const useMeetingBoard = (
  queryOptions?: Omit<
    UseQueryOptions<MeetingBoardResponse, SignalError>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: ["meetings", "board"],
    queryFn: async () => {
      return authedFetch<MeetingBoardResponse>(`${meetingBase}/board`);
    },
    // 방 만료(1시간)와 latestMatch 노출 구간(30초)을 반영하기 위해 짧은 주기로 갱신한다.
    refetchInterval: MEETING_BOARD_POLL_INTERVAL,
    ...queryOptions,
  });
};

/** 미팅 방의 상태와 양쪽 팀 구성원을 조회합니다. */
export const useMeetingRoom = (
  roomId: number,
  queryOptions?: Omit<
    UseQueryOptions<MeetingRoomDetailResponse, SignalError>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: ["meetings", "rooms", roomId],
    queryFn: async () => {
      return authedFetch<MeetingRoomDetailResponse>(
        `${meetingBase}/rooms/${roomId}`,
      );
    },
    ...queryOptions,
  });
};

/** 매칭 당사자가 상대 팀 대표 연락처를 조회합니다. */
export const useMeetingResult = (
  roomId: number,
  queryOptions?: Omit<
    UseQueryOptions<MeetingResultResponse, SignalError>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: ["meetings", "rooms", roomId, "result"],
    queryFn: async () => {
      return authedFetch<MeetingResultResponse>(
        `${meetingBase}/rooms/${roomId}/result`,
      );
    },
    ...queryOptions,
  });
};

/** 선택한 슬롯에 본인과 동행자로 구성된 2~4인 방을 생성합니다. 방은 1시간 동안 열립니다. */
export const useCreateMeetingRoom = (
  mutationOptions?: Omit<
    UseMutationOptions<
      MeetingRoomResponse,
      SignalError,
      MeetingRoomCreateRequest
    >,
    "mutationFn"
  >,
) => {
  return useMutation({
    mutationFn: async (request: MeetingRoomCreateRequest) => {
      return authedFetch<MeetingRoomResponse>(`${meetingBase}/rooms`, {
        method: "POST",
        body: JSON.stringify(request),
      });
    },
    ...mutationOptions,
  });
};

/** 신청자 팀 정보와 대표 연락처로 열린 방에 참여해 즉시 매칭합니다. */
export const useMatchMeetingRoom = (
  roomId: number,
  mutationOptions?: Omit<
    UseMutationOptions<MeetingMatchResponse, SignalError, MeetingMatchRequest>,
    "mutationFn"
  >,
) => {
  return useMutation({
    mutationFn: async (request: MeetingMatchRequest) => {
      return authedFetch<MeetingMatchResponse>(
        `${meetingBase}/rooms/${roomId}/matches`,
        {
          method: "POST",
          body: JSON.stringify(request),
        },
      );
    },
    ...mutationOptions,
  });
};

/** 방 생성자가 열린 미팅 방을 취소합니다. */
export const useCancelMeetingRoom = (
  mutationOptions?: Omit<
    UseMutationOptions<void, SignalError, number>,
    "mutationFn"
  >,
) => {
  return useMutation({
    mutationFn: async (roomId: number) => {
      await authedFetch(`${meetingBase}/rooms/${roomId}/cancel`, {
        method: "POST",
      });
    },
    ...mutationOptions,
  });
};
