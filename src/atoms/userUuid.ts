import { atomWithStorage } from "jotai/utils";
export const userUuidAtom = atomWithStorage<string | null>(
  "user.uuid", // localStorage key
  null,
  undefined,
  { getOnInit: true } // optional, default is false
);
