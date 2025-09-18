import { cleanDataAtom, lastEntranceAtom } from "@/atoms/user";
import { DATA_EXPIRY } from "@/env";
import { useAtom, useSetAtom } from "jotai";
import { useEffect, useRef } from "react";

export const useExpiredDataCheck = (): void => {
  const [lastEntranceTime, setLastEntranceTime] = useAtom(lastEntranceAtom);
  const clearDataAtom = useSetAtom(cleanDataAtom);
  const checked = useRef(false);
  useEffect(() => {
    if (
      !checked.current &&
      (lastEntranceTime === null ||
        lastEntranceTime < new Date(DATA_EXPIRY).getTime())
    ) {
      clearDataAtom();
      checked.current = true;
    } else if (!checked.current) {
      setLastEntranceTime(Date.now());
      checked.current = true;
    }
    // This hook runs only once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
