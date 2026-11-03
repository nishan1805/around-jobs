"use client";

import type { Map as LeafletMap } from "leaflet";
import { useEffect, useState, type CSSProperties } from "react";

import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";

const EARTH_CIRCUMFERENCE_M = 40075016.686;
const MAX_SCALE_BAR_PX = 64;

function niceDistance(meters: number) {
  const magnitude = 10 ** Math.floor(Math.log10(meters));
  const step = [5, 2, 1].find((candidate) => candidate * magnitude <= meters) ?? 1;
  return step * magnitude;
}

function useScale(map: LeafletMap) {
  const compute = () => {
    const metersPerPixel =
      (EARTH_CIRCUMFERENCE_M * Math.cos((map.getCenter().lat * Math.PI) / 180)) / 2 ** (map.getZoom() + 8);
    const meters = niceDistance(metersPerPixel * MAX_SCALE_BAR_PX);
    return {
      label: meters >= 1000 ? `${meters / 1000} km` : `${meters} m`,
      width: Math.round(meters / metersPerPixel),
    };
  };
  const [scale, setScale] = useState(compute);
  useEffect(() => {
    const update = () => setScale(compute());
    map.on("zoomend moveend", update);
    return () => {
      map.off("zoomend moveend", update);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);
  return scale;
}

const controlButton =
  "flex items-center justify-center bg-surface-default text-grey-700 transition-colors hover:bg-grey-100 focus-visible:outline-2 focus-visible:-outline-offset-2 disabled:text-text-disabled";

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
  const scale = useScale(map);

  return (
    <div className={cn("pointer-events-none flex flex-col items-end gap-3", className)} style={style}>
      <button
        type="button"
        onClick={onLocate}
        disabled={locating}
        aria-label="Show my location"
        className={cn(controlButton, "pointer-events-auto size-11 rounded-full border shadow-sm")}
      >
        <Icon name="crosshair" className={cn(locating && "animate-spin")} />
      </button>
      <div className="pointer-events-auto hidden flex-col overflow-hidden rounded-xl border shadow-sm md:flex">
        <button type="button" aria-label="Zoom in" onClick={() => map.zoomIn()} className={cn(controlButton, "size-11")}>
          <Icon name="plus" className="size-5" />
        </button>
        <span className="h-px w-11 bg-border-default" />
        <button type="button" aria-label="Zoom out" onClick={() => map.zoomOut()} className={cn(controlButton, "size-11")}>
          <Icon name="minus" className="size-5" />
        </button>
      </div>
      <div className="flex items-center gap-2 rounded-sm bg-surface-default px-2 py-1.5" aria-label={`Map scale ${scale.label}`}>
        <span className="text-label-semibold text-text-primary">{scale.label}</span>
        <span className="h-0.5 bg-text-primary" style={{ width: scale.width }} />
      </div>
    </div>
  );
}
