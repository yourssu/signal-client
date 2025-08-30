import {
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";
import {
  NotificationDepositRequest,
  PaymentApprovalRequest,
  PaymentCompletionResponse,
  PaymentInitiationRequest,
  PaymentInitiationResponse,
  VerificationResponse,
  ViewerResponse,
  ViewerDetailResponse,
} from "@/types/viewer";
import { SignalResponse } from "@/types/common";
import { TicketIssuedRequest } from "@/types/admin";
import { SignalError } from "@/lib/error";
import { authedFetch } from "@/lib/fetch";
import { API_BASE_URL } from "@/env";

const viewersBase = `${API_BASE_URL ?? ""}/api/viewers`;

export const useViewerVerification = (
  queryOptions?: Omit<
    UseQueryOptions<VerificationResponse, SignalError>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: ["viewer", "verification"],
    queryFn: async () => {
      return authedFetch<VerificationResponse>(`${viewersBase}/verification`, {
        method: "POST",
      });
    },
    ...queryOptions,
  });
};

export const useIssueTicket = (
  mutationOptions?: Omit<
    UseMutationOptions<ViewerResponse, SignalError, TicketIssuedRequest>,
    "mutationFn"
  >,
) => {
  return useMutation({
    mutationFn: async (data: TicketIssuedRequest) => {
      const response = await fetch(viewersBase, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const res = (await response.json()) as SignalResponse<ViewerResponse>;
      if (!("result" in res)) {
        throw new SignalError(res.message, res.status, res.timestamp);
      } else {
        return res.result;
      }
    },
    ...mutationOptions,
  });
};

export const useNotificationDeposit = (
  mutationOptions?: Omit<
    UseMutationOptions<ViewerResponse, SignalError, NotificationDepositRequest>,
    "mutationFn"
  >,
) => {
  return useMutation({
    mutationFn: async (data: NotificationDepositRequest) => {
      return authedFetch<ViewerResponse>(`${viewersBase}/deposit`, {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    ...mutationOptions,
  });
};

export const useViewerSelf = (
  queryOptions?: Omit<
    UseQueryOptions<ViewerDetailResponse, SignalError>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: ["viewer", "me"],
    queryFn: async () => {
      return authedFetch<ViewerDetailResponse>(`${viewersBase}/me`);
    },
    ...queryOptions,
  });
};

export const useKakaoPaymentInitiate = (
  mutationOptions?: Omit<
    UseMutationOptions<
      PaymentInitiationResponse,
      SignalError,
      PaymentInitiationRequest
    >,
    "mutationFn"
  >,
) => {
  return useMutation({
    mutationFn: async (data: PaymentInitiationRequest) => {
      return authedFetch<PaymentInitiationResponse>(
        `${viewersBase}/payment/kakaopay/initiate`,
        {
          method: "POST",
          body: JSON.stringify(data),
        },
      );
    },
    ...mutationOptions,
  });
};

export const useKakaoPaymentApprove = (
  mutationOptions?: Omit<
    UseMutationOptions<
      PaymentCompletionResponse,
      SignalError,
      PaymentApprovalRequest
    >,
    "mutationFn"
  >,
) => {
  return useMutation({
    mutationFn: async (data: PaymentApprovalRequest) => {
      return authedFetch<PaymentCompletionResponse>(
        `${viewersBase}/payment/kakaopay/approve`,
        {
          method: "POST",
          body: JSON.stringify(data),
        },
      );
    },
    ...mutationOptions,
  });
};
