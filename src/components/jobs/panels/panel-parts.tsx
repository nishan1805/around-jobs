"use client";

import { useState, type ComponentProps, type PointerEvent, type ReactNode } from "react";

import { Icon } from "@/components/icon";
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
 * Floating overlay on the map. S01 and S02 (2018:42720, 2018:44934) are 448px
 * wide and sit 20px from the top, right and bottom of the map, sliding in from
 * the right. The list (S03) and filters (S05) stay on the left and slide in
 * from the left. On phones it's a bottom sheet: "half" opens at a third of the
 * screen and drags up to full, "full" leaves 24px of map visible.
 */
export function MapPanel({
  label,
  width = "wide",
  sheet = "full",
  dock = "left",
  onDismiss,
  className,
  children,
}: {
  label: string;
  width?: "wide" | "narrow";
  sheet?: "half" | "full";
  /** Desktop dock. S01 and S02 sit on the right of the map; the list stays on the left. */
  dock?: "left" | "right";
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
        "md:inset-auto md:bottom-6 md:rounded-lg",
        dock === "right"
          ? "md:top-5 md:right-5 md:bottom-5 md:left-auto md:animate-[panel-from-right_280ms_ease-out]"
          : "md:top-[5.5rem] md:bottom-[5.5rem] md:left-6 md:animate-[panel-from-left_280ms_ease-out]",
        width === "wide" ? "md:w-112" : "md:w-[380px]",
        className,
      )}
    >
      <GrabHandle className="md:hidden" {...drag.handlers} />
      {children}
    </section>
  );
}

/** Pixel width a docked panel covers on md+ (panel plus the gap on both sides). */
export const panelInset = { wide: 448 + 40, narrow: 380 + 48 } as const;

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
