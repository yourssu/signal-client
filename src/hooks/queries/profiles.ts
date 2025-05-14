import {
  keepPreviousData,
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";
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
import { SignalResponse } from "@/types/common";
import { SignalError } from "@/lib/error";
import { API_BASE_URL } from "@/env";

const profileBase = `${API_BASE_URL ?? ""}/api/profiles`;

export const useCountProfile = (
  queryOptions?: Omit<
    UseQueryOptions<ProfileCountResponse, SignalError>,
    "queryKey" | "queryFn"
  >,
) => {
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
    ...queryOptions,
  });
};

export const useRandomProfile = (
  uuid: string,
  desiredGender: Gender,
  excludeProfiles?: number[],
  queryOptions?: Omit<
    UseQueryOptions<ProfileResponse, SignalError>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: ["profiles", uuid, "random", desiredGender],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("uuid", uuid);
      params.append("gender", desiredGender);
      if (excludeProfiles) {
        params.append("excludeProfiles", excludeProfiles.join(","));
      }
      const response = await fetch(
        `${profileBase}/random?${params.toString()}`,
      );
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
    ...queryOptions,
  });
};

export const useCreateProfile = (
  mutationOptions?: Omit<
    UseMutationOptions<
      ProfileContactResponse,
      SignalError,
      ProfileCreatedRequest
    >,
    "mutationFn"
  >,
) => {
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
    ...mutationOptions,
  });
};

export const useGenerateNickname = (
  mutationOptions?: Omit<
    UseMutationOptions<
      NicknameCreatedResponse,
      SignalError,
      NicknameGeneratedRequest
    >,
    "mutationFn"
  >,
) => {
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
    ...mutationOptions,
  });
};

export const useConsumeTicket = (
  mutationOptions?: Omit<
    UseMutationOptions<
      ProfileContactResponse,
      SignalError,
      TicketConsumedRequest
    >,
    "mutationFn"
  >,
) => {
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
    ...mutationOptions,
  });
};
