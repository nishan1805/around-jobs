"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

import { AccountButton } from "@/components/auth/account-button";
import { useAuth } from "@/components/auth/auth-provider";
import { Icon } from "@/components/icon";
import { useSearchParam } from "@/hooks/use-search-param";
import { useUnreadCount } from "@/lib/alerts";
import { POPULAR_AREAS, SEARCH_PLACEHOLDER } from "@/lib/seeker-design-seed";
import { cn } from "@/lib/utils";

export const DEFAULT_LOCATION_LABEL = "Pandri, Raipur";

/**
 * Job-seeker top bar from the finalized Around Jobs frames.
 * Logged-out jobs home includes "Post a job". Logged-in screens drop it.
 * `?location=open` previews the location menu (S04).
 */
export function TopBar({
  query: controlledQuery,
  onQueryChange,
  locationLabel = DEFAULT_LOCATION_LABEL,
  onLocationChange,
  onUseCurrentLocation,
  showFinder = false,
}: {
  query?: string;
  onQueryChange?: (value: string) => void;
  locationLabel?: string;
  onLocationChange?: (label: string) => void;
  onUseCurrentLocation?: () => void;
  /** Search and area picker stay on the jobs map. Other menus keep the account cluster only. */
  showFinder?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const notificationsActive = usePathname() === "/alerts";
  const { user } = useAuth();
  const unread = useUnreadCount();
  const locationParam = useSearchParam("location");
  const [localQuery, setLocalQuery] = useState("");
  const [locationOpen, setLocationOpen] = useState(false);
  const [seenLocation, setSeenLocation] = useState<string | null>(null);
  const [area, setArea] = useState(locationLabel);
  const listId = useId();
  const query = controlledQuery ?? localQuery;
  const setQuery = onQueryChange ?? setLocalQuery;

  if (locationParam !== seenLocation) {
    setSeenLocation(locationParam);
    if (locationParam === "open") setLocationOpen(true);
  }

  useEffect(() => {
    const onShortcut = (event: KeyboardEvent) => {
      const target = event.target;
      if (event.defaultPrevented || event.key !== "/" || event.metaKey || event.altKey || event.ctrlKey) return;
      if (target instanceof HTMLElement && (target.isContentEditable || target.closest("input, textarea, select, [role=dialog], [role=menu]"))) return;
      if (!inputRef.current?.getClientRects().length) return;
      event.preventDefault();
      inputRef.current.focus();
    };
    window.addEventListener("keydown", onShortcut);
    return () => window.removeEventListener("keydown", onShortcut);
  }, []);

  useEffect(() => {
    if (!locationOpen) return;
    const onPointer = (event: MouseEvent) => {
      if (!locationRef.current?.contains(event.target as Node)) setLocationOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLocationOpen(false);
    };
    window.addEventListener("mousedown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [locationOpen]);

  if (area !== locationLabel && !locationOpen) setArea(locationLabel);

  const chooseArea = (next: string) => {
    setArea(next);
    onLocationChange?.(next);
    setLocationOpen(false);
  };

  return (
    <header className="hidden shrink-0 items-center justify-end h-[72px] gap-4 border-b bg-background-primary px-6 py-3 md:flex">
      {showFinder && <div className="flex min-w-0 flex-1 items-center gap-4">
        <label className="flex h-12 w-[383px] min-w-0 shrink items-center gap-2 rounded-full border border-grey-200 bg-grey-50 px-3 transition-colors focus-within:border-brand-primary focus-within:bg-surface-default">
          <Icon name="search" className="size-6 shrink-0 text-text-tertiary" />
          <span className="sr-only">Search</span>
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (onQueryChange || event.key !== "Enter") return;
              const value = query.trim();
              router.push(value ? `/?q=${encodeURIComponent(value)}` : "/");
            }}
            enterKeyHint="search"
            placeholder={SEARCH_PLACEHOLDER}
            className="w-full min-w-0 bg-transparent text-body-regular text-text-primary outline-none placeholder:text-text-tertiary [&::-webkit-search-cancel-button]:hidden"
          />
          <kbd aria-hidden="true" className="hidden h-[26px] w-[42px] shrink-0 items-center justify-center rounded-[6px] border bg-surface-default font-sans text-label-medium text-text-tertiary lg:inline-flex">
            /
          </kbd>
        </label>

        <div ref={locationRef} className="relative shrink-0">
          <button
            type="button"
            aria-expanded={locationOpen}
            aria-controls={listId}
            onClick={() => setLocationOpen((open) => !open)}
            className="flex h-10 w-[239px] items-center justify-between gap-4 rounded-full border bg-surface-default px-3 text-body-sm-medium text-grey-600 transition-colors hover:bg-grey-50"
          >
            <span className="flex min-w-0 items-center gap-2">
              <Icon name="pin" className="size-5 text-brand-primary" />
              <span className="truncate">{area}</span>
            </span>
            <Icon name="chevronDown" className={cn("size-5 shrink-0 text-text-tertiary transition-transform", locationOpen && "rotate-180")} />
          </button>
          {locationOpen && (
            <div
              id={listId}
              role="listbox"
              aria-label="Popular areas"
              className="absolute top-[calc(100%+8px)] right-0 z-50 flex w-[min(340px,calc(100vw-8rem))] flex-col gap-3 rounded-lg border bg-surface-default p-3 shadow-lg min-[80rem]:w-[340px]"
            >
              <button
                type="button"
                onClick={() => {
                  setLocationOpen(false);
                  if (onUseCurrentLocation) onUseCurrentLocation();
                  else chooseArea(DEFAULT_LOCATION_LABEL);
                }}
                className="flex w-full items-center gap-2 rounded-md border border-grey-200 bg-grey-100 px-3 py-2 text-body-sm-medium text-grey-700 hover:bg-grey-200"
              >
                <Icon name="gpsFix" className="size-5" />
                Use my current location
              </button>
              <div className="flex flex-col gap-2">
                <p className="text-label-medium text-text-tertiary">Popular areas</p>
                <div className="flex flex-col gap-1">
                  {POPULAR_AREAS.map((item) => {
                    const selected = item === area;
                    return (
                      <button
                        key={item}
                        type="button"
                        role="option"
                        aria-selected={selected}
                        onClick={() => chooseArea(item)}
                        className={cn(
                          "flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-body-sm-medium text-text-primary hover:bg-grey-50",
                          selected && "bg-primary-50",
                        )}
                      >
                        <Icon name="pin" className={cn("size-5", selected ? "text-brand-primary" : "text-text-tertiary")} />
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>}

      <div className="flex shrink-0 items-center gap-4">
        {!user && (
          <Link
            href="/post-a-job"
            className="inline-flex h-10 w-[132px] items-center justify-center gap-2 rounded-[8px] border border-primary-600 px-3 text-body-sm-semibold text-primary-600 transition-colors hover:bg-primary-50"
          >
            <Icon name="plusSquare" className="size-4" />
            Post
          </Link>
        )}
        <div className="flex items-center gap-3">
          <Link
            href="/alerts"
            aria-label={unread > 0 ? "Notifications, 1 unread" : "Notifications"}
            aria-current={notificationsActive ? "page" : undefined}
            className={cn("relative flex size-10 items-center justify-center rounded-full border border-grey-300 transition-colors", notificationsActive ? "border-primary-200 bg-primary-50 text-primary-600" : "bg-surface-default text-text-primary hover:bg-grey-50")}
          >
            <Icon name="bellOutline" className="size-5" />
            {unread > 0 && <span className="absolute top-[9px] left-[21px] size-2 rounded-full bg-error-default" />}
          </Link>
          <AccountButton />
        </div>
      </div>
    </header>
  );
}
