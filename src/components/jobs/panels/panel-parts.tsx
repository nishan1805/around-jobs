"use client";

import { useEffect, useRef, useState, type ComponentProps, type CSSProperties, type PointerEvent, type ReactNode } from "react";

import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";

const DRAG_THRESHOLD = 48;

/** Vertical drag on a grab handle. A positive delta means the finger moved down. */
export function useSheetDrag({ onUp, onDown }: { onUp?: (delta: number) => void; onDown?: (delta: number) => void }) {
  const startY = useRef<number | null>(null);
  const offsetRef = useRef(0);
  const [offset, setOffset] = useState(0);
  const [dragging, setDragging] = useState(false);
  const end = (delta: number) => {
    if (delta < -DRAG_THRESHOLD) onUp?.(delta);
    else if (delta > DRAG_THRESHOLD) onDown?.(delta);
  };
  return {
    offset,
    dragging,
    handlers: {
      onPointerDown: (event: PointerEvent<HTMLElement>) => {
        event.currentTarget.setPointerCapture(event.pointerId);
        startY.current = event.clientY;
        offsetRef.current = 0;
        setDragging(true);
      },
      onPointerMove: (event: PointerEvent<HTMLElement>) => {
        if (startY.current === null) return;
        const next = event.clientY - startY.current;
        offsetRef.current = next;
        setOffset(next);
      },
      onPointerUp: () => {
        const delta = offsetRef.current;
        startY.current = null;
        offsetRef.current = 0;
        setOffset(0);
        setDragging(false);
        end(delta);
      },
      onPointerCancel: () => {
        startY.current = null;
        offsetRef.current = 0;
        setOffset(0);
        setDragging(false);
      },
    },
  };
}

/** Figma "Bottom Sheet" grab handle (1952:18519): 40×4 bar, with a 44px touch target. */
export function GrabHandle({ className, ...props }: ComponentProps<"div">) {
  return (
    <div aria-hidden className={cn("flex h-11 shrink-0 cursor-grab touch-none items-center justify-center active:cursor-grabbing", className)} {...props}>
      <span className="h-1 w-10 rounded-full bg-grey-300" />
    </div>
  );
}

/** Phone sheet stops. Peek is 140px, half is 480px, full leaves the status area clear. */
export type SheetSnap = "peek" | "half" | "full";

const SNAP_ORDER: SheetSnap[] = ["peek", "half", "full"];

/** Distance from the top of the map on phones. Desktop positioning stays in classes. */
const SNAP_TOP: Record<SheetSnap, string> = {
  peek: "calc(100% - 140px)",
  half: "calc(100% - min(480px, 58%))",
  full: "max(1.5rem, env(safe-area-inset-top))",
};

/**
 * Floating overlay on the map. S01 and S02 (2018:42720, 2018:44934) are 448px
 * wide and sit 20px from the top, right and bottom of the map, sliding in from
 * the right. The list (S03) and filters (S05) stay on the left and slide in
 * from the left. On phones the same panel is a bottom sheet with peek, half
 * and full stops. A long swipe down closes it.
 */
export function MapPanel({
  label,
  width = "wide",
  initialSnap = "full",
  dock = "left",
  onDismiss,
  onSnapChange,
  className,
  children,
}: {
  label: string;
  width?: "wide" | "narrow";
  initialSnap?: SheetSnap;
  /** Desktop dock. S01 and S02 sit on the right of the map; the list stays on the left. */
  dock?: "left" | "right";
  onDismiss?: () => void;
  onSnapChange?: (snap: SheetSnap) => void;
  className?: string;
  children: ReactNode;
}) {
  const [snap, setSnap] = useState<SheetSnap>(initialSnap);
  const drag = useSheetDrag({
    onUp: () => {
      const index = SNAP_ORDER.indexOf(snap);
      if (index < SNAP_ORDER.length - 1) setSnap(SNAP_ORDER[index + 1]);
    },
    onDown: (delta) => {
      if (delta > 180) {
        onDismiss?.();
        return;
      }
      const index = SNAP_ORDER.indexOf(snap);
      if (index <= 0) onDismiss?.();
      else setSnap(SNAP_ORDER[index - 1]);
    },
  });

  useEffect(() => {
    onSnapChange?.(snap);
  }, [snap, onSnapChange]);

  const resisted =
    snap === "full" && drag.offset < 0 ? drag.offset * 0.2 : snap === "peek" && drag.offset < 0 ? drag.offset * 0.3 : drag.offset;
  const style = {
    "--sheet-top": SNAP_TOP[snap],
    ...(drag.offset !== 0 ? { transform: `translateY(${resisted}px)` } : null),
    ...(drag.dragging ? { transition: "none" } : null),
  } as CSSProperties;

  return (
    <section
      aria-label={label}
      data-snap={snap}
      style={style}
      className={cn(
        "absolute inset-x-0 bottom-0 z-1001 flex flex-col overflow-hidden rounded-t-xl bg-surface-default shadow-lg max-md:top-(--sheet-top) max-md:transition-[top] max-md:duration-200 max-md:ease-out",
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
