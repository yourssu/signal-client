import {
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";
import { BlacklistExistsResponse, BlacklistResponse } from "@/types/blacklist";
import { SignalError } from "@/lib/error";
import { API_BASE_URL } from "@/env";
import { authedFetch } from "@/lib/fetch";

const blacklistsBase = `${API_BASE_URL ?? ""}/api/blacklists`;

export const useCheckMyBlacklistStatus = (
  queryOptions?: Omit<
    UseQueryOptions<BlacklistExistsResponse, SignalError>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: ["blacklists", "me", "status"],
    queryFn: async () => {
      return await authedFetch<BlacklistExistsResponse>(blacklistsBase);
    },
    ...queryOptions,
  });
};

export const useAddMyToBlacklist = (
  mutationOptions?: Omit<
    UseMutationOptions<BlacklistResponse, SignalError, void>,
    "mutationFn"
  >,
) => {
  return useMutation({
    mutationFn: async () => {
      return await authedFetch<BlacklistResponse>(`${blacklistsBase}/me`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
    ...mutationOptions,
  });
};

export const useRemoveMyFromBlacklist = (
  mutationOptions?: Omit<
    UseMutationOptions<void, SignalError, void>,
    "mutationFn"
  >,
) => {
  return useMutation({
    mutationFn: async () => {
      await authedFetch(`${blacklistsBase}/me`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
    ...mutationOptions,
  });
};
