import { ErrorResponse, SuccessResponse } from "@/types/common";
import {
  NicknameCreatedResponse,
  NicknameGeneratedRequest,
  ProfileContactResponse,
  ProfileCreatedRequest,
  ProfileResponse,
  TicketConsumedRequest,
} from "@/types/profile";
import { TicketCreatedRequest, ViewerResponse } from "@/types/viewer";
import { http, HttpResponse } from "msw";

export const handlers = [
  // Example handler
  http.get("/api/profile", ({ request }) => {
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
        profileId: 1234,
        gender: "MALE",
        animal: "DOG",
        mbti: "ENTP",
        nickname: "총명한 강아지",
      },
    } satisfies SuccessResponse<ProfileResponse>);
  }),
  http.post("/api/profile", async ({ request }) => {
    const body = (await request.json()) as ProfileCreatedRequest;

    return HttpResponse.json({
      timestamp: new Date().toISOString(),
      result: {
        gender: body.gender,
        animal: body.animal,
        mbti: body.mbti,
        nickname: body.nickname,
        contact: body.contact,
      },
    } satisfies SuccessResponse<ProfileContactResponse>);
  }),
  http.post("/api/profile/nickname", async ({ request }) => {
    const body = (await request.json()) as NicknameGeneratedRequest;

    return HttpResponse.json({
      timestamp: new Date().toISOString(),
      result: {
        nickname: `example nickname: ${body.description[0]}`,
      },
    } satisfies SuccessResponse<NicknameCreatedResponse>);
  }),
  http.post("/api/profile/contact", async ({ request }) => {
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
      },
    } satisfies SuccessResponse<ProfileContactResponse>);
  }),
  http.get("/api/viewers/verification", ({ request }) => {
    const url = new URL(request.url);
    const uuid = url.searchParams.get("uuid");
    if (!uuid) {
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
        verificationCode: "1234",
      },
    });
  }),
  http.post("/api/viewers", async ({ request }) => {
    const body = (await request.json()) as TicketCreatedRequest;
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
        verificationCode: "1234",
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
  http.get("/api/viewers/me", ({ request }) => {
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
        ticket: 1,
        usedTicket: 0,
        updatedDate: new Date().toISOString(),
      },
    } satisfies SuccessResponse<ViewerResponse>);
  }),
];
