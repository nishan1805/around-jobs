import type { MetadataRoute } from "next";

/** Home-screen install. No service worker, so auth stays out of any offline cache. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "around jobs",
    short_name: "around",
    description: "Local jobs near you in Raipur.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0163ff",
    icons: [
      { src: "/icons/pwa-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/pwa-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/pwa-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
