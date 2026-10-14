"use client";

import "leaflet/dist/leaflet.css";

import L from "leaflet";
import { MapContainer, Marker, TileLayer } from "react-leaflet";

import { companyMarkerHtml } from "./markers";
import { tileLayer } from "./tiles";
import { useMapGeneration } from "./use-map-generation";

export default function LocationMap({
  position,
  name,
  jobCount,
}: {
  position: [number, number];
  name: string;
  jobCount: number;
}) {
  const generation = useMapGeneration();
  return (
    <MapContainer
      key={generation}
      center={position}
      zoom={15}
      scrollWheelZoom={false}
      zoomControl={false}
      className="size-full"
    >
      <TileLayer
        url={tileLayer.url}
        attribution={tileLayer.attribution}
        subdomains={tileLayer.subdomains}
        maxZoom={tileLayer.maxZoom}
      />
      <Marker
        position={position}
        interactive={false}
        icon={L.divIcon({
          className: "",
          iconSize: [0, 0],
          html: companyMarkerHtml({ name, count: jobCount, selected: true }),
        })}
      />
    </MapContainer>
  );
}
