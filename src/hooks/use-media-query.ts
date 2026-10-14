"use client";

import { useCallback, useSyncExternalStore } from "react";

export const breakpoints = {
  sm: "(min-width: 25.75rem)",
  md: "(min-width: 48rem)",
  lg: "(min-width: 90rem)",
  /** Width where list + 400px preview fit side by side (matches `min-[80rem]:` classes). */
  split: "(min-width: 80rem)",
} as const;

export function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const media = window.matchMedia(query);
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}
