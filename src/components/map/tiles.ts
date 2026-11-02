/**
 * Basemap for the jobs map.
 *
 * CARTO Positron (`light_all`) is the closest named match to the Figma frame,
 * but the keyless CDN now returns HTTP 200 tiles stamped "API KEY REQUIRED".
 * The default is Esri's World Light Gray Canvas, a muted grey raster that works
 * on any domain without a key, plus its transparent label layer. It stops at
 * zoom 16; Leaflet upscales that tile if the map zooms further.
 *
 * `NEXT_PUBLIC_MAP_TILE_URL` (or the older `NEXT_PUBLIC_MAP_TILES_URL`) replaces
 * the URL. A Stadia key uses Alidade Smooth when no URL is set.
 * `NEXT_PUBLIC_MAP_TILE_ATTRIBUTION` replaces the credit line.
 */

const esri = {
  url: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
  labelsUrl:
    "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}",
  attribution: "Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ",
  maxNativeZoom: 16,
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
