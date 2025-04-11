import { useMutation, useQuery } from "@tanstack/react-query";
import { TicketCreatedRequest, ViewerResponse } from "@/types/viewer";
import { SuccessResponse } from "@/types/common";

export const useViewerVerification = (uuid: string) => {
  return useQuery({
    queryKey: ["viewer", "verification", uuid],
    queryFn: async () => {
      const response = await fetch(`/api/viewers/verification?uuid=${uuid}`);
      const data = await response.json();
      return data.result;
    },
    enabled: !!uuid,
  });
};

export const useCreateViewer = () => {
  return useMutation({
    mutationFn: async (data: TicketCreatedRequest) => {
      const response = await fetch("/api/viewers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      return result;
    },
  });
};

export const useViewers = (secretKey: string) => {
  return useQuery({
    queryKey: ["viewers", secretKey],
    queryFn: async () => {
      const response = await fetch(`/api/viewers?secretKey=${secretKey}`);
      const data = (await response.json()) as SuccessResponse<ViewerResponse[]>;
      return data.result;
    },
    enabled: !!secretKey,
  });
};

export const useViewerMe = (uuid: string) => {
  return useQuery({
    queryKey: ["viewer", "me", uuid],
    queryFn: async () => {
      const response = await fetch(`/api/viewers/me?uuid=${uuid}`);
      const data = (await response.json()) as SuccessResponse<ViewerResponse>;
      return data.result;
    },
    enabled: !!uuid,
  });
};
