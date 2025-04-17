import { useMutation } from "@tanstack/react-query";
import {
  NicknameCreatedResponse,
  NicknameGeneratedRequest,
  ProfileContactResponse,
  ProfileCreatedRequest,
  TicketConsumedRequest,
} from "@/types/profile";
import { ErrorResponse, SuccessResponse } from "@/types/common";

const profileBase = `${import.meta.env.VITE_API_BASE_URL ?? ""}/api/profiles`;

/**
 * Mutation hook for creating a new profile.
 * Corresponds to POST /api/profiles
 */
export const useCreateProfile = () => {
  return useMutation({
    mutationFn: async (
      profileData: ProfileCreatedRequest
    ): Promise<SuccessResponse<ProfileContactResponse>> => {
      const response = await fetch(profileBase, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        const errorData: ErrorResponse = await response.json();
        throw new Error(errorData.message || "Failed to create profile");
      }

      const successData: SuccessResponse<ProfileContactResponse> =
        await response.json();
      return successData;
    },
  });
};

/**
 * Mutation hook for generating a nickname based on intro sentences.
 * Corresponds to POST /api/profiles/nickname
 */
export const useGenerateNickname = () => {
  return useMutation({
    mutationFn: async (
      nicknameData: NicknameGeneratedRequest
    ): Promise<SuccessResponse<NicknameCreatedResponse>> => {
      const response = await fetch(`${profileBase}/nickname`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nicknameData),
      });

      if (!response.ok) {
        const errorData: ErrorResponse = await response.json();
        throw new Error(errorData.message || "Failed to generate nickname");
      }

      const successData: SuccessResponse<NicknameCreatedResponse> =
        await response.json();
      return successData;
    },
  });
};

/**
 * Mutation hook for consuming a ticket to view a profile's contact.
 * Corresponds to POST /api/profiles/contact
 */
export const useConsumeTicket = () => {
  return useMutation({
    mutationFn: async (
      ticketData: TicketConsumedRequest
    ): Promise<SuccessResponse<ProfileContactResponse>> => {
      const response = await fetch(`${profileBase}/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ticketData),
      });

      if (!response.ok) {
        const errorData: ErrorResponse = await response.json();
        throw new Error(errorData.message || "Failed to consume ticket");
      }

      const successData: SuccessResponse<ProfileContactResponse> =
        await response.json();
      return successData;
    },
  });
};
