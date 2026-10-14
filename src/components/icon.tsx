import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";

export const icons = {
  alertCircle: "/icons/alert-circle.svg",
  arrowLeft: "/icons/arrow-left.svg",
  arrowRight: "/icons/arrow-right.svg",
  bookmark: "/icons/bookmark.svg",
  bookmarkFilled: "/icons/bookmark-filled.svg",
  briefcase: "/icons/briefcase.svg",
  calendar: "/icons/calendar.svg",
  checkCircle: "/icons/check-circle.svg",
  chevronDown: "/icons/chevron-down.svg",
  chevronLeft: "/icons/chevron-left.svg",
  chevronRight: "/icons/chevron-right.svg",
  close: "/icons/close.svg",
  crosshair: "/icons/crosshair.svg",
  directions: "/icons/directions.svg",
  filters: "/icons/filters.svg",
  heart: "/icons/heart.svg",
  heartFilled: "/icons/heart-filled.svg",
  list: "/icons/list.svg",
  map: "/icons/map.svg",
  minus: "/icons/minus.svg",
  navApplications: "/icons/nav-applications.svg",
  navJobs: "/icons/nav-jobs.svg",
  navSaved: "/icons/nav-saved.svg",
  pin: "/icons/pin.svg",
  pinSm: "/icons/pin-sm.svg",
  plus: "/icons/plus.svg",
  search: "/icons/search.svg",
  share: "/icons/share.svg",
} as const;

export type IconName = keyof typeof icons;

/**
 * Renders a monochrome Figma icon as a CSS mask so its colour comes from the
 * current text colour token (e.g. `text-brand-primary`) instead of the SVG.
 */
export function Icon({ name, className }: { name: IconName; className?: string }) {
  const style = { "--icon": `url(${icons[name]})` } as CSSProperties;
  return (
    <span
      aria-hidden
      style={style}
      className={cn(
        "inline-block size-4.5 shrink-0 bg-current mask-(--icon) mask-contain mask-center mask-no-repeat",
        className,
      )}
    />
  );
}
