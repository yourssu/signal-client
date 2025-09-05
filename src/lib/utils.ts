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

export function getDeviceType(): "ios" | "android" | "desktop" {
  const userAgent = navigator.userAgent.toLowerCase();

  // Check for iOS devices (iPhone, iPad, iPod)
  if (/iphone|ipad|ipod/.test(userAgent)) {
    return "ios";
  }

  // Check for Android devices
  if (/android/.test(userAgent)) {
    return "android";
  }

  // Default to desktop for all other cases
  return "desktop";
}
