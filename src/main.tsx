import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { initMocks } from "./mocks/browser";
import { initWasm } from "@resvg/resvg-wasm";
import { API_BASE_URL } from "./env";

if (import.meta.env.DEV && !API_BASE_URL) initMocks();
await initWasm(fetch("/wasm/index_bg.wasm"));

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
