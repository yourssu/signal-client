import { atomWithStorage } from "jotai/utils";

export const isFirstEntranceAtom = atomWithStorage<boolean>(
  "isFirstEntrance",
  true,
  undefined,
  { getOnInit: true },
);
