import { icons } from "@/components/icon";

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (char) => `&#${char.charCodeAt(0)};`);

// Leaflet anchors a zero-size div icon at the coordinate; the markup is shifted
// so the caret tip (72px below the top of the 62px pin head) sits on the point.
export function companyMarkerHtml({ name, count, selected }: { name: string; count: number; selected: boolean }) {
  return `
<div class="group absolute top-0 left-0 flex -translate-x-1/2 -translate-y-18 cursor-pointer flex-col items-center" data-selected="${selected}">
  <div class="relative size-15.5">
    <img alt="" src="/icons/marker-photo.svg" class="absolute -top-px -left-0.5 size-15 max-w-none" />
    <span aria-hidden="true" style="--icon:url(${icons.briefcase})" class="absolute top-4.5 left-4.5 size-5 bg-text-primary mask-(--icon) mask-contain mask-center mask-no-repeat"></span>
    <span class="absolute -top-1 left-9.5 flex min-w-5 items-center justify-center rounded-full border-2 border-surface-default bg-brand-secondary px-1.5 py-0.5 text-label-medium text-text-on-brand">${count}</span>
  </div>
  <img alt="" src="/icons/marker-caret.svg" class="h-2.5 w-3.5" />
  <span class="rounded-full bg-surface-default px-2.5 py-1.25 text-label-semibold whitespace-nowrap text-text-primary shadow-sm transition-colors group-hover:bg-primary-50 group-data-[selected=true]:bg-brand-primary group-data-[selected=true]:text-text-on-brand">${escapeHtml(name)}</span>
</div>`;
}

export function clusterMarkerHtml({ count }: { count: number }) {
  return `
<div class="absolute top-0 left-0 flex size-14 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-3 border-surface-default bg-brand-primary text-body-sm-semibold text-text-on-brand shadow-sm transition-transform hover:scale-105">${count}</div>`;
}
