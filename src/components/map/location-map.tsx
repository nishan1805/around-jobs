"use client";

import "leaflet/dist/leaflet.css";

import L from "leaflet";
import { useState } from "react";
import { CircleMarker, MapContainer, Marker, TileLayer } from "react-leaflet";

import { companyMarkerHtml } from "./markers";
import { tileLayer } from "./tiles";
import { useMapGeneration } from "./use-map-generation";

export default function LocationMap({
  position,
  name,
  jobCount,
  compact = false,
}: {
  position: [number, number];
  name: string;
  jobCount: number;
  /** A plain dot for short map slots where the company marker would be clipped. */
  compact?: boolean;
}) {
  const generation = useMapGeneration();
  const [failed, setFailed] = useState(false);
  return (
    <div className="relative size-full">
    <MapContainer
      key={generation}
      center={position}
      zoom={compact ? 16 : 15}
      dragging={!compact}
      scrollWheelZoom={false}
      zoomControl={false}
      className="size-full"
    >
      <TileLayer
        url={tileLayer.url}
        attribution={tileLayer.attribution}
        subdomains={tileLayer.subdomains}
        maxZoom={tileLayer.maxZoom}
        maxNativeZoom={tileLayer.maxNativeZoom}
        eventHandlers={{ tileerror: () => setFailed(true), tileload: () => setFailed(false) }}
      />
      {tileLayer.labelsUrl && (
        <TileLayer url={tileLayer.labelsUrl} maxZoom={tileLayer.maxZoom} maxNativeZoom={tileLayer.maxNativeZoom} />
      )}
      {compact ? (
        <CircleMarker
          center={position}
          radius={9}
          interactive={false}
          pathOptions={{ className: "fill-brand-primary stroke-surface-default", fillOpacity: 1, weight: 3 }}
        />
      ) : (
      <Marker
        position={position}
        interactive={false}
        icon={L.divIcon({
          className: "",
          iconSize: [0, 0],
          html: companyMarkerHtml({ name, count: jobCount }),
        })}
      />
      )}
    </MapContainer>
    {failed && (
      <p className="absolute inset-0 z-500 flex items-center justify-center bg-[#e6e1d3] px-4 text-center text-label-medium text-text-secondary">
        Map preview unavailable
      </p>
    )}
    </div>
  );
}
