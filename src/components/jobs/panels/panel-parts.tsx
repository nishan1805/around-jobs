"use client";

import { useState, type ReactNode } from "react";

import { Icon } from "@/components/icon";
import { IconButton } from "@/components/ui/icon-button";
import { cn } from "@/lib/utils";

/**
 * Floating overlay panel on the map (Figma S01–S05): 448px wide, docked 24px
 * from the top-left of the map on tablet and desktop, full screen on phones.
 */
export function MapPanel({
  label,
  width = "wide",
  className,
  children,
}: {
  label: string;
  width?: "wide" | "narrow";
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      aria-label={label}
      className={cn(
        "absolute inset-0 z-1001 flex flex-col overflow-hidden bg-surface-default",
        "md:inset-auto md:top-6 md:bottom-6 md:left-6 md:shadow-lg",
        width === "wide" ? "md:w-112 md:rounded-md" : "md:w-76 md:rounded-xl",
        className,
      )}
    >
      {children}
    </section>
  );
}

/** Pixel width a docked panel covers on md+ (panel + 24px gap on both sides). */
export const panelInset = { wide: 448 + 48, narrow: 304 + 48 } as const;

/** Figma "Around / Detail Section Header" (1859:10854). */
export function SectionHeader({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="flex w-full items-center gap-2">
      <h3 className="min-w-0 flex-1 text-subheading-semibold text-text-primary">{title}</h3>
      {action}
    </div>
  );
}

export function SectionLink({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex shrink-0 items-center gap-1 text-body-sm-semibold text-brand-primary hover:underline"
    >
      {children}
      <Icon name="arrowRight" className="size-4" />
    </button>
  );
}

/**
 * Figma "Gallery Header": 240px photo strip with a nav button, optional
 * save/share actions, prev/next and a counter. Photos are Sample placeholders.
 */
export function GalleryHeader({
  name,
  photoCount,
  nav,
  actions,
}: {
  name: string;
  photoCount: number;
  nav: { icon: "close" | "arrowLeft"; label: string; onClick: () => void };
  actions?: ReactNode;
}) {
  const [index, setIndex] = useState(0);
  const step = (delta: number) => setIndex((current) => (current + delta + photoCount) % photoCount);

  return (
    <div
      role="group"
      aria-roledescription="carousel"
      aria-label={`${name} photos (Sample placeholders)`}
      className="relative h-60 w-full shrink-0 bg-grey-100"
    >
      <IconButton icon={nav.icon} label={nav.label} onClick={nav.onClick} className="absolute top-4 left-4" iconClassName="size-4" />
      {actions && <div className="absolute top-4 right-4 flex gap-2">{actions}</div>}
      {photoCount > 1 && (
        <>
          <IconButton icon="chevronLeft" label="Previous photo" onClick={() => step(-1)} className="absolute top-26 left-4 p-1.5" />
          <IconButton icon="chevronRight" label="Next photo" onClick={() => step(1)} className="absolute top-26 right-4 p-1.5" />
        </>
      )}
      <span aria-live="polite" className="absolute top-50 left-4 rounded-full bg-overlay-scrim px-2.5 py-1 text-label-medium text-text-on-brand">
        {index + 1} / {photoCount}
      </span>
    </div>
  );
}

export async function shareLink(title: string, path: string) {
  const url = new URL(path, window.location.origin).toString();
  try {
    if (navigator.share) {
      await navigator.share({ title, url });
      return "shared" as const;
    }
    await navigator.clipboard.writeText(url);
    return "copied" as const;
  } catch {
    return "failed" as const;
  }
}

export function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="flex w-full flex-col gap-3.5 text-body-sm-regular text-text-secondary">
      {items.map((item) => (
        <li key={item} className="flex gap-1.5">
          <span aria-hidden>•</span>
          {item}
        </li>
      ))}
    </ul>
  );
}
