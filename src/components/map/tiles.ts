// Stadia "Alidade Smooth" is the closest match to the muted basemap in the Figma design.
// It works on localhost without a key; production needs a registered domain or API key.
const stadiaKey = process.env.NEXT_PUBLIC_STADIA_API_KEY;

export const tileLayer = {
  url:
    process.env.NEXT_PUBLIC_MAP_TILES_URL ??
    `https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png${stadiaKey ? `?api_key=${stadiaKey}` : ""}`,
  attribution:
    process.env.NEXT_PUBLIC_MAP_TILES_ATTRIBUTION ??
    '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: "abc",
  maxZoom: 20,
};
