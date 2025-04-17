import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Gender,
  NicknameCreatedResponse,
  NicknameGeneratedRequest,
  ProfileContactResponse,
  ProfileCountResponse,
  ProfileCreatedRequest,
  ProfileResponse,
  TicketConsumedRequest,
} from "@/types/profile";
import { SuccessResponse } from "@/types/common";

export const useCountProfile = () => {
  return useQuery({
    queryKey: ["profiles", "count"],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL ?? ""}/api/profiles/count`
      );

      const data =
        (await response.json()) as SuccessResponse<ProfileCountResponse>;
      return data.result;
    },
  });
};

export const useRandomProfile = (uuid: string, gender: Gender) => {
  return useQuery({
    queryKey: ["profiles", uuid],
    queryFn: async () => {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL ?? ""
        }/api/profiles/random?uuid=${uuid}&gender=${gender}`
      );
      const data = (await response.json()) as SuccessResponse<ProfileResponse>;
      return data.result;
    },
    enabled: !!uuid,
  });
};

export const useCreateProfile = () => {
  return useMutation({
    mutationFn: async (data: ProfileCreatedRequest) => {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL ?? ""}/api/profiles`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      const result =
        (await response.json()) as SuccessResponse<ProfileContactResponse>;
      return result;
    },
  });
};

export const useGenerateNickname = () => {
  return useMutation({
    mutationFn: async (data: NicknameGeneratedRequest) => {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL ?? ""}/api/profiles/nickname`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      const result =
        (await response.json()) as SuccessResponse<NicknameCreatedResponse>;
      return result;
    },
  });
};

export const useConsumeTicket = () => {
  return useMutation({
    mutationFn: async (data: TicketConsumedRequest) => {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL ?? ""}/api/profiles/contact`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      const result =
        (await response.json()) as SuccessResponse<ProfileContactResponse>;
      return result;
    },
  });
};
