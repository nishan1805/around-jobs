"use client";

import { useSyncExternalStore } from "react";

const subscribeToUrl = (onChange: () => void) => {
  window.addEventListener("popstate", onChange);
  return () => window.removeEventListener("popstate", onChange);
};

/** Read one query param. Updates on back/forward. Server snapshot is null. */
export function useSearchParam(name: string) {
  return useSyncExternalStore(
    subscribeToUrl,
    () => new URLSearchParams(window.location.search).get(name),
    () => null,
  );
}
