import { ViewerResponse } from "@/types/viewer";
import { atomWithStorage } from "jotai/utils";

export const viewerSelfAtom = atomWithStorage<ViewerResponse | null>(
  "viewer.self",
  null,
  undefined,
  { getOnInit: true }
);
