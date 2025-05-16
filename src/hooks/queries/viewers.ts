import {
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";
import {
  NotificationDepositRequest,
  VerificationResponse,
  ViewerResponse,
} from "@/types/viewer";
import { SignalResponse } from "@/types/common";
import { TicketIssuedRequest } from "@/types/admin";
import { SignalError } from "@/lib/error";
import { API_BASE_URL } from "@/env";

const viewersBase = `${API_BASE_URL ?? ""}/api/viewers`;

export const useViewerVerification = (
  uuid: string,
  queryOptions?: Omit<
    UseQueryOptions<VerificationResponse, SignalError>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: ["viewer", "verification", uuid],
    queryFn: async () => {
      const response = await fetch(`${viewersBase}/verification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uuid,
        }),
      });
      const res =
        (await response.json()) as SignalResponse<VerificationResponse>;
      if (!("result" in res)) {
        throw new SignalError(res.message, res.status, res.timestamp);
      } else {
        return res.result;
      }
    },
    enabled: !!uuid,
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
    UseMutationOptions<string, SignalError, NotificationDepositRequest>,
    "mutationFn"
  >,
) => {
  return useMutation({
    mutationFn: async (data: NotificationDepositRequest) => {
      const response = await fetch(`${viewersBase}/deposit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const res = (await response.json()) as SignalResponse<string>;
      if (!("result" in res)) {
        throw new SignalError(res.message, res.status, res.timestamp);
      } else {
        return res.result;
      }
    },
    ...mutationOptions,
  });
};

export const useViewerSelf = (
  uuid: string,
  queryOptions?: Omit<
    UseQueryOptions<ViewerResponse, SignalError>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: ["viewer", "uuid", uuid],
    queryFn: async () => {
      const response = await fetch(`${viewersBase}/uuid?uuid=${uuid}`);
      const res = (await response.json()) as SignalResponse<ViewerResponse>;
      if (!("result" in res)) {
        throw new SignalError(res.message, res.status, res.timestamp);
      } else {
        return res.result;
      }
    },
    enabled: !!uuid,
    ...queryOptions,
  });
};
