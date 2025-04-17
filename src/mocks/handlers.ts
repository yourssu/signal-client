import { TicketIssuedRequest } from "@/types/admin";
import { ErrorResponse, SuccessResponse } from "@/types/common";
import {
  AnimalType,
  Gender,
  NicknameCreatedResponse,
  NicknameGeneratedRequest,
  ProfileContactResponse,
  ProfileCreatedRequest,
  ProfileResponse,
  TicketConsumedRequest,
} from "@/types/profile";
import {
  VerificationResponse,
  ViewerDetailResponse,
  ViewerResponse,
} from "@/types/viewer";
import { http, HttpResponse } from "msw";

const getRandomAnimal = (): AnimalType => {
  const animals: AnimalType[] = [
    "DOG",
    "BEAR",
    "DINOSAUR",
    "WOLF",
    "DEER",
    "CAT",
  ];
  return animals[Math.floor(Math.random() * animals.length)];
};

const getRandomMBTI = (): string => {
  const E_I = ["E", "I"];
  const N_S = ["N", "S"];
  const T_F = ["T", "F"];
  const J_P = ["J", "P"];

  return (
    E_I[Math.floor(Math.random() * 2)] +
    N_S[Math.floor(Math.random() * 2)] +
    T_F[Math.floor(Math.random() * 2)] +
    J_P[Math.floor(Math.random() * 2)]
  );
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
  const animalKorean: Record<AnimalType, string> = {
    DOG: "강아지",
    CAT: "고양이",
    BEAR: "곰",
    DINOSAUR: "공룡",
    WOLF: "늑대",
    DEER: "사슴",
  };
  return `${adjective} ${animalKorean[animal]}`;
};

export const handlers = [
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
        { status: 403 }
      );
    }
    const randomAnimal = getRandomAnimal();
    return HttpResponse.json({
      timestamp: new Date().toISOString(),
      result: {
        profileId: Math.floor(Math.random() * 10000) + 1,
        gender: "MALE",
        animal: randomAnimal,
        mbti: getRandomMBTI(),
        nickname: getRandomNickname(randomAnimal),
        introSentences: [],
        contact: "010-1234-5678",
      },
    } satisfies SuccessResponse<ProfileContactResponse>);
  }),
  // Example handler
  http.get("/api/profiles/random", ({ request }) => {
    const url = new URL(request.url);
    const uuid = url.searchParams.get("uuid");
    const gender = url.searchParams.get("gender") as Gender;
    if (!uuid || !gender) {
      return HttpResponse.json(
        {
          timestamp: new Date().toISOString(),
          status: 403,
          message: "ID가 필요합니다.",
        } satisfies ErrorResponse,
        { status: 403 }
      );
    }

    const randomAnimal = getRandomAnimal();

    return HttpResponse.json({
      timestamp: new Date().toISOString(),
      result: {
        profileId: Math.floor(Math.random() * 10000) + 1,
        gender: gender === "MALE" ? "FEMALE" : "MALE",
        animal: randomAnimal,
        mbti: getRandomMBTI(),
        nickname: getRandomNickname(randomAnimal),
        introSentences: [],
      },
    } satisfies SuccessResponse<ProfileResponse>);
  }),
  http.post("/api/profiles", async ({ request }) => {
    const body = (await request.json()) as ProfileCreatedRequest;

    return HttpResponse.json({
      timestamp: new Date().toISOString(),
      result: {
        profileId: 1234,
        gender: body.gender,
        animal: body.animal,
        mbti: body.mbti,
        nickname: body.nickname,
        contact: body.contact,
        introSentences: body.introSentences,
      },
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
    const { profileId, uuid } = body;
    if (!profileId || !uuid) {
      return HttpResponse.json(
        {
          timestamp: new Date().toISOString(),
          status: 403,
          message: "ID가 필요합니다.",
        } satisfies ErrorResponse,
        { status: 403 }
      );
    }

    return HttpResponse.json({
      timestamp: new Date().toISOString(),
      result: {
        profileId,
        gender: "MALE",
        animal: "DOG",
        mbti: "ENTP",
        nickname: "총명한 강아지",
        contact: "010-1234-5678",
        introSentences: [],
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
        { status: 403 }
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
        { status: 403 }
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
        { status: 403 }
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
        { status: 403 }
      );
    }
    return HttpResponse.json({
      timestamp: new Date().toISOString(),
      result: {
        id: 1234,
        uuid,
        gender: "MALE",
        ticket: 1,
        usedTicket: 0,
        updatedDate: new Date().toISOString(),
        purchasedProfiles: [],
      },
    } satisfies SuccessResponse<ViewerDetailResponse>);
  }),
];
