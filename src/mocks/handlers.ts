import { animalDisplayMap } from "@/lib/animal";
import { MEETING_SLOTS } from "@/lib/meeting";
import { TicketIssuedRequest } from "@/types/admin";
import { TokenResponse } from "@/types/auth";
import { ErrorResponse, SuccessResponse } from "@/types/common";
import {
  MeetingBoardResponse,
  MeetingMatchResponse,
  MeetingMemberResponse,
  MeetingMyRoomResponse,
  MeetingRoomCreateRequest,
  MeetingRoomResponse,
  MeetingResultResponse,
  MeetingRoomDetailResponse,
  MeetingSlot,
  MeetingSlotResponse,
} from "@/types/meeting";
import {
  AnimalType,
  Gender,
  Mbti,
  NicknameCreatedResponse,
  NicknameGeneratedRequest,
  ProfileContactResponse,
  ProfileCountResponse,
  ProfileCreatedRequest,
  ProfileResponse,
  ProfileUpdateRequest,
  TicketConsumedRequest,
} from "@/types/profile";
import { UserInfoResponse } from "@/types/user";
import {
  TicketPackagesResponse,
  VerificationResponse,
  ViewerDetailResponse,
  ViewerResponse,
} from "@/types/viewer";
import { http, HttpResponse } from "msw";

let storedProfile: ProfileContactResponse | null = null;

const MOCK_UUID = "mock-uuid-1234-5678";
const MOCK_TOKEN: TokenResponse = {
  accessToken: "mock-access-token",
  refreshToken: "mock-refresh-token",
  tokenType: "Bearer",
  accessTokenExpiresIn: 1000 * 60 * 60,
  refreshTokenExpiresIn: 1000 * 60 * 60 * 24 * 7,
};

const maleAnimals: AnimalType[] = [
  "BEAR",
  "DEER",
  "DINOSAUR",
  "DOG",
  "CAT",
  "HAMSTER",
];
const femaleAnimals: AnimalType[] = [
  "FOX",
  "RABBIT",
  "TURTLE",
  "DOG",
  "CAT",
  "HAMSTER",
];

const getRandomAnimal = (gender?: Gender): AnimalType => {
  const animals = gender
    ? gender === "MALE"
      ? maleAnimals
      : femaleAnimals
    : [...maleAnimals, ...femaleAnimals];
  return animals[Math.floor(Math.random() * animals.length)];
};

const getRandomMBTI = (): Mbti => {
  const E_I = ["E", "I"];
  const N_S = ["N", "S"];
  const T_F = ["T", "F"];
  const J_P = ["J", "P"];

  return (E_I[Math.floor(Math.random() * 2)] +
    N_S[Math.floor(Math.random() * 2)] +
    T_F[Math.floor(Math.random() * 2)] +
    J_P[Math.floor(Math.random() * 2)]) as Mbti;
};

const getRandomNickname = (animal: AnimalType): string => {
  const adjectives = [
    "총명한",
    "귀여운",
    "용감한",
    "영리한",
    "신비로운",
    "활발한",
  ];
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  return `${adjective} ${animalDisplayMap[animal]}`;
};

const FILLED_MEETING_SLOTS: MeetingSlot[] = [
  "SLOT_1",
  "SLOT_2",
  "SLOT_3",
  "SLOT_5",
  "SLOT_7",
];

const MEETING_ROOM_MOCKS: {
  partySize: number;
  remainingMinutes: number;
  creatorAnimal: AnimalType;
}[] = [
  { partySize: 3, remainingMinutes: 10, creatorAnimal: "WOLF" },
  { partySize: 2, remainingMinutes: 25, creatorAnimal: "HAMSTER" },
  { partySize: 4, remainingMinutes: 45, creatorAnimal: "DEER" },
  { partySize: 2, remainingMinutes: 5, creatorAnimal: "FOX" },
  { partySize: 4, remainingMinutes: 60, creatorAnimal: "TURTLE" },
];

/**
 * 개발용 시나리오 전환. `/lobby?mock=waiting` 처럼 주소창에 붙여 쓴다.
 * board 요청 URL에는 쿼리가 실리지 않으므로 location에서 직접 읽는다.
 */
type MeetingMockScenario =
  | "waiting"
  | "expiring"
  | "matched"
  | "applicant"
  | "no-profile";

const MEETING_MOCK_SCENARIOS: MeetingMockScenario[] = [
  "waiting",
  "expiring",
  "matched",
  "applicant",
  "no-profile",
];

const getMeetingMockScenario = (): MeetingMockScenario | null => {
  const value = new URLSearchParams(window.location.search).get("mock");
  return MEETING_MOCK_SCENARIOS.find((s) => s === value) ?? null;
};

/** 시나리오가 켜졌을 때 내 방으로 쓰는 슬롯과 방 id. */
const MY_ROOM_SLOT: MeetingSlot = "SLOT_1";
const MY_ROOM_ID = 1;

/** cancel 핸들러가 취소한 방 id. buildMyRoom과 슬롯 생성이 함께 참조해 삭제한 방을 되살리지 않는다. */
const cancelledRoomIds = new Set<number>();

/**
 * 목 기준 시각. 모듈 평가 시점에 잡으면 SPA 내비게이션으로 한참 뒤에 시나리오에
 * 들어올 때 이미 만료된 상태로 시작한다. 첫 요청 시점에 한 번만 잡고,
 * 폴링마다 다시 잡지 않는다(그러면 만료 시각이 계속 밀려 방이 끝나지 않는다).
 */
let mockBaseTime: number | null = null;
const getMockBaseTime = (): number => {
  if (mockBaseTime === null) {
    mockBaseTime = Date.now();
  }
  return mockBaseTime;
};

/** POST /rooms로 만든 방. 시나리오 파라미터 없이도 생성 → 대기 시트 흐름을 볼 수 있다. */
let createdRoom: {
  id: number;
  slot: MeetingSlot;
  partySize: number;
  invitation: string;
  expiresAt: string;
} | null = null;

/** POST /matches로 참여한 방. */
let joinedRoomId: number | null = null;

const CREATED_ROOM_ID = 100;

const buildMyRoom = (
  scenario: MeetingMockScenario | null,
): MeetingMyRoomResponse | null => {
  if (scenario === "no-profile") return null;
  if (joinedRoomId !== null) {
    return { roomId: joinedRoomId, status: "MATCHED", teamSide: "APPLICANT" };
  }
  if (createdRoom && !cancelledRoomIds.has(createdRoom.id)) {
    return { roomId: createdRoom.id, status: "OPEN", teamSide: "CREATOR" };
  }
  if (!scenario) return null;
  if (cancelledRoomIds.has(MY_ROOM_ID)) return null;
  const isMatched = scenario === "matched" || scenario === "applicant";
  return {
    roomId: MY_ROOM_ID,
    status: isMatched ? "MATCHED" : "OPEN",
    teamSide: scenario === "applicant" ? "APPLICANT" : "CREATOR",
  };
};

const MEETING_MEMBER_MOCKS: Omit<
  MeetingMemberResponse,
  "teamSide" | "memberOrder"
>[] = [
  { department: "컴퓨터학부", birthYear: 2002, gender: "MALE" },
  { department: "산업정보시스템공학과", birthYear: 2001, gender: "MALE" },
  { department: "글로벌미디어학부", birthYear: 2003, gender: "MALE" },
];

const buildMeetingMembers = (partySize: number): MeetingMemberResponse[] => {
  const build = (
    teamSide: MeetingMemberResponse["teamSide"],
    gender: MeetingMemberResponse["gender"],
  ) =>
    Array.from({ length: partySize }, (_, index) => {
      const base = MEETING_MEMBER_MOCKS[index % MEETING_MEMBER_MOCKS.length];
      return { ...base, gender, teamSide, memberOrder: index + 1 };
    });

  return [...build("CREATOR", "MALE"), ...build("APPLICANT", "FEMALE")];
};

const createMeetingRoomDetail = (
  roomId: number,
): MeetingRoomDetailResponse | null => {
  const scenario = getMeetingMockScenario();
  const isMatched =
    joinedRoomId === roomId ||
    (roomId === MY_ROOM_ID &&
      (scenario === "matched" || scenario === "applicant"));

  if (createdRoom?.id === roomId) {
    return {
      room: {
        id: roomId,
        slot: createdRoom.slot,
        creatorAnimal: "DOG",
        creatorNickname: "숭실대 방장",
        partySize: createdRoom.partySize,
        invitation: createdRoom.invitation,
        status: "OPEN",
        expiresAt: createdRoom.expiresAt,
      },
      members: buildMeetingMembers(createdRoom.partySize),
    };
  }

  // 보드에 그려지는 방 id는 채워진 슬롯 순서대로 1부터 매겨진다.
  const index = roomId - 1;
  const mock = MEETING_ROOM_MOCKS[index];
  if (!mock || cancelledRoomIds.has(roomId)) return null;

  return {
    room: {
      id: roomId,
      slot: FILLED_MEETING_SLOTS[index],
      creatorAnimal: mock.creatorAnimal,
      creatorNickname: "숭실대 방장",
      partySize: mock.partySize,
      invitation: `숭실대 테스트학과 ${mock.partySize}명이 모임을 기다리고 있어요!`,
      status: isMatched ? "MATCHED" : "OPEN",
      expiresAt: new Date(
        getMockBaseTime() + mock.remainingMinutes * 60 * 1000,
      ).toISOString(),
    },
    members: buildMeetingMembers(mock.partySize),
  };
};

const createMeetingBoardResponse = (): MeetingBoardResponse => {
  const now = getMockBaseTime();
  const scenario = getMeetingMockScenario();
  let filledIndex = 0;

  const slots: MeetingSlotResponse[] = MEETING_SLOTS.map((slot) => {
    if (createdRoom?.slot === slot && !cancelledRoomIds.has(createdRoom.id)) {
      return {
        slot,
        room: {
          id: createdRoom.id,
          partySize: createdRoom.partySize,
          invitation: createdRoom.invitation,
          expiresAt: createdRoom.expiresAt,
          creatorAnimal: "DOG",
        },
      };
    }
    if (!FILLED_MEETING_SLOTS.includes(slot)) {
      return { slot };
    }

    const roomIndex = filledIndex++;
    const roomId = roomIndex + 1;
    if (cancelledRoomIds.has(roomId)) {
      return { slot };
    }

    const { partySize, remainingMinutes, creatorAnimal } =
      MEETING_ROOM_MOCKS[roomIndex];
    // 임박 시나리오는 내 방만 40초 뒤에 끝나게 둔다.
    const remainingMs =
      scenario === "expiring" && slot === MY_ROOM_SLOT
        ? 40 * 1000
        : remainingMinutes * 60 * 1000;
    // 끝난 방은 열린 방이 아니다. 슬롯을 비워 다시 만들 수 있게 한다.
    if (now + remainingMs <= Date.now()) {
      return { slot };
    }

    return {
      slot,
      room: {
        id: roomId,
        partySize,
        invitation: `숭실대 테스트학과 ${partySize}명이 모임을 기다리고 있어요!`,
        expiresAt: new Date(now + remainingMs).toISOString(),
        creatorAnimal,
      },
    };
  });

  return {
    creationEligibility:
      scenario === "no-profile"
        ? { canCreate: false, reason: "PROFILE_REQUIRED" }
        : { canCreate: true },
    slots,
    myRoom: buildMyRoom(scenario),
    latestMatch: {
      roomId: 1,
      creatorNickname: "숭실대 방장",
      creatorAnimal: "DOG",
      matchedAt: new Date(now).toISOString(),
      visibleUntil: new Date(now + 30 * 1000).toISOString(),
    },
  };
};

export const handlers = [
  /** Auth */
  http.post("/api/auth/register", () => {
    return HttpResponse.json({
      timestamp: new Date().toISOString(),
      result: MOCK_TOKEN,
    } satisfies SuccessResponse<TokenResponse>);
  }),
  http.post("/api/auth/refresh", () => {
    return HttpResponse.json({
      timestamp: new Date().toISOString(),
      result: MOCK_TOKEN,
    } satisfies SuccessResponse<TokenResponse>);
  }),

  /** Users */
  http.get("/api/users/me", () => {
    return HttpResponse.json({
      timestamp: new Date().toISOString(),
      result: { uuid: MOCK_UUID },
    } satisfies SuccessResponse<UserInfoResponse>);
  }),

  /** Viewers (me) */
  http.get("/api/viewers/me", () => {
    return HttpResponse.json({
      timestamp: new Date().toISOString(),
      result: {
        id: 1,
        uuid: MOCK_UUID,
        ticket: 0,
        usedTicket: 0,
        updatedTime: new Date().toISOString(),
        purchasedProfiles: [],
      },
    } satisfies SuccessResponse<ViewerDetailResponse>);
  }),
  http.get("/api/viewers/ticket-packages", () => {
    return HttpResponse.json({
      timestamp: new Date().toISOString(),
      result: {
        packages: [
          {
            id: "pkg-1",
            name: "시작 패키지",
            quantity: [3, 3],
            price: [3000, 3000],
          },
          {
            id: "pkg-2",
            name: "인기 패키지",
            quantity: [5, 5],
            price: [4500, 5000],
          },
          {
            id: "pkg-3",
            name: "프리미엄 패키지",
            quantity: [10, 10],
            price: [8000, 10000],
          },
        ],
      },
    } satisfies SuccessResponse<TicketPackagesResponse>);
  }),

  /** Profiles (me) */
  http.get("/api/profiles/me", () => {
    if (!storedProfile) {
      return HttpResponse.json(
        {
          timestamp: new Date().toISOString(),
          status: 404,
          message: "프로필이 존재하지 않습니다.",
        } satisfies ErrorResponse,
        { status: 404 },
      );
    }
    return HttpResponse.json({
      timestamp: new Date().toISOString(),
      result: storedProfile,
    } satisfies SuccessResponse<ProfileContactResponse>);
  }),
  http.get("/api/profiles/me/purchased", () => {
    const purchasedProfiles: ProfileContactResponse[] = [
      {
        profileId: 101,
        gender: "FEMALE",
        department: "경영학과",
        birthYear: 2003,
        animal: "RABBIT",
        mbti: "ENFP",
        nickname: "토끼같은미소",
        introSentences: [
          "커피 한 잔과 함께 대화 나누기 좋아해요",
          "봄날 산책을 좋아해요",
          "재미있는 이야기 잘 해요",
        ],
        school: "숭실대학교",
        egenTeto: "TETO",
        contact: "https://instagram.com/example1",
      },
      {
        profileId: 102,
        gender: "FEMALE",
        department: "미디어커뮤니케이션학과",
        birthYear: 2002,
        animal: "CAT",
        mbti: "INFJ",
        nickname: "고양이눈빛",
        introSentences: [
          "조용한 카페를 좋아해요",
          "독서와 영화 감상이 취미예요",
          "깊은 대화를 나눠요",
        ],
        school: "숭실대학교",
        egenTeto: "EGEN",
        contact: "https://instagram.com/example2",
      },
    ];
    return HttpResponse.json({
      timestamp: new Date().toISOString(),
      result: purchasedProfiles,
    } satisfies SuccessResponse<ProfileContactResponse[]>);
  }),

  http.get("/api/profiles/count", () => {
    return HttpResponse.json({
      timestamp: new Date().toISOString(),
      result: {
        count: 1234,
      },
    } satisfies SuccessResponse<ProfileCountResponse>);
  }),
  http.get("/api/profiles/purchased/count", () => {
    return HttpResponse.json({
      timestamp: new Date().toISOString(),
      result: {
        count: 42,
      },
    } satisfies SuccessResponse<ProfileCountResponse>);
  }),
  http.get("/api/profiles/uuid", ({ request }) => {
    const url = new URL(request.url);
    const uuid = url.searchParams.get("uuid");
    if (!uuid) {
      return HttpResponse.json(
        {
          timestamp: new Date().toISOString(),
          status: 403,
          message: "ID가 필요합니다.",
        } satisfies ErrorResponse,
        { status: 403 },
      );
    }
    const randomAnimal = getRandomAnimal();
    return HttpResponse.json({
      timestamp: new Date().toISOString(),
      result: {
        profileId: Math.floor(Math.random() * 10000) + 1,
        gender: "MALE",
        department: "테스트학과",
        birthYear: 2002,
        animal: randomAnimal,
        mbti: getRandomMBTI(),
        nickname: getRandomNickname(randomAnimal),
        introSentences: [
          "항상 밝고 긍정적인 에너지!",
          "카페 나들이를 좋아해요",
          "재미있는 대화 나눠요",
        ],
        contact: "010-1234-5678",
        school: "숭실대",
        egenTeto: "TETO",
      },
    } satisfies SuccessResponse<ProfileContactResponse>);
  }),
  http.get("/api/profiles/random", ({ request }) => {
    const url = new URL(request.url);
    const gender = url.searchParams.get("gender") as Gender;
    if (!gender) {
      return HttpResponse.json(
        {
          timestamp: new Date().toISOString(),
          status: 403,
          message: "gender가 필요합니다.",
        } satisfies ErrorResponse,
        { status: 403 },
      );
    }

    const profileGender = gender === "MALE" ? "FEMALE" : "MALE";
    const randomAnimal = getRandomAnimal(profileGender);

    return HttpResponse.json({
      timestamp: new Date().toISOString(),
      result: {
        profileId: Math.floor(Math.random() * 10000) + 1,
        gender: profileGender,
        department: "테스트학과",
        birthYear: 2002,
        animal: randomAnimal,
        mbti: getRandomMBTI(),
        nickname: getRandomNickname(randomAnimal),
        introSentences: [
          "운동 좋아하는 프로운동러",
          "맛집 탐방이 취미예요",
          "성실하고 책임감 강함",
        ],
        school: "숭실대",
        egenTeto: "EGEN",
      },
    } satisfies SuccessResponse<ProfileResponse>);
  }),
  http.post("/api/profiles", async ({ request }) => {
    const body = (await request.json()) as ProfileCreatedRequest;

    storedProfile = {
      profileId: 1234,
      gender: body.gender,
      department: "테스트학과",
      birthYear: 2002,
      animal: body.animal,
      mbti: body.mbti,
      nickname: body.nickname,
      contact: body.contact,
      introSentences: body.introSentences,
      school: "숭실대",
      egenTeto: body.egenTeto,
    };

    return HttpResponse.json({
      timestamp: new Date().toISOString(),
      result: storedProfile,
    } satisfies SuccessResponse<ProfileContactResponse>);
  }),
  http.patch("/api/profiles/me", async ({ request }) => {
    if (!storedProfile) {
      return HttpResponse.json(
        {
          timestamp: new Date().toISOString(),
          status: 404,
          message: "프로필이 존재하지 않습니다.",
        } satisfies ErrorResponse,
        { status: 404 },
      );
    }
    const body = (await request.json()) as ProfileUpdateRequest;
    storedProfile = { ...storedProfile, ...body } as ProfileContactResponse;

    return HttpResponse.json({
      timestamp: new Date().toISOString(),
      result: storedProfile,
    } satisfies SuccessResponse<ProfileContactResponse>);
  }),
  http.post("/api/profiles/nickname", async ({ request }) => {
    const body = (await request.json()) as NicknameGeneratedRequest;

    return HttpResponse.json({
      timestamp: new Date().toISOString(),
      result: {
        nickname: `example nickname: ${body.introSentences[0]}`,
      },
    } satisfies SuccessResponse<NicknameCreatedResponse>);
  }),
  http.post("/api/profiles/contact", async ({ request }) => {
    const body = (await request.json()) as TicketConsumedRequest;
    const { profileId } = body;
    if (!profileId) {
      return HttpResponse.json(
        {
          timestamp: new Date().toISOString(),
          status: 403,
          message: "ID가 필요합니다.",
        } satisfies ErrorResponse,
        { status: 403 },
      );
    }

    return HttpResponse.json({
      timestamp: new Date().toISOString(),
      result: {
        profileId,
        gender: "MALE",
        department: "테스트학과",
        birthYear: 2002,
        animal: "DOG",
        mbti: "ENTP",
        nickname: "총명한 강아지",
        contact: "010-1234-5678",
        introSentences: [
          "강아지처럼 충성스러운 성격!",
          "산책 좋아해요",
          "웃음이 많은 편이에요",
        ],
        school: "숭실대",
        egenTeto: "TETO",
      },
    } satisfies SuccessResponse<ProfileContactResponse>);
  }),
  /** Viewers */
  http.get("/api/viewers/verification", ({ request }) => {
    const url = new URL(request.url);
    const uuid = url.searchParams.get("uuid");
    const gender = url.searchParams.get("gender");
    if (!uuid || !gender) {
      return HttpResponse.json(
        {
          timestamp: new Date().toISOString(),
          status: 403,
          message: "ID가 필요합니다.",
        },
        { status: 403 },
      );
    }
    return HttpResponse.json({
      timestamp: new Date().toISOString(),
      result: {
        verificationCode: 7,
      },
    } satisfies SuccessResponse<VerificationResponse>);
  }),
  http.post("/api/viewers", async ({ request }) => {
    const body = (await request.json()) as TicketIssuedRequest;
    const { secretKey, verificationCode, ticket } = body;
    if (!secretKey || !verificationCode || !ticket) {
      return HttpResponse.json(
        {
          timestamp: new Date().toISOString(),
          status: 403,
          message: "시크릿이 필요합니다.",
        } satisfies ErrorResponse,
        { status: 403 },
      );
    }

    return HttpResponse.json({
      timestamp: new Date().toISOString(),
      result: {
        verificationCode: 1234,
      },
    });
  }),
  http.get("/api/viewers", ({ request }) => {
    const url = new URL(request.url);
    const secretKey = url.searchParams.get("secretKey");
    if (!secretKey) {
      return HttpResponse.json(
        {
          timestamp: new Date().toISOString(),
          status: 403,
          message: "시크릿이 필요합니다.",
        } satisfies ErrorResponse,
        { status: 403 },
      );
    }
    return HttpResponse.json({
      timestamp: new Date().toISOString(),
      result: [],
    } satisfies SuccessResponse<ViewerResponse[]>);
  }),
  http.get("/api/viewers/uuid", ({ request }) => {
    const url = new URL(request.url);
    const uuid = url.searchParams.get("uuid");
    if (!uuid) {
      return HttpResponse.json(
        {
          timestamp: new Date().toISOString(),
          status: 403,
          message: "ID가 필요합니다.",
        } satisfies ErrorResponse,
        { status: 403 },
      );
    }
    return HttpResponse.json({
      timestamp: new Date().toISOString(),
      result: {
        id: 1234,
        uuid,
        ticket: 1,
        usedTicket: 0,
        updatedTime: new Date().toISOString(),
        purchasedProfiles: [],
      },
    } satisfies SuccessResponse<ViewerDetailResponse>);
  }),

  /** Meetings */
  http.get("/api/meetings/board", () => {
    return HttpResponse.json({
      timestamp: new Date().toISOString(),
      result: createMeetingBoardResponse(),
    } satisfies SuccessResponse<MeetingBoardResponse>);
  }),

  http.get("/api/meetings/rooms/:roomId", ({ params }) => {
    const roomId = Number(params.roomId);
    const detail = createMeetingRoomDetail(roomId);
    if (!detail) {
      return HttpResponse.json(
        {
          timestamp: new Date().toISOString(),
          status: 404,
          message: "방을 찾을 수 없습니다.",
          code: "MEETING_ROOM_NOT_FOUND",
        } satisfies ErrorResponse,
        { status: 404 },
      );
    }
    return HttpResponse.json({
      timestamp: new Date().toISOString(),
      result: detail,
    } satisfies SuccessResponse<MeetingRoomDetailResponse>);
  }),

  http.get("/api/meetings/rooms/:roomId/result", ({ params }) => {
    const roomId = Number(params.roomId);
    // 시나리오로 잡은 내 방, 직접 만든 방, 참여한 방이 모두 당사자다.
    const isParticipant =
      roomId === MY_ROOM_ID ||
      roomId === createdRoom?.id ||
      roomId === joinedRoomId;
    if (!isParticipant) {
      return HttpResponse.json(
        {
          timestamp: new Date().toISOString(),
          status: 403,
          message: "매칭 당사자가 아닙니다.",
          code: "MEETING_RESULT_FORBIDDEN",
        } satisfies ErrorResponse,
        { status: 403 },
      );
    }
    return HttpResponse.json({
      timestamp: new Date().toISOString(),
      result: {
        roomId,
        counterpartContact: "@signal_official",
      },
    } satisfies SuccessResponse<MeetingResultResponse>);
  }),

  http.post("/api/meetings/rooms", async ({ request }) => {
    const body = (await request.json()) as MeetingRoomCreateRequest;
    const occupied = MEETING_SLOTS.some(
      (slot) =>
        slot === body.slot &&
        (FILLED_MEETING_SLOTS.includes(slot) || createdRoom?.slot === slot),
    );
    if (occupied) {
      return HttpResponse.json(
        {
          timestamp: new Date().toISOString(),
          status: 409,
          message: "이미 사용 중인 자리입니다.",
          code: "SLOT_ALREADY_OCCUPIED",
        } satisfies ErrorResponse,
        { status: 409 },
      );
    }

    const partySize = body.companions.length + 1;
    createdRoom = {
      id: CREATED_ROOM_ID,
      slot: body.slot,
      partySize,
      invitation: body.invitation,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    };

    return HttpResponse.json(
      {
        timestamp: new Date().toISOString(),
        result: {
          id: createdRoom.id,
          slot: createdRoom.slot,
          creatorAnimal: "DOG",
          creatorNickname: "숭실대 방장",
          partySize,
          invitation: createdRoom.invitation,
          status: "OPEN",
          expiresAt: createdRoom.expiresAt,
        },
      } satisfies SuccessResponse<MeetingRoomResponse>,
      { status: 201 },
    );
  }),

  http.post(
    "/api/meetings/rooms/:roomId/matches",
    async ({ params, request }) => {
      const roomId = Number(params.roomId);
      await request.json();

      if (createdRoom?.id === roomId) {
        return HttpResponse.json(
          {
            timestamp: new Date().toISOString(),
            status: 409,
            message: "본인이 만든 방에는 신청할 수 없습니다.",
            code: "SELF_MATCH_NOT_ALLOWED",
          } satisfies ErrorResponse,
          { status: 409 },
        );
      }

      joinedRoomId = roomId;
      return HttpResponse.json(
        {
          timestamp: new Date().toISOString(),
          result: {
            roomId,
            status: "MATCHED",
            counterpartContact: "01044443333",
          },
        } satisfies SuccessResponse<MeetingMatchResponse>,
        { status: 201 },
      );
    },
  ),

  http.post("/api/meetings/rooms/:roomId/cancel", ({ params }) => {
    const roomId = Number(params.roomId);
    cancelledRoomIds.add(roomId);
    return new HttpResponse(null, { status: 204 });
  }),
];
