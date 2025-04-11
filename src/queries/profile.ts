import { useMutation, useQuery } from "@tanstack/react-query";
import {
  NicknameGeneratedRequest,
  ProfileCreatedRequest,
  ProfileResponse,
  TicketConsumedRequest,
} from "@/types/profile";
import { SuccessResponse } from "@/types/common";

export const useProfile = (uuid: string) => {
  return useQuery({
    queryKey: ["profile", uuid],
    queryFn: async () => {
      const response = await fetch(`/api/profile?uuid=${uuid}`);
      const data = (await response.json()) as SuccessResponse<ProfileResponse>;
      return data.result;
    },
    enabled: !!uuid,
  });
};

export const useCreateProfile = () => {
  return useMutation({
    mutationFn: async (data: ProfileCreatedRequest) => {
      const response = await fetch("/api/profile", {
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

export const useGenerateNickname = () => {
  return useMutation({
    mutationFn: async (data: NicknameGeneratedRequest) => {
      const response = await fetch("/api/profile/nickname", {
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

export const useConsumeTicket = () => {
  return useMutation({
    mutationFn: async (data: TicketConsumedRequest) => {
      const response = await fetch("/api/profile/contact", {
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
