"use client";

import { useEffect, useState } from "react";

/**
 * react-leaflet destroys its Leaflet map in an effect cleanup and never recreates it.
 * Next.js keeps visited routes alive in a hidden <Activity>, which runs those cleanups,
 * so use the returned value as the MapContainer `key` to get a fresh map when the
 * route becomes visible again.
 */
export function useMapGeneration() {
  const [generation, setGeneration] = useState(0);
  useEffect(() => () => setGeneration((value) => value + 1), []);
  return generation;
}
