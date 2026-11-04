/**
 * Basemap for the jobs map.
 *
 * The default is CyclOSM: a free, keyless, coloured street style (parks, water,
 * roads) with labels baked in. A tile at z12 is a real PNG of about 40KB.
 *
 * Drop a key in later without changing the map code:
 * - `NEXT_PUBLIC_STADIA_API_KEY` uses Stadia OSM Bright.
 * - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` uses Google roadmap tiles.
 * - `NEXT_PUBLIC_MAP_TILE_URL` (or `NEXT_PUBLIC_MAP_TILES_URL`) replaces the URL.
 * `NEXT_PUBLIC_MAP_TILE_ATTRIBUTION` replaces the credit line.
 *
 * If CyclOSM is unreachable, the no-key stand-in is Esri World Street Map
 * (`.../MapServer/tile/{z}/{y}/{x}` — note y then x).
 */

type TileSource = {
  url: string;
  labelsUrl: string | null;
  attribution: string;
  maxNativeZoom: number;
  subdomains: string;
};

const cyclosm: TileSource = {
  url: "https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png",
  labelsUrl: null,
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.cyclosm.org">CyclOSM</a> hosted by <a href="https://openstreetmap.fr/">OpenStreetMap France</a>',
  maxNativeZoom: 20,
  subdomains: "abc",
};

const stadiaKey = process.env.NEXT_PUBLIC_STADIA_API_KEY?.trim();
const googleKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim();
const urlOverride = process.env.NEXT_PUBLIC_MAP_TILE_URL ?? process.env.NEXT_PUBLIC_MAP_TILES_URL;
const attributionOverride = process.env.NEXT_PUBLIC_MAP_TILE_ATTRIBUTION ?? process.env.NEXT_PUBLIC_MAP_TILES_ATTRIBUTION;

const stadia: TileSource | null = stadiaKey
  ? {
      url: `https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png?api_key=${stadiaKey}`,
      labelsUrl: null,
      attribution:
        '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxNativeZoom: 20,
      subdomains: "abc",
    }
  : null;

const google: TileSource | null = googleKey
  ? {
      url: `https://mt1.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}&key=${googleKey}`,
      labelsUrl: null,
      attribution: "Map data &copy; Google",
      maxNativeZoom: 20,
      subdomains: "abc",
    }
  : null;

const override: TileSource | null = urlOverride
  ? { url: urlOverride, labelsUrl: null, attribution: cyclosm.attribution, maxNativeZoom: 20, subdomains: "abc" }
  : null;

const chosen = override ?? google ?? stadia ?? cyclosm;

export const tileLayer = {
  url: chosen.url,
  /** Transparent place-name layer. Null when the base URL already includes labels. */
  labelsUrl: chosen.labelsUrl,
  attribution: attributionOverride ?? chosen.attribution,
  subdomains: chosen.subdomains,
  maxZoom: 20,
  maxNativeZoom: chosen.maxNativeZoom,
};
