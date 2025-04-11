import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

export const worker = setupWorker(...handlers);

// Initialize MSW
export const initMocks = () => {
  // Start the worker in development environment
  if (process.env.NODE_ENV === "development") {
    worker.start({
      onUnhandledRequest: "bypass", // Don't warn about unhandled requests
    });
  }
};
