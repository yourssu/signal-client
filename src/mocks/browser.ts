import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

export const worker = setupWorker(...handlers);

/**
 * 워커가 페이지를 잡을 때까지 기다린다.
 *
 * 기다리지 않고 앱을 띄우면 첫 요청이 워커를 지나쳐 dev 서버로 가고,
 * dev 서버는 SPA 폴백으로 index.html을 200으로 돌려준다. 그걸 JSON으로
 * 읽으려다 실패해 "불러오지 못했어요" 토스트가 떴다 다음 폴링에 사라진다.
 */
export const initMocks = async () => {
  if (process.env.NODE_ENV !== "development") return;

  await worker.start({
    onUnhandledRequest: "bypass",
  });
};
