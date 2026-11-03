"use client";

import "leaflet/dist/leaflet.css";

import L from "leaflet";
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
  /** A plain pin for short map slots where the photo marker and label would be clipped. */
  compact?: boolean;
}) {
  const generation = useMapGeneration();
  return (
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
          html: companyMarkerHtml({ name, count: jobCount, selected: true }),
        })}
      />
      )}
    </MapContainer>
  );
}
