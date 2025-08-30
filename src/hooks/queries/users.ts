import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { UserInfoResponse } from "@/types/user";
import { SignalError } from "@/lib/error";
import { authedFetch } from "@/lib/fetch";
import { API_BASE_URL } from "@/env";

const usersBase = `${API_BASE_URL ?? ""}/api/users`;

export const useUserInfo = (
  queryOptions?: Omit<
    UseQueryOptions<UserInfoResponse, SignalError>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: ["users", "me"],
    queryFn: async () => {
      return authedFetch<UserInfoResponse>(`${usersBase}/me`);
    },
    ...queryOptions,
  });
};
