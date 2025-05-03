import { useMutation, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { VerificationResponse, ViewerResponse } from "@/types/viewer";
import { SuccessResponse } from "@/types/common";
import { TicketIssuedRequest } from "@/types/admin";
import { Gender } from "@/types/profile";

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
      const data =
        (await response.json()) as SuccessResponse<VerificationResponse>;
      return data.result;
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
      const result = (await response.json()) as SuccessResponse<ViewerResponse>;
      return result;
    },
  });
};

export const useViewers = (secretKey: string) => {
  return useQuery({
    queryKey: ["viewers", secretKey],
    queryFn: async () => {
      const response = await fetch(`${viewersBase}?secretKey=${secretKey}`);
      const data = (await response.json()) as SuccessResponse<ViewerResponse[]>;
      return data.result;
    },
    enabled: !!secretKey,
  });
};

export const useViewerSelf = (
  uuid: string,
  queryOptions?: Omit<UseQueryOptions<ViewerResponse>, "queryKey" | "queryFn">,
) => {
  return useQuery({
    queryKey: ["viewer", "uuid", uuid],
    queryFn: async () => {
      const response = await fetch(`${viewersBase}/uuid?uuid=${uuid}`);
      const data = (await response.json()) as SuccessResponse<ViewerResponse>;
      return data.result;
    },
    enabled: !!uuid,
    ...queryOptions,
  });
};
