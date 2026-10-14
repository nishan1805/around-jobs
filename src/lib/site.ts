export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:4612").replace(/\/$/, "");

export const absoluteUrl = (path: string) => `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
