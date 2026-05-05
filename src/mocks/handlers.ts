import { animalDisplayMap } from "@/lib/animal";
import { TicketIssuedRequest } from "@/types/admin";
import { TokenResponse } from "@/types/auth";
import { ErrorResponse, SuccessResponse } from "@/types/common";
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

const maleAnimals: AnimalType[] = ["BEAR", "DEER", "DINOSAUR", "DOG", "CAT", "HAMSTER"];
const femaleAnimals: AnimalType[] = ["FOX", "RABBIT", "TURTLE", "DOG", "CAT", "HAMSTER"];

const getRandomAnimal = (gender?: Gender): AnimalType => {
  const animals = gender
    ? gender === "MALE" ? maleAnimals : femaleAnimals
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
        ticket: 3,
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
          { id: "pkg-1", name: "시작 패키지", quantity: [3, 3], price: [3000, 3000] },
          { id: "pkg-2", name: "인기 패키지", quantity: [5, 5], price: [4500, 5000] },
          { id: "pkg-3", name: "프리미엄 패키지", quantity: [10, 10], price: [8000, 10000] },
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
    return HttpResponse.json({
      timestamp: new Date().toISOString(),
      result: [],
    } satisfies SuccessResponse<[]>);
  }),

  http.get("/api/profiles/count", () => {
    return HttpResponse.json({
      timestamp: new Date().toISOString(),
      result: {
        count: 1234,
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
        introSentences: ["항상 밝고 긍정적인 에너지!", "카페 나들이를 좋아해요", "재미있는 대화 나눠요"],
        contact: "010-1234-5678",
        school: "숭실대",
        style: "TETO",
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
        introSentences: ["운동 좋아하는 프로운동러", "맛집 탐방이 취미예요", "성실하고 책임감 강함"],
        school: "숭실대",
        style: "EGEN",
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
      style: body.style,
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
        introSentences: ["강아지처럼 충성스러운 성격!", "산책 좋아해요", "웃음이 많은 편이에요"],
        school: "숭실대",
        style: "TETO",
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
];
