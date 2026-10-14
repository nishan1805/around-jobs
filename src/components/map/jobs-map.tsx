"use client";

import "leaflet/dist/leaflet.css";

import L, { type Map as LeafletMap } from "leaflet";
import { useEffect, useMemo, useState } from "react";
import { CircleMarker, MapContainer, Marker, TileLayer } from "react-leaflet";

import type { Company } from "@/lib/jobs";

import { MapControls } from "./map-controls";
import { clusterMarkerHtml, companyMarkerHtml } from "./markers";
import { tileLayer } from "./tiles";
import { useMapGeneration } from "./use-map-generation";

export type MapCompany = { company: Company; jobCount: number };

/** South-west and north-east corners of the visible map. */
export type MapView = [[number, number], [number, number]];

/** Bump `key` to fly the map so `positions` are all visible. */
export type FitRequest = { key: number; positions: [number, number][] };

type Cluster = { key: string; members: MapCompany[]; center: L.LatLng };

const CLUSTER_RADIUS_PX = 72;
const DEFAULT_ZOOM = 14;
const MIN_INITIAL_ZOOM = 13;

function clusterCompanies(map: LeafletMap, items: MapCompany[], zoom: number): Cluster[] {
  const clusters: { point: L.Point; members: MapCompany[] }[] = [];
  for (const item of items) {
    const point = map.project(item.company.position, zoom);
    const hit = clusters.find((cluster) => cluster.point.distanceTo(point) < CLUSTER_RADIUS_PX);
    if (hit) {
      hit.members.push(item);
      const n = hit.members.length;
      hit.point = hit.point.multiplyBy((n - 1) / n).add(point.divideBy(n));
    } else {
      clusters.push({ point, members: [item] });
    }
  }
  return clusters.map(({ point, members }) => ({
    key: members.map((m) => m.company.slug).join("|"),
    members,
    center: map.unproject(point, zoom),
  }));
}

export default function JobsMap({
  companies,
  initialBounds,
  center,
  selectedSlug,
  onSelectCompany,
  onViewChange,
  fitRequest,
  insetLeft = 0,
}: {
  companies: MapCompany[];
  initialBounds: [number, number][];
  center: [number, number];
  selectedSlug: string | null;
  onSelectCompany: (slug: string) => void;
  onViewChange?: (view: MapView) => void;
  fitRequest?: FitRequest | null;
  /** Pixels on the left covered by an overlay panel; the map keeps selections clear of it. */
  insetLeft?: number;
}) {
  const generation = useMapGeneration();
  const [map, setMap] = useState<LeafletMap | null>(null);
  const [zoom, setZoom] = useState<number | null>(null);
  const [tilesFailed, setTilesFailed] = useState(false);
  const [locating, setLocating] = useState(false);
  const [userPosition, setUserPosition] = useState<[number, number] | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    if (!map) return;
    const update = () => setZoom(map.getZoom());
    update();
    map.on("zoomend", update);
    return () => {
      map.off("zoomend", update);
    };
  }, [map]);

  useEffect(() => {
    if (!map) return;
    map.fitBounds(L.latLngBounds(initialBounds), {
      paddingTopLeft: [80, 140],
      paddingBottomRight: [80, 56],
      maxZoom: DEFAULT_ZOOM,
      animate: false,
    });
    if (map.getZoom() < MIN_INITIAL_ZOOM) map.setView(center, MIN_INITIAL_ZOOM, { animate: false });
    // Only frame the businesses once; later filter changes keep the user's viewport.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);

  useEffect(() => {
    if (!notice) return;
    const timeout = window.setTimeout(() => setNotice(null), 4000);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  useEffect(() => {
    if (!map || !onViewChange) return;
    const report = () => {
      const bounds = map.getBounds();
      onViewChange([
        [bounds.getSouth(), bounds.getWest()],
        [bounds.getNorth(), bounds.getEast()],
      ]);
    };
    report();
    map.on("moveend", report);
    return () => {
      map.off("moveend", report);
    };
  }, [map, onViewChange]);

  const selectedPosition = companies.find((item) => item.company.slug === selectedSlug)?.company.position;
  useEffect(() => {
    if (!map || !selectedPosition) return;
    map.panInside(selectedPosition, { paddingTopLeft: [insetLeft + 64, 160], paddingBottomRight: [64, 96] });
  }, [map, selectedPosition, insetLeft]);

  useEffect(() => {
    if (!map || !fitRequest || fitRequest.positions.length === 0) return;
    map.flyToBounds(L.latLngBounds(fitRequest.positions), {
      paddingTopLeft: [insetLeft + 64, 140],
      paddingBottomRight: [64, 56],
      maxZoom: DEFAULT_ZOOM,
    });
    // Only react to new requests, not to the panel opening or closing.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, fitRequest?.key]);

  const clusters = useMemo(() => (map && zoom !== null ? clusterCompanies(map, companies, zoom) : []), [map, companies, zoom]);

  const locate = () => {
    if (!map) return;
    if (!("geolocation" in navigator)) {
      setNotice("Location isn't available in this browser.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const position: [number, number] = [coords.latitude, coords.longitude];
        setUserPosition(position);
        map.flyTo(position, 15);
        setLocating(false);
      },
      () => {
        setNotice("We couldn't get your location, so we're showing Shankar Nagar.");
        map.flyTo(center, DEFAULT_ZOOM);
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 8000 },
    );
  };

  return (
    <div className="relative size-full">
      <MapContainer
        key={generation}
        ref={setMap}
        center={center}
        zoom={DEFAULT_ZOOM}
        minZoom={11}
        zoomControl={false}
        className="size-full"
      >
        <TileLayer
          url={tileLayer.url}
          attribution={tileLayer.attribution}
          subdomains={tileLayer.subdomains}
          maxZoom={tileLayer.maxZoom}
          eventHandlers={{ tileerror: () => setTilesFailed(true), tileload: () => setTilesFailed(false) }}
        />
        {clusters.map((cluster) => {
          if (cluster.members.length === 1) {
            const [{ company, jobCount }] = cluster.members;
            return (
              <Marker
                key={cluster.key}
                position={company.position}
                title={`${company.name}: ${jobCount} ${jobCount === 1 ? "job" : "jobs"}`}
                icon={L.divIcon({
                  className: "",
                  iconSize: [0, 0],
                  html: companyMarkerHtml({
                    name: company.name,
                    count: jobCount,
                    selected: company.slug === selectedSlug,
                  }),
                })}
                eventHandlers={{ click: () => onSelectCompany(company.slug) }}
              />
            );
          }
          const total = cluster.members.reduce((sum, member) => sum + member.jobCount, 0);
          return (
            <Marker
              key={cluster.key}
              position={cluster.center}
              title={`${total} jobs at ${cluster.members.length} places. Zoom in to see them.`}
              icon={L.divIcon({ className: "", iconSize: [0, 0], html: clusterMarkerHtml({ count: total }) })}
              eventHandlers={{
                click: () =>
                  map?.flyToBounds(L.latLngBounds(cluster.members.map((m) => m.company.position)), {
                    padding: [96, 96],
                    maxZoom: 17,
                  }),
              }}
            />
          );
        })}
        {userPosition && (
          <CircleMarker
            center={userPosition}
            radius={8}
            pathOptions={{ className: "fill-brand-primary stroke-surface-default", fillOpacity: 1, weight: 3 }}
          />
        )}
      </MapContainer>

      {map && (
        <MapControls
          map={map}
          onLocate={locate}
          locating={locating}
          className="absolute right-3 bottom-8 z-1000 md:right-5 md:bottom-9"
        />
      )}

      {(tilesFailed || notice) && (
        <p
          role="status"
          className="absolute bottom-24 left-1/2 z-1000 w-max max-w-[calc(100%-2rem)] -translate-x-1/2 rounded-full bg-grey-900 px-4 py-2 text-center text-body-sm-medium text-text-on-brand shadow-md md:bottom-9"
        >
          {notice ?? "Map tiles couldn't load. Job pins are still accurate."}
        </p>
      )}
    </div>
  );
}
