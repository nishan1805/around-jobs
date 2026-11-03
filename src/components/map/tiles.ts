/**
 * Basemap for the jobs map.
 *
 * The default is the OpenStreetMap standard style: green parks, blue water,
 * and white or yellow roads, with no API key. Labels are baked into the tiles.
 * The OSMF tile policy allows this on a public site when traffic stays light,
 * the tile URL is exactly `tile.openstreetmap.org/{z}/{x}/{y}.png`, the
 * copyright line stays visible, and the browser sends its usual Referer.
 * A tile requested with Referer `https://around-jobs.vercel.app/` returns 200.
 *
 * Drop a key in later without changing the map code:
 * - `NEXT_PUBLIC_STADIA_API_KEY` uses Stadia OSM Bright.
 * - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` uses Google roadmap tiles.
 * - `NEXT_PUBLIC_MAP_TILE_URL` (or `NEXT_PUBLIC_MAP_TILES_URL`) replaces the URL.
 * `NEXT_PUBLIC_MAP_TILE_ATTRIBUTION` replaces the credit line.
 */

type TileSource = {
  url: string;
  labelsUrl: string | null;
  attribution: string;
  maxNativeZoom: number;
};

const osm: TileSource = {
  url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
  labelsUrl: null,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  maxNativeZoom: 19,
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
    }
  : null;

const google: TileSource | null = googleKey
  ? {
      url: `https://mt1.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}&key=${googleKey}`,
      labelsUrl: null,
      attribution: "Map data &copy; Google",
      maxNativeZoom: 20,
    }
  : null;

const override: TileSource | null = urlOverride
  ? { url: urlOverride, labelsUrl: null, attribution: osm.attribution, maxNativeZoom: 20 }
  : null;

const chosen = override ?? google ?? stadia ?? osm;

export const tileLayer = {
  url: chosen.url,
  /** Transparent place-name layer. Null when the base URL already includes labels. */
  labelsUrl: chosen.labelsUrl,
  attribution: attributionOverride ?? chosen.attribution,
  subdomains: "abc",
  maxZoom: 20,
  maxNativeZoom: chosen.maxNativeZoom,
};
