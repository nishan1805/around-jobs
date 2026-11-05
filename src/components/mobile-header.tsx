"use client";

import Link from "next/link";

import { AccountButton } from "@/components/auth/account-button";
import { Icon } from "@/components/icon";
import { useUnreadCount } from "@/lib/alerts";

/**
 * Compact sticky bar for phones. Detail screens pass `backHref`.
 * Hidden from the tablet breakpoint up, where the desktop top bar stays.
 */
export function MobileHeader({
  title,
  backHref,
  backLabel = "Back",
  heading = true,
}: {
  title: string;
  backHref?: string;
  backLabel?: string;
  /** False when the screen already has its own visible heading, such as a job page. */
  heading?: boolean;
}) {
  const unread = useUnreadCount();
  const Title = heading ? "h1" : "p";
  return (
    <header className="sticky top-0 z-30 flex shrink-0 items-center gap-1 border-b bg-background-primary/95 px-2 pt-[env(safe-area-inset-top)] backdrop-blur-md md:hidden">
      {backHref ? (
        <Link
          href={backHref}
          aria-label={backLabel}
          className="flex size-11 items-center justify-center rounded-full text-text-primary active:bg-grey-100"
        >
          <Icon name="chevronLeft" className="size-5" />
        </Link>
      ) : (
        <span className="w-2" />
      )}
      <Title className="min-w-0 flex-1 truncate text-body-semibold text-text-primary">{title}</Title>
      <Link
        href="/alerts"
        aria-label={unread > 0 ? "Notifications, 1 unread" : "Notifications"}
        className="relative flex size-11 items-center justify-center rounded-full text-text-primary active:bg-grey-100"
      >
        <Icon name="bell" className="size-5" />
        {unread > 0 && <span className="absolute top-2.5 right-2.5 size-2 rounded-full bg-error-default" />}
      </Link>
      <AccountButton className="size-11" />
    </header>
  );
}
