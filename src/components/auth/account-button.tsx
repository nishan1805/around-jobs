"use client";

import { Menu } from "@base-ui/react/menu";
import Link from "next/link";
import { useState } from "react";

import { Icon } from "@/components/icon";
import { useSearchParam } from "@/hooks/use-search-param";
import { authActions } from "@/lib/auth-store";
import { PROFILE_COMPLETION, PROFILE_DISPLAY_NAME } from "@/lib/seeker-design-seed";

import { useAuth } from "./auth-provider";

const itemClass =
  "flex w-full cursor-default items-center gap-3 rounded-sm px-3 py-2.5 text-body-sm-medium text-text-primary outline-none data-highlighted:bg-grey-100";

/**
 * Logged out: grey profile glyph (S00). Logged in: blue initial on the trigger;
 * the open menu uses a 64px grey-200 initial, with the progress bar on its own row (S07).
 * `?menu=open` keeps the menu open for the profile-menu frame.
 */
export function AccountButton() {
  const { user, openLogin } = useAuth();
  const menuParam = useSearchParam("menu");
  const [open, setOpen] = useState(false);
  const [seen, setSeen] = useState<string | null>(null);
  if (menuParam !== seen) {
    setSeen(menuParam);
    if (menuParam === "open") setOpen(true);
  }

  if (!user) {
    return (
      <button
        type="button"
        aria-label="Log in"
        onClick={openLogin}
        className="flex size-10 items-center justify-center rounded-full bg-grey-200 text-grey-600 outline-none hover:bg-grey-300 focus-visible:ring-3 focus-visible:ring-brand-primary/40"
      >
        <Icon name="user" className="size-5" />
      </button>
    );
  }

  const initial = PROFILE_DISPLAY_NAME.trim().charAt(0).toUpperCase();

  return (
    <>
      <Menu.Root open={open} onOpenChange={setOpen}>
        <Menu.Trigger
          aria-label={`Account menu for ${PROFILE_DISPLAY_NAME}`}
          className="flex size-10 items-center justify-center rounded-full border border-primary-200 bg-primary-100 text-heading-semibold leading-none text-primary-700 outline-none focus-visible:ring-3 focus-visible:ring-brand-primary/40"
        >
          {initial}
        </Menu.Trigger>
        <Menu.Portal>
          <Menu.Positioner sideOffset={8} align="end" className="z-50">
            <Menu.Popup className="w-[300px] rounded-xl border bg-surface-elevated p-3 shadow-lg outline-none">
              <div className="flex items-center gap-3 px-1 pb-3">
                <span className="flex size-16 shrink-0 items-center justify-center rounded-full bg-grey-200 text-heading-semibold leading-none text-text-primary">
                  {initial}
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-2">
                  <span className="truncate text-body-semibold text-text-primary">{PROFILE_DISPLAY_NAME}</span>
                  <span className="flex items-center justify-between gap-3">
                    <span className="text-body-sm-regular text-text-secondary">Profile completion</span>
                    <span className="text-body-sm-semibold text-brand-primary">{PROFILE_COMPLETION}%</span>
                  </span>
                  <span className="h-2 w-full overflow-hidden rounded-full bg-grey-200">
                    <span className="block h-full rounded-full bg-brand-primary" style={{ width: `${PROFILE_COMPLETION}%` }} />
                  </span>
                </span>
              </div>
              <Menu.Item className={itemClass} render={<Link href="/profile" />}>
                <Icon name="user" className="size-5 text-text-secondary" />
                <span className="flex-1">Profile settings</span>
                <Icon name="chevronRight" className="size-4 text-text-tertiary" />
              </Menu.Item>
              <Menu.Item className={itemClass} render={<Link href="/alerts" />}>
                <Icon name="bell" className="size-5 text-text-secondary" />
                <span className="flex-1">Job alerts</span>
                <Icon name="chevronRight" className="size-4 text-text-tertiary" />
              </Menu.Item>
              <Menu.Item className={itemClass} render={<a href="mailto:support@around.jobs" />}>
                <Icon name="help" className="size-5 text-text-secondary" />
                <span className="flex-1">Help & support</span>
                <Icon name="chevronRight" className="size-4 text-text-tertiary" />
              </Menu.Item>
              <Menu.Separator className="my-1 h-px bg-border-default" />
              <Menu.Item
                className="flex w-full cursor-default items-center gap-3 rounded-sm px-3 py-2.5 text-body-sm-semibold text-error-default outline-none data-highlighted:bg-error-50"
                onClick={() => authActions.logout()}
              >
                <Icon name="logout" className="size-5" />
                Sign out
              </Menu.Item>
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>
    </>
  );
}
