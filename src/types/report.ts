export interface ReportCreatedRequest {
  /** 신고할 프로필 ID. 연락처를 열람한 프로필만 신고할 수 있다. */
  profileId: number;
}

export interface ReportResponse {
  reportId: number;
  reportedProfileId: number;
  status: "PENDING" | "APPROVED";
}
