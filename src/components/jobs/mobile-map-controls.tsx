"use client";

import Link from "next/link";

import { AccountButton } from "@/components/auth/account-button";
import { Icon } from "@/components/icon";
import { GrabHandle, useSheetDrag } from "@/components/jobs/panels/panel-parts";
import { useUnreadCount } from "@/lib/alerts";
import { POPULAR_AREAS } from "@/lib/seeker-design-seed";
import { cn } from "@/lib/utils";

/** Floating search pill plus a 48px Filters button. Phones only. */
export function MobileSearchBar({
  query,
  onQueryChange,
  filterCount,
  onOpenFilters,
}: {
  query: string;
  onQueryChange: (value: string) => void;
  filterCount: number;
  onOpenFilters: () => void;
}) {
  return (
    <div className="pointer-events-auto flex min-w-0 flex-1 gap-2">
      <label className="flex h-12 min-w-0 flex-1 items-center gap-2 rounded-full border bg-surface-default pr-3 pl-4 shadow-md focus-within:border-brand-primary">
        <Icon name="search" className="size-5 shrink-0 text-text-primary" />
        <span className="sr-only">Search jobs</span>
        <input
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search jobs, skills, companies"
          enterKeyHint="search"
          className="min-w-0 flex-1 bg-transparent text-body-sm-regular text-text-primary outline-none placeholder:text-text-tertiary [&::-webkit-search-cancel-button]:hidden"
        />
      </label>
      <button
        type="button"
        onClick={onOpenFilters}
        aria-label={filterCount ? `Filters, ${filterCount} applied` : "Filters"}
        className="relative flex size-12 shrink-0 items-center justify-center rounded-full border bg-surface-default text-text-primary shadow-md outline-none active:bg-grey-100 focus-visible:ring-3 focus-visible:ring-brand-primary/40"
      >
        <Icon name="filters" className="size-5" />
        {filterCount > 0 && (
          <span className="absolute -top-1 -right-1 flex min-w-5 items-center justify-center rounded-full border-2 border-surface-default bg-brand-secondary px-1 text-label-medium text-text-on-brand">
            {filterCount}
          </span>
        )}
      </button>
    </div>
  );
}

/** Bell and account, floating on the map so login and alerts stay one tap away. */
export function MapAccountCluster() {
  const unread = useUnreadCount();
  return (
    <div className="pointer-events-auto flex shrink-0 items-center gap-2">
      <Link
        href="/alerts"
        aria-label={unread > 0 ? "Notifications, 1 unread" : "Notifications"}
        className="relative flex size-12 items-center justify-center rounded-full border bg-surface-default text-text-primary shadow-md active:bg-grey-100"
      >
        <Icon name="bell" className="size-5" />
        {unread > 0 && <span className="absolute top-2.5 right-2.5 size-2.5 rounded-full border-2 border-surface-default bg-error-default" />}
      </Link>
      <AccountButton className="size-12 shadow-md" />
    </div>
  );
}

/** Area chip under the search pill. Opens the location sheet. */
export function LocationPill({ label, expanded, onClick }: { label: string; expanded: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label="Choose an area"
      aria-expanded={expanded}
      onClick={onClick}
      className="pointer-events-auto flex h-11 w-full items-center gap-2 rounded-full border bg-surface-default px-4 text-left text-body-sm-medium text-text-primary shadow-md active:bg-grey-100"
    >
      <Icon name="pin" className="size-5 shrink-0 text-brand-primary" />
      <span className="min-w-0 flex-1 truncate">{label}</span>
      <Icon name="chevronDown" className={cn("size-5 shrink-0 text-text-tertiary transition-transform", expanded && "rotate-180")} />
    </button>
  );
}

/** Bottom sheet of popular areas. Swipe the handle down to close. */
export function LocationSheet({
  open,
  area,
  onClose,
  onChoose,
  onUseCurrentLocation,
}: {
  open: boolean;
  area: string;
  onClose: () => void;
  onChoose: (label: string) => void;
  onUseCurrentLocation: () => void;
}) {
  const drag = useSheetDrag({ onDown: onClose });
  if (!open) return null;
  return (
    <div className="md:hidden">
      <button type="button" aria-label="Close area picker" className="fixed inset-0 z-50 bg-overlay-scrim" onClick={onClose} />
      <section
        role="dialog"
        aria-label="Choose an area"
        className="fixed inset-x-0 bottom-0 z-50 flex max-h-[85dvh] flex-col rounded-t-xl bg-surface-default pb-[max(1rem,env(safe-area-inset-bottom))] shadow-xl"
        style={drag.offset > 0 ? { transform: `translateY(${drag.offset}px)` } : undefined}
      >
        <GrabHandle {...drag.handlers} />
        <div className="flex items-center gap-2 px-5 pb-3">
          <h2 className="min-w-0 flex-1 text-heading-semibold text-text-primary">Choose an area</h2>
        </div>
        <div className="flex flex-col gap-2 overflow-y-auto px-5 pb-4">
          <p className="text-body-sm-regular text-text-secondary">Distances and the job list update from the area you pick.</p>
          <button
            type="button"
            onClick={onUseCurrentLocation}
            className="flex h-12 w-full items-center gap-2 rounded-xl border bg-grey-50 px-3 text-body-sm-medium text-text-primary active:bg-grey-100"
          >
            <Icon name="gpsFix" className="size-5" />
            Use my current location
          </button>
          <p className="pt-2 text-label-medium text-text-tertiary">Popular areas</p>
          {POPULAR_AREAS.map((item) => {
            const selected = item === area;
            return (
              <button
                key={item}
                type="button"
                aria-pressed={selected}
                onClick={() => onChoose(item)}
                className={cn(
                  "flex h-12 w-full items-center gap-2 rounded-xl px-3 text-left text-body-sm-medium text-text-primary active:bg-grey-100",
                  selected ? "bg-primary-50 text-brand-primary" : "bg-surface-default",
                )}
              >
                <Icon name="pin" className={cn("size-5", selected ? "text-brand-primary" : "text-text-tertiary")} />
                {item}
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}

/** M00 peek sheet: job count with a List button; swiping the handle up opens the list. */
export function MapPeek({ title, onOpenList, className }: { title: string; onOpenList: () => void; className?: string }) {
  const drag = useSheetDrag({ onUp: onOpenList });
  return (
    <div
      className={cn(
        "absolute inset-x-0 bottom-0 z-1000 flex h-35 flex-col rounded-t-xl bg-surface-default shadow-lg md:hidden",
        className,
      )}
      style={drag.offset < 0 ? { transform: `translateY(${Math.max(drag.offset, -80)}px)` } : undefined}
    >
      <GrabHandle {...drag.handlers} />
      <div className="flex items-center gap-3 px-5 pt-1">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <p aria-live="polite" className="text-body-semibold text-text-primary">
            {title}
          </p>
          <p className="text-label-medium text-text-secondary">Swipe up for the list</p>
        </div>
        <button
          type="button"
          onClick={onOpenList}
          className="flex h-11 shrink-0 items-center gap-2 rounded-full border bg-surface-default px-4 text-body-sm-semibold text-text-primary outline-none hover:bg-grey-100 focus-visible:ring-3 focus-visible:ring-brand-primary/40"
        >
          <Icon name="list" className="size-5" />
          List
        </button>
      </div>
    </div>
  );
}
