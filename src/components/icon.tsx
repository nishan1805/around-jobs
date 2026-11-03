import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";

export const icons = {
  alertCircle: "/icons/alert-circle.svg",
  arrowLeft: "/icons/arrow-left.svg",
  arrowRight: "/icons/arrow-right.svg",
  bell: "/icons/notifications.svg",
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
  file: "/icons/file.svg",
  graduationCap: "/icons/graduation-cap.svg",
  filters: "/icons/filters.svg",
  globe: "/icons/globe.svg",
  heart: "/icons/heart.svg",
  heartFilled: "/icons/heart-filled.svg",
  help: "/icons/help.svg",
  link: "/icons/link.svg",
  list: "/icons/list.svg",
  logout: "/icons/logout.svg",
  map: "/icons/map.svg",
  minus: "/icons/minus.svg",
  navApplications: "/icons/nav-applications.svg",
  navApplicationsFilled: "/icons/nav-applications-filled.svg",
  navJobs: "/icons/nav-jobs.svg",
  navJobsFilled: "/icons/nav-jobs-filled.svg",
  navSaved: "/icons/nav-saved.svg",
  navSavedFilled: "/icons/nav-saved-filled.svg",
  pencil: "/icons/pencil.svg",
  pin: "/icons/pin.svg",
  pinSm: "/icons/pin-sm.svg",
  plus: "/icons/plus.svg",
  trash: "/icons/trash.svg",
  search: "/icons/search.svg",
  share: "/icons/share.svg",
  sliders: "/icons/sliders.svg",
  spinner: "/icons/spinner.svg",
  upload: "/icons/upload.svg",
  user: "/icons/user.svg",
  userFilled: "/icons/user-filled.svg",
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
