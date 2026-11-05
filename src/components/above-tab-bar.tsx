"use client";

import { useAboveTabBar } from "@/hooks/use-cover-tab-bar";

/** Keeps a sticky mobile action above the raised tab-bar button. */
export function AboveTabBar() {
  useAboveTabBar(true);
  return null;
}
