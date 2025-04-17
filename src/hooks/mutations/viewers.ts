import { useMutation } from "@tanstack/react-query";
import { ErrorResponse, SuccessResponse } from "@/types/common";
import { TicketIssuedRequest } from "@/types/admin";
import { ViewerResponse } from "@/types/viewer"; // Assuming the POST returns ViewerResponse based on the original hook

const viewersBase = `${import.meta.env.VITE_API_BASE_URL ?? ""}/api/viewers`;

export const useIssueTicket = () => {
  return useMutation({
    mutationFn: async (data: TicketIssuedRequest) => {
      const response = await fetch(viewersBase, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      // The mock returns { verificationCode: number }, but the original hook expected SuccessResponse<ViewerResponse>.
      // Let's align with the original hook's expectation for now. Adjust if the actual API differs.
      if (!response.ok) {
        // Handle potential errors if the API returns non-SuccessResponse on failure
        const errorResult = (await response.json()) as ErrorResponse;
        throw new Error(errorResult.message || "Failed to issue ticket");
      }
      // If response is ok, parse as SuccessResponse
      const successResult =
        (await response.json()) as SuccessResponse<ViewerResponse>;
      return successResult; // Return the whole SuccessResponse object as per original hook structure
    },
  });
};

// Add other mutation hooks here if needed based on other POST/PUT/DELETE handlers for /api/viewers/*
