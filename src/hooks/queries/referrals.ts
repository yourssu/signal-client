import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { ReferralCodeRequest, ReferralCodeResponse } from "@/types/referral";
import { SignalError } from "@/lib/error";
import { authedFetch } from "@/lib/fetch";
import { API_BASE_URL } from "@/env";

const referralsBase = `${API_BASE_URL ?? ""}/api/referrals`;

export const useGenerateReferralCode = (
  mutationOptions?: Omit<
    UseMutationOptions<ReferralCodeResponse, SignalError, ReferralCodeRequest>,
    "mutationFn"
  >,
) => {
  return useMutation({
    mutationFn: async (data: ReferralCodeRequest) => {
      return authedFetch<ReferralCodeResponse>(referralsBase, {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    ...mutationOptions,
  });
};
