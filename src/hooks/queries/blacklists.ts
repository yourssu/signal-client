import {
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";
import { BlacklistExistsResponse, BlacklistResponse } from "@/types/blacklist";
import { SignalResponse } from "@/types/common";
import { SignalError } from "@/lib/error";
import { API_BASE_URL } from "@/env";

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
      const response = await fetch(blacklistsBase);

      const res =
        (await response.json()) as SignalResponse<BlacklistExistsResponse>;
      if (!("result" in res)) {
        throw new SignalError(res.message, res.status, res.timestamp);
      } else {
        return res.result;
      }
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
      const response = await fetch(`${blacklistsBase}/me`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const res = (await response.json()) as SignalResponse<BlacklistResponse>;
      if (!("result" in res)) {
        throw new SignalError(res.message, res.status, res.timestamp);
      } else {
        return res.result;
      }
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
      const response = await fetch(`${blacklistsBase}/me`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new SignalError(
          errorData.message || "Failed to remove from blacklist",
          response.status,
          new Date().toISOString(),
        );
      }
    },
    ...mutationOptions,
  });
};
