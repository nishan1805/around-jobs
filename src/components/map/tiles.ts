/**
 * Basemap for the jobs map.
 *
 * The default is Esri World Street Map: a coloured street raster that works on
 * any domain without a key. Labels are baked into the tiles. Native detail
 * stops at zoom 17 around Raipur; higher zooms are Esri's "map data not yet
 * available" placeholder, so Leaflet upscales the last real tile.
 *
 * CARTO Voyager and Positron answer HTTP 200 but stamp "API KEY REQUIRED" on
 * the image, so they are not used.
 *
 * `NEXT_PUBLIC_MAP_TILE_URL` (or the older `NEXT_PUBLIC_MAP_TILES_URL`) replaces
 * the URL. A Stadia key uses Alidade Smooth when no URL is set.
 * `NEXT_PUBLIC_MAP_TILE_ATTRIBUTION` replaces the credit line.
 */

const esri = {
  url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
  labelsUrl: null as string | null,
  attribution:
    "Tiles &copy; Esri &mdash; Sources: Esri, HERE, Garmin, USGS, Intermap, INCREMENT P, NRCan, Esri Japan, METI, Esri China (Hong Kong), Esri Korea, Esri (Thailand), NGCC, &copy; OpenStreetMap contributors, and the GIS User Community",
  maxNativeZoom: 17,
};

const stadiaKey = process.env.NEXT_PUBLIC_STADIA_API_KEY;
const urlOverride = process.env.NEXT_PUBLIC_MAP_TILE_URL ?? process.env.NEXT_PUBLIC_MAP_TILES_URL;
const attributionOverride = process.env.NEXT_PUBLIC_MAP_TILE_ATTRIBUTION ?? process.env.NEXT_PUBLIC_MAP_TILES_ATTRIBUTION;

const stadia = stadiaKey
  ? {
      url: `https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png?api_key=${stadiaKey}`,
      labelsUrl: null as string | null,
      attribution:
        '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxNativeZoom: 20,
    }
  : null;

const chosen = urlOverride
  ? { url: urlOverride, labelsUrl: null as string | null, attribution: esri.attribution, maxNativeZoom: 20 }
  : (stadia ?? esri);

export const tileLayer = {
  url: chosen.url,
  /** Transparent place-name layer. Null when the base URL already includes labels. */
  labelsUrl: chosen.labelsUrl,
  attribution: attributionOverride ?? chosen.attribution,
  subdomains: "abc",
  maxZoom: 20,
  maxNativeZoom: chosen.maxNativeZoom,
};
