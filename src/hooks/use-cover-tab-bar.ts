"use client";

import { useEffect } from "react";

/** Full-height mobile screens (job detail, filters, apply) hide the bottom tab bar while shown. */
export function useCoverTabBar(active: boolean) {
  useEffect(() => {
    if (!active) return;
    document.body.dataset.sheet = "full";
    return () => {
      delete document.body.dataset.sheet;
    };
  }, [active]);
}
