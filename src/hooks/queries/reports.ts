import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { API_BASE_URL } from "@/env";
import { SignalError } from "@/lib/error";
import { authedFetch } from "@/lib/fetch";
import { ReportCreatedRequest, ReportResponse } from "@/types/report";

const reportsBase = `${API_BASE_URL ?? ""}/api/reports`;

export const useCreateReport = (
  mutationOptions?: Omit<
    UseMutationOptions<ReportResponse, SignalError, ReportCreatedRequest>,
    "mutationFn"
  >,
) => {
  return useMutation({
    mutationFn: async (body: ReportCreatedRequest) => {
      return await authedFetch<ReportResponse>(reportsBase, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
    },
    ...mutationOptions,
  });
};

/** 신고 실패는 코드 없이 상태로만 온다. 스펙의 400·401·403·404·409 모두 code가 없다. */
export const getReportErrorMessage = (error: SignalError): string => {
  if (error.status === 409) return "이미 제보한 프로필이에요";
  if (error.status === 403) return "연락처를 열람한 프로필만 제보할 수 있어요";
  return "제보하지 못했어요. 잠시 후 다시 시도해주세요";
};
