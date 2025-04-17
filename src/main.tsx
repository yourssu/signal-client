import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { initMocks } from "./mocks/browser";

// Initialize MSW
if (import.meta.env.VITE_MOCK === "true") initMocks();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
