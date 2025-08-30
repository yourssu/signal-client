import { Package } from "@/types/viewer";

// Commit hash for development
export const SHA: string | undefined = import.meta.env.VITE_SHA;
// SHA is undefined in local development
export const IS_LOCAL: boolean = !SHA;
// Deployment mode. Setting this to "production" will disable devtools.
export const MODE: string = import.meta.env.MODE;

// GA4 Analytics ID
export const GA_ID: string | undefined = import.meta.env.VITE_GA_ID;
// Clarity Analytics ID
export const CLARITY_ID: string | undefined = import.meta.env.VITE_CLARITY_ID;

// Base URL for the API. This is used to make API calls.
export const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL;
// Ticket cost for the service.
export const TICKET_COST: number =
  Number(import.meta.env.VITE_TICKET_COST) || 1;
// Terms and conditions for the service.
export const TERMS: string = import.meta.env.VITE_TERMS ?? "서비스 이용약관";
// Privacy policy for the service.
export const PRIVACY: string =
  import.meta.env.VITE_PRIVACY ?? "개인정보 처리방침";
// List of personality traits for the service. This is used to suggest traits to users.
export const PERSONALITIES: string[] = JSON.parse(
  import.meta.env.VITE_PERSONALITIES ??
    `["답장 빨라요", "낯가림 심한데 친해지면 말 많음", "힙합 좋아해요"]`,
) as string[];

// Bank account information for the service.
export const ACCOUNT: string =
  import.meta.env.VITE_ACCOUNT ?? "카카오뱅크 034353566343";
// Bank account owner information for the service.
export const ACCOUNT_OWNER: string =
  import.meta.env.VITE_ACCOUNT_OWNER ?? "유어슈";
export const ENABLE_SAVED: boolean =
  import.meta.env.VITE_ENABLE_SAVED === "true";
export const ENABLE_PROFILE_VIEW: boolean =
  import.meta.env.VITE_ENABLE_PROFILE_VIEW === "true";
export const ENABLE_REGISTER: boolean =
  import.meta.env.VITE_ENABLE_REGISTER === "true";
export const ENABLE_KAKAO_PAYMENTS: boolean =
  import.meta.env.VITE_ENABLE_KAKAO_PAYMENTS === "true";
export const DISABLED_PROFILE_VIEW_DESC: string =
  import.meta.env.VITE_DISABLED_PROFILE_VIEW_DESC ??
  "5/21(수) 10:00부터 시그널을 보낼 수 있어요.";
export const DISABLED_REGISTER_DESC: string =
  import.meta.env.VITE_DISABLED_REGISTER_DESC ??
  "5/19(월) 19:00부터 프로필을 등록할 수 있어요.";
export const TICKET_PACKAGES: Package[] = JSON.parse(
  import.meta.env.VITE_TICKET_PACKAGES ??
    `[
  {
    "id": "single",
    "name": "1개",
    "quantity": [1, 1],
    "price": [700, 1000]
  },
  {
    "id": "small",
    "name": "4개",
    "quantity": [4, 4],
    "price": [2100, 3000]
  },
  {
    "id": "best",
    "name": "8개",
    "quantity": [8, 8],
    "price": [3500, 5000]
  }
]`,
) as Package[];
export const NOTICE: string = import.meta.env.VITE_NOTICE ?? "";
