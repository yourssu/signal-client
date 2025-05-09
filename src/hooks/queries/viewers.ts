import { useMutation, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { VerificationResponse, ViewerResponse } from "@/types/viewer";
import { SignalResponse } from "@/types/common";
import { TicketIssuedRequest } from "@/types/admin";
import { Gender } from "@/types/profile";
import { SignalError } from "@/lib/error";

const viewersBase = `${import.meta.env.VITE_API_BASE_URL ?? ""}/api/viewers`;

export const useViewerVerification = (uuid: string, gender: Gender | null) => {
  return useQuery({
    queryKey: ["viewer", "verification", uuid, gender],
    queryFn: async () => {
      const response = await fetch(`${viewersBase}/verification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uuid,
          gender,
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
    enabled: !!uuid && !!gender,
  });
};

export const useIssueTicket = () => {
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
  });
};

export const useViewers = (secretKey: string) => {
  return useQuery({
    queryKey: ["viewers", secretKey],
    queryFn: async () => {
      const response = await fetch(`${viewersBase}?secretKey=${secretKey}`);
      const res = (await response.json()) as SignalResponse<ViewerResponse[]>;
      if (!("result" in res)) {
        throw new SignalError(res.message, res.status, res.timestamp);
      } else {
        return res.result;
      }
    },
    enabled: !!secretKey,
  });
};

export const useViewerSelf = (
  uuid: string,
  queryOptions?: Omit<UseQueryOptions<ViewerResponse>, "queryKey" | "queryFn">
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
