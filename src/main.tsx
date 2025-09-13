import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { initMocks } from "./mocks/browser";
import { initWasm } from "@resvg/resvg-wasm";

if (import.meta.env.DEV) initMocks();
await initWasm(fetch("/wasm/index_bg.wasm"));

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
