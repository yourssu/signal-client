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
// Refund policy for the service.
export const REFUND_POLICY: string =
  import.meta.env.VITE_REFUND_POLICY ?? "환불 정책";
export const BUSINESS_INFO: string =
  import.meta.env.VITE_BUSINESS_INFO ?? "사업자 정보";
// List of personality traits for the service. This is used to suggest traits to users.
export const PERSONALITIES: string[] = JSON.parse(
  import.meta.env.VITE_PERSONALITIES ??
    `["답장 빨라요", "낯가림 심한데 친해지면 말 많음", "힙합 좋아해요"]`,
) as string[];

// Bank account information for the service.
export const ACCOUNT_BANK: string =
  import.meta.env.VITE_ACCOUNT_BANK ?? "카카오뱅크";
// Bank account code for the service.
export const ACCOUNT_BANK_CODE: string =
  import.meta.env.VITE_ACCOUNT_BANK_CODE ?? "090";
// Bank account number for the service.
export const ACCOUNT_NO: string =
  import.meta.env.VITE_ACCOUNT_NO ?? "034353566343";
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
export const NOTICE: string = import.meta.env.VITE_NOTICE ?? "";
export const GOOGLE_OAUTH_CLIENT_ID: string =
  import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID ??
  "423363455635-hvngr97c536f8ulcr4q514oqj5jiu1uv.apps.googleusercontent.com";
export const PROFILE_ANALYSIS_WRITINGS: Record<number, [string, string][]> =
  JSON.parse(
    import.meta.env.VITE_PROFILE_ANALYSIS_WRITINGS ??
      `{
  "1": [["축제를 뒤집어 버렸다", "압도적인 매력의 소유자"]],
  "5": [["시선이 쏠리는 중심", "모두가 주목할 수 밖에 없는"]],
  "10": [["보는 순간 빠져든다", "사람 마음을 흔드는 매력의 소유자"]],
  "30": [["호감 가득 매력 넘치는", "모두가 궁금해하는 당신"]],
  "70": [["숨은 보석 같은 매력", "아직 발견되지 않은 가능성의 소유자"]]
}`,
  );
