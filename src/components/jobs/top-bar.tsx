"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { Wordmark } from "@/components/app-shell";
import { AccountButton } from "@/components/auth/account-button";
import { Icon } from "@/components/icon";
import { breakpoints, useMediaQuery } from "@/hooks/use-media-query";

export const DEFAULT_LOCATION_LABEL = "Shankar Nagar, Raipur";

/**
 * Figma "Around / Top Bar". On the map the query filters jobs live; on other pages
 * (no `onQueryChange`) pressing Enter opens the map with `?q=`.
 */
export function TopBar({
  query: controlledQuery,
  onQueryChange,
  locationLabel = DEFAULT_LOCATION_LABEL,
}: {
  query?: string;
  onQueryChange?: (value: string) => void;
  locationLabel?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const isTablet = useMediaQuery(breakpoints.md);
  const router = useRouter();
  const [localQuery, setLocalQuery] = useState("");
  const query = controlledQuery ?? localQuery;
  const setQuery = onQueryChange ?? setLocalQuery;

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <header className="hidden h-18 shrink-0 items-center gap-4 border-b bg-background-primary px-6 md:flex">
      <Wordmark className="md:hidden" />
      <label className="flex h-10 min-w-0 flex-1 items-center gap-2.5 rounded-full border bg-grey-100 pr-3 pl-3.5 transition-colors focus-within:border-brand-primary focus-within:bg-surface-default">
        <Icon name="search" className="text-text-disabled" />
        <span className="sr-only">Search jobs</span>
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
          placeholder={isTablet ? "Search places, restaurants, events, offers..." : "Search jobs nearby"}
          className="min-w-0 flex-1 bg-transparent text-body-regular text-text-primary outline-none placeholder:text-text-tertiary [&::-webkit-search-cancel-button]:hidden"
        />
        <kbd className="hidden shrink-0 rounded-xs border bg-surface-default px-2 py-1 font-sans text-label-medium text-text-tertiary md:block">
          ⌘ K
        </kbd>
      </label>
      <div className="flex shrink-0 items-center gap-2 md:gap-4">
        <button
          type="button"
          className="hidden h-9 items-center gap-2 rounded-full border bg-surface-default px-3 text-body-sm-medium text-text-primary shadow-md transition-colors hover:bg-grey-100 md:flex"
        >
          <Icon name="pin" className="size-4 text-brand-primary" />
          {locationLabel}
          <Icon name="chevronDown" className="size-3.5 text-text-tertiary" />
        </button>
        <button type="button" aria-label="Notifications, 1 unread" className="hidden rounded-full hover:bg-grey-100 sm:block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icons/notifications.svg" alt="" className="size-10" />
        </button>
        <AccountButton />
      </div>
    </header>
  );
}
