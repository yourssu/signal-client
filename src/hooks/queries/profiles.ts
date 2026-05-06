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
  ProfileUpdateRequest,
  ProfileRankingResponse,
  TicketConsumedRequest,
} from "@/types/profile";
import { SignalError } from "@/lib/error";
import { authedFetch } from "@/lib/fetch";
import { API_BASE_URL } from "@/env";
import { PurchasedProfileResponse } from "@/types/viewer";

interface DeckResponse {
  profiles: ProfileResponse[];
}

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
      return authedFetch<ProfileCountResponse>(`${profileBase}/count`);
    },
    ...queryOptions,
  });
};

export const useSelfProfile = (
  queryOptions?: Omit<
    UseQueryOptions<ProfileContactResponse, SignalError>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: ["profiles", "me"],
    queryFn: async () => {
      return authedFetch<ProfileContactResponse>(`${profileBase}/me`);
    },
    ...queryOptions,
  });
};

export const useRandomProfile = (
  desiredGender: Gender,
  excludeProfiles?: number[],
  queryOptions?: Omit<
    UseQueryOptions<ProfileResponse, SignalError>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: ["profiles", "random", desiredGender, excludeProfiles],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("gender", desiredGender);
      if (excludeProfiles && excludeProfiles.length > 0) {
        excludeProfiles.forEach((id) =>
          params.append("excludeProfiles", id.toString()),
        );
      }
      return authedFetch<ProfileResponse>(
        `${profileBase}/random?${params.toString()}`,
      );
    },
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
      return authedFetch<ProfileContactResponse>(profileBase, {
        method: "POST",
        body: JSON.stringify(data),
      });
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
      return authedFetch<NicknameCreatedResponse>(`${profileBase}/nickname`, {
        method: "POST",
        body: JSON.stringify(data),
      });
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
      return authedFetch<ProfileContactResponse>(`${profileBase}/contact`, {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    ...mutationOptions,
  });
};

export const useUpdateProfile = (
  mutationOptions?: Omit<
    UseMutationOptions<
      ProfileContactResponse,
      SignalError,
      ProfileUpdateRequest
    >,
    "mutationFn"
  >,
) => {
  return useMutation({
    mutationFn: async (data: ProfileUpdateRequest) => {
      return authedFetch<ProfileContactResponse>(`${profileBase}/me`, {
        method: "PATCH",
        body: JSON.stringify(data),
      });
    },
    ...mutationOptions,
  });
};

export const usePurchasedProfile = (
  profileId: number,
  queryOptions?: Omit<
    UseQueryOptions<ProfileContactResponse, SignalError>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: ["profiles", profileId],
    queryFn: async () => {
      return authedFetch<ProfileContactResponse>(`${profileBase}/${profileId}`);
    },
    ...queryOptions,
  });
};

export const useProfileRanking = (
  uuid: string,
  queryOptions?: Omit<
    UseQueryOptions<ProfileRankingResponse, SignalError>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: ["profiles", "ranking", uuid],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("uuid", uuid);
      return authedFetch<ProfileRankingResponse>(
        `${profileBase}/ranking?${params.toString()}`,
      );
    },
    ...queryOptions,
  });
};

export const useCountProfileByGender = (
  gender: Gender,
  queryOptions?: Omit<
    UseQueryOptions<ProfileCountResponse, SignalError>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: ["profiles", "count", gender],
    queryFn: async () => {
      return authedFetch<ProfileCountResponse>(
        `${profileBase}/genders/${gender}/count`,
      );
    },
    ...queryOptions,
  });
};

export const usePurchasedProfiles = (
  queryOptions?: Omit<
    UseQueryOptions<PurchasedProfileResponse[], SignalError>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: ["profiles", "me", "purchased"],
    queryFn: async () => {
      return authedFetch<PurchasedProfileResponse[]>(
        `${profileBase}/me/purchased`,
      );
    },
    ...queryOptions,
  });
};

export const useDeckProfiles = (
  gender: Gender,
  queryOptions?: Omit<
    UseQueryOptions<ProfileResponse[], SignalError>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: ["profiles", "deck", gender],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("gender", gender);
      const res = await authedFetch<DeckResponse>(
        `${profileBase}/deck?${params.toString()}`,
      );
      return res.profiles;
    },
    staleTime: Infinity,
    ...queryOptions,
  });
};
