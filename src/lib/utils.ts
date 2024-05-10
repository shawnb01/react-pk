import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// All the game logic and helper functionss will follow here.

export function formatBigNumber(num: number) {
  const tier = (Math.log10(num) / 3) | 0;
  if (tier === 0) return num;
  if (tier >= 5) return "Infinity";
  const suffix = ["", "K", "M", "B", "T"][tier];
  const scale = Math.pow(10, tier * 3);
  const scaled = num / scale;
  return scaled.toFixed(1) + suffix;
}
