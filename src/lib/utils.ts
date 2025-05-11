import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function whenPressEnter(
  e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
  callback: () => void,
) {
  if (e.key === "Enter") {
    e.preventDefault();
    callback();
  }
}
