import { atomWithStorage } from "jotai/utils";
import { v4 as uuidv4 } from "uuid";

// Generate initial UUID if none exists in localStorage
const generateUuid = () => uuidv4();

export const userUuid = atomWithStorage<string>(
  "user-uuid", // localStorage key
  generateUuid() // initial value if not in localStorage
);

export const userGender = atomWithStorage<string | null>("user-gender", null);
