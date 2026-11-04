"use client";

import dynamic from "next/dynamic";

export type { FitRequest, MapCompany, MapFocus, MapView } from "./jobs-map";

export function MapSkeleton() {
  return (
    <div role="status" className="flex size-full items-center justify-center bg-grey-100">
      <span className="flex items-center gap-2 rounded-full bg-surface-default px-4 py-2 text-body-sm-medium text-text-secondary shadow-sm">
        <span className="size-2 animate-pulse rounded-full bg-brand-primary" />
        Loading map…
      </span>
    </div>
  );
}

// Leaflet touches `window` on import, so it is only ever loaded in the browser.
export const JobsMap = dynamic(() => import("./jobs-map"), {
  ssr: false,
  loading: MapSkeleton,
});

export const LocationMap = dynamic(() => import("./location-map"), {
  ssr: false,
  loading: MapSkeleton,
});
