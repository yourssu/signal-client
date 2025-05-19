import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { initMocks } from "./mocks/browser";
import ReactGA from "react-ga4";
import Clarity from "@microsoft/clarity";
import { CLARITY_ID, GA_ID } from "./env.ts";

if (import.meta.env.DEV) initMocks();

if (GA_ID)
  ReactGA.initialize([
    {
      trackingId: GA_ID,
    },
  ]);
if (CLARITY_ID) Clarity.init(CLARITY_ID);
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
