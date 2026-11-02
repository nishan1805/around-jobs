"use client";

import { useState, type ComponentProps, type PointerEvent, type ReactNode } from "react";

import { Icon } from "@/components/icon";
import { IconButton } from "@/components/ui/icon-button";
import { cn } from "@/lib/utils";

const DRAG_THRESHOLD = 48;

/** Vertical drag on a grab handle: up past the threshold calls `onUp`, down calls `onDown`. */
export function useSheetDrag({ onUp, onDown }: { onUp?: () => void; onDown?: () => void }) {
  const [startY, setStartY] = useState<number | null>(null);
  const [offset, setOffset] = useState(0);
  return {
    offset,
    handlers: {
      onPointerDown: (event: PointerEvent<HTMLElement>) => {
        event.currentTarget.setPointerCapture(event.pointerId);
        setStartY(event.clientY);
      },
      onPointerMove: (event: PointerEvent<HTMLElement>) => {
        if (startY !== null) setOffset(event.clientY - startY);
      },
      onPointerUp: () => {
        if (offset < -DRAG_THRESHOLD) onUp?.();
        else if (offset > DRAG_THRESHOLD) onDown?.();
        setStartY(null);
        setOffset(0);
      },
      onPointerCancel: () => {
        setStartY(null);
        setOffset(0);
      },
    },
  };
}

/** Figma "Bottom Sheet" grab handle (1952:18519): 40×4, grey-300. */
export function GrabHandle({ className, ...props }: ComponentProps<"div">) {
  return (
    <div aria-hidden className={cn("flex h-5 shrink-0 cursor-grab touch-none justify-center pt-2", className)} {...props}>
      <span className="h-1 w-10 rounded-full bg-grey-300" />
    </div>
  );
}

/**
 * Floating overlay panel on the map (Figma S01–S05): 448px wide, docked 24px
 * from the top-left of the map on tablet and desktop. On phones it's a bottom
 * sheet (M01–M04): "half" opens at a third of the screen and drags up to full,
 * "full" leaves 24px of map visible. Dragging the handle down calls `onDismiss`.
 */
export function MapPanel({
  label,
  width = "wide",
  sheet = "full",
  onDismiss,
  className,
  children,
}: {
  label: string;
  width?: "wide" | "narrow";
  sheet?: "half" | "full";
  onDismiss?: () => void;
  className?: string;
  children: ReactNode;
}) {
  const [expanded, setExpanded] = useState(sheet === "full");
  const drag = useSheetDrag({
    onUp: () => setExpanded(true),
    onDown: () => (expanded && sheet === "half" ? setExpanded(false) : onDismiss?.()),
  });

  return (
    <section
      aria-label={label}
      style={drag.offset > 0 ? { transform: `translateY(${drag.offset}px)` } : undefined}
      className={cn(
        "absolute inset-x-0 bottom-0 z-1001 flex flex-col overflow-hidden rounded-t-lg bg-surface-default shadow-lg transition-[top] duration-200",
        expanded ? "top-6" : "top-1/3",
        "md:inset-auto md:top-6 md:bottom-6 md:left-6 md:transform-none!",
        width === "wide" ? "md:w-112 md:rounded-md" : "md:w-76 md:rounded-xl",
        className,
      )}
    >
      <GrabHandle className="md:hidden" {...drag.handlers} />
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
      aria-label={`${name} photos`}
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
