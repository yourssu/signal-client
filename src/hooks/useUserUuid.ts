import { userUuidAtom } from "@/atoms/userUuid";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

export const useUserUuid = () => {
  const [uuid, setUuid] = useAtom(userUuidAtom);

  useEffect(() => {
    if (!uuid) {
      const newUuid = uuidv4();
      setUuid(newUuid);
    }
  }, [uuid, setUuid]);
  return uuid as string;
};
