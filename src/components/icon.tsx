import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";

export const icons = {
  briefcase: "/icons/briefcase.svg",
  chevronDown: "/icons/chevron-down.svg",
  crosshair: "/icons/crosshair.svg",
  filters: "/icons/filters.svg",
  list: "/icons/list.svg",
  map: "/icons/map.svg",
  minus: "/icons/minus.svg",
  navApplications: "/icons/nav-applications.svg",
  navJobs: "/icons/nav-jobs.svg",
  navSaved: "/icons/nav-saved.svg",
  pin: "/icons/pin.svg",
  plus: "/icons/plus.svg",
  search: "/icons/search.svg",
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
