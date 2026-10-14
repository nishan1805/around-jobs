"use client";

import { Icon } from "@/components/icon";
import { GrabHandle, useSheetDrag } from "@/components/jobs/panels/panel-parts";
import { cn } from "@/lib/utils";

/** M00 "Search bar": 48px field plus a square Filters button, phones only. */
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
    <div className="pointer-events-auto flex gap-2 md:hidden">
      <label className="flex h-12 min-w-0 flex-1 items-center gap-2 rounded-md border bg-surface-default pr-3 pl-4 shadow-sm focus-within:border-brand-primary">
        <Icon name="search" className="size-5 text-text-primary" />
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
        className="relative flex size-12 shrink-0 items-center justify-center rounded-md border bg-surface-default text-text-primary shadow-sm outline-none focus-visible:ring-3 focus-visible:ring-brand-primary/40"
      >
        <Icon name="filters" className="size-5" />
        {filterCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 flex min-w-5 items-center justify-center rounded-full border-2 border-surface-default bg-brand-secondary px-1 text-label-medium text-text-on-brand">
            {filterCount}
          </span>
        )}
      </button>
    </div>
  );
}

/** M00 peek sheet: job count with a List button; swiping the handle up opens the list. */
export function MapPeek({ title, onOpenList, className }: { title: string; onOpenList: () => void; className?: string }) {
  const drag = useSheetDrag({ onUp: onOpenList });
  return (
    <div
      className={cn(
        "absolute inset-x-0 bottom-0 z-1000 flex h-35 flex-col rounded-t-lg bg-surface-default shadow-lg md:hidden",
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
          <p className="text-label-medium text-text-secondary">Sample listings · swipe up for list</p>
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
