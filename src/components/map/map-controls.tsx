"use client";

import type { Map as LeafletMap } from "leaflet";
import type { CSSProperties } from "react";

import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";

const controlButton =
  "flex size-11 items-center justify-center bg-surface-default text-grey-700 transition-colors hover:bg-grey-100 focus-visible:outline-2 focus-visible:-outline-offset-2 disabled:text-text-disabled";

/** Figma Map Navigation (1913:16124): 44px locate, 46×91 zoom stack. No distance scale. */
export function MapControls({
  map,
  onLocate,
  locating,
  className,
  style,
}: {
  map: LeafletMap;
  onLocate: () => void;
  locating: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div className={cn("pointer-events-none flex flex-col items-end gap-3", className)} style={style}>
      <button
        type="button"
        onClick={onLocate}
        disabled={locating}
        aria-label="Show my location"
        className={cn(controlButton, "pointer-events-auto rounded-full border border-grey-200 shadow-sm")}
      >
        <Icon name="gpsFix" className={cn("size-5", locating && "animate-spin")} />
      </button>
      <div className="pointer-events-auto hidden h-[91px] w-[46px] flex-col overflow-hidden rounded-[12px] border border-grey-200 bg-surface-default shadow-sm md:flex">
        <button type="button" aria-label="Zoom in" onClick={() => map.zoomIn()} className={cn(controlButton, "min-h-0 flex-1")}>
          <Icon name="plus" className="size-5" />
        </button>
        <span className="h-px w-full bg-grey-200" />
        <button type="button" aria-label="Zoom out" onClick={() => map.zoomOut()} className={cn(controlButton, "min-h-0 flex-1")}>
          <Icon name="minus" className="size-5" />
        </button>
      </div>
    </div>
  );
}
