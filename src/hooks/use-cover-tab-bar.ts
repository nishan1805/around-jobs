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

/**
 * Puts the page column above the raised tab-bar button so a sheet or a
 * sticky action isn't covered by it. The home map leaves this off, so the
 * button still sits on the peek sheet.
 */
export function useAboveTabBar(active: boolean) {
  useEffect(() => {
    if (!active) return;
    document.body.dataset.panel = "open";
    const column = document.querySelector<HTMLElement>("[data-app-main]");
    const phone = window.matchMedia("(max-width: 47.99rem)").matches;
    if (column && phone) {
      column.style.position = "relative";
      column.style.zIndex = "20";
    }
    return () => {
      delete document.body.dataset.panel;
      if (column) {
        column.style.position = "";
        column.style.zIndex = "";
      }
    };
  }, [active]);
}
