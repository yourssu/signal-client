import { useEffect, useState } from "react";

/**
 * intervalMs마다 갱신되는 현재 시각.
 *
 * 폴링 응답이 매번 같으면 구조적 공유가 이전 참조를 그대로 돌려줘 리렌더가 걸리지 않는다.
 * 그 사이 시간만 흐르는 화면(남은 시간, 마감 여부)은 이 훅으로 직접 리렌더를 만든다.
 */
export const useNow = (intervalMs: number): number => {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const update = () => setNow(Date.now());
    const timer = window.setInterval(update, intervalMs);
    // 백그라운드 탭은 타이머가 묶이거나 아예 멈춘다. 돌아온 즉시 한 번 맞춰야
    // 다음 틱까지 낡은 시각이 남지 않는다.
    document.addEventListener("visibilitychange", update);

    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", update);
    };
  }, [intervalMs]);

  return now;
};
