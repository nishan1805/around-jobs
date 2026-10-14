export const tileLayer = {
  url: process.env.NEXT_PUBLIC_MAP_TILES_URL ?? "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
  attribution:
    process.env.NEXT_PUBLIC_MAP_TILES_ATTRIBUTION ??
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  subdomains: "abcd",
  maxZoom: 19,
};
