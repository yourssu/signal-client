import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import {
  NicknameCreatedResponse,
  NicknameGeneratedRequest,
  ProfileContactResponse,
  ProfileCountResponse,
  ProfileCreatedRequest,
  ProfileResponse,
  TicketConsumedRequest,
} from "@/types/profile";
import { SignalResponse } from "@/types/common";
import { SignalError } from "@/lib/error";

const profileBase = `${import.meta.env.VITE_API_BASE_URL ?? ""}/api/profiles`;

export const useCountProfile = () => {
  return useQuery({
    queryKey: ["profiles", "count"],
    queryFn: async () => {
      const response = await fetch(`${profileBase}/count`);

      const res =
        (await response.json()) as SignalResponse<ProfileCountResponse>;
      if (!("result" in res)) {
        throw new SignalError(res.message, res.status, res.timestamp);
      } else {
        return res.result;
      }
    },
  });
};

export const useRandomProfile = (uuid: string) => {
  return useQuery({
    queryKey: ["profiles", uuid],
    queryFn: async () => {
      const response = await fetch(`${profileBase}/random?uuid=${uuid}`);
      const res = (await response.json()) as SignalResponse<ProfileResponse>;
      if (!("result" in res)) {
        throw new SignalError(res.message, res.status, res.timestamp);
      } else {
        return res.result;
      }
    },
    enabled: !!uuid,
    placeholderData: keepPreviousData,
    staleTime: Infinity,
  });
};

export const useCreateProfile = () => {
  return useMutation({
    mutationFn: async (data: ProfileCreatedRequest) => {
      const response = await fetch(profileBase, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const res =
        (await response.json()) as SignalResponse<ProfileContactResponse>;
      if (!("result" in res)) {
        throw new SignalError(res.message, res.status, res.timestamp);
      } else {
        return res.result;
      }
    },
  });
};

export const useGenerateNickname = () => {
  return useMutation({
    mutationFn: async (data: NicknameGeneratedRequest) => {
      const response = await fetch(`${profileBase}/nickname`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const res =
        (await response.json()) as SignalResponse<NicknameCreatedResponse>;
      if (!("result" in res)) {
        throw new SignalError(res.message, res.status, res.timestamp);
      } else {
        return res.result;
      }
    },
  });
};

export const useConsumeTicket = () => {
  return useMutation({
    mutationFn: async (data: TicketConsumedRequest) => {
      const response = await fetch(`${profileBase}/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const res =
        (await response.json()) as SignalResponse<ProfileContactResponse>;
      if (!("result" in res)) {
        throw new SignalError(res.message, res.status, res.timestamp);
      } else {
        return res.result;
      }
    },
  });
};
