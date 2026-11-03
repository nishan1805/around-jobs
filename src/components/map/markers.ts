import { icons } from "@/components/icon";

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (char) => `&#${char.charCodeAt(0)};`);

// Leaflet anchors a zero-size div icon at the coordinate. The teardrop is 65px
// tall, so shifting by that amount puts its tip on the point. The name sits
// directly under the tip (Figma 1888:42397, path 2034:21664).
export function companyMarkerHtml({ name, count }: { name: string; count: number }) {
  return `
<div class="absolute top-0 left-0 flex w-[111px] -translate-x-1/2 -translate-y-[65px] cursor-pointer flex-col items-center">
  <div class="relative h-[65px] w-[62px]">
    <img alt="" src="/icons/marker-pin.svg" width="56" height="65" class="absolute top-0 left-[3px] max-w-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.06)]" />
    <span aria-hidden="true" style="--icon:url(${icons.briefcase})" class="absolute top-4.5 left-4.5 size-5 bg-text-primary mask-(--icon) mask-contain mask-center mask-no-repeat"></span>
    ${count > 0 ? `<span class="absolute -top-1 left-9.5 flex min-w-5 items-center justify-center rounded-full border-2 border-surface-default bg-brand-secondary px-1.5 py-0.5 text-label-medium text-text-on-brand">${count}</span>` : ""}
  </div>
  <span class="w-full rounded-full bg-surface-default px-2.5 py-1.25 text-center text-label-semibold whitespace-nowrap text-text-primary shadow-sm">${escapeHtml(name)}</span>
</div>`;
}

/** Figma cluster 1896:13452. The circle's centre sits on the coordinate. */
export function clusterMarkerHtml({ count }: { count: number }) {
  return `
<div class="absolute top-0 left-0 flex size-14 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-3 border-surface-default bg-brand-primary text-body-sm-semibold text-text-on-brand shadow-sm">${count}</div>`;
}
