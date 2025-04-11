import { http, HttpResponse } from "msw";

export const handlers = [
  // Example handler
  http.get("/api/example", () => {
    return HttpResponse.json({
      message: "This is a mocked response",
    });
  }),
];
