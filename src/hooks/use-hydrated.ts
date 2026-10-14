"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};

/** False during SSR and the first client render, so stores backed by localStorage can show a skeleton. */
export const useHydrated = () =>
  useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
