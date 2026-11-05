"use client";

import { Menu } from "@base-ui/react/menu";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Icon, type IconName } from "@/components/icon";
import { Dialog } from "@/components/ui/dialog";
import { useHydrated } from "@/hooks/use-hydrated";
import { breakpoints, useMediaQuery } from "@/hooks/use-media-query";
import { useSearchParam } from "@/hooks/use-search-param";
import { authActions } from "@/lib/auth-store";
import { useProfilePhoto } from "@/lib/profile-photo";
import { PROFILE_COMPLETION, PROFILE_DISPLAY_NAME } from "@/lib/seeker-design-seed";
import { cn } from "@/lib/utils";

import { useAuth } from "./auth-provider";

const itemClass =
  "flex h-12 w-full cursor-default items-center gap-3 rounded-sm px-1 py-3 text-body-sm-medium text-text-primary outline-none data-highlighted:bg-grey-100";

/**
 * Logged out: grey profile glyph (S00). Logged in: blue initial on the trigger;
 * the open menu uses a 64px grey-200 initial, with the progress bar on its own row (S07).
 * `?menu=open` keeps the menu open for the profile-menu frame.
 */
export function AccountButton({ className }: { className?: string }) {
  const { user, openLogin } = useAuth();
  const router = useRouter();
  const photo = useProfilePhoto();
  const hydrated = useHydrated();
  const desktop = useMediaQuery(breakpoints.md);
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
        className={cn(
          "flex size-10 items-center justify-center rounded-full bg-grey-200 text-grey-600 outline-none hover:bg-grey-300 focus-visible:ring-3 focus-visible:ring-brand-primary/40",
          className,
        )}
      >
        <Icon name="user" className="size-5" />
      </button>
    );
  }

  const initial = PROFILE_DISPLAY_NAME.trim().charAt(0).toUpperCase();
  const triggerClass = cn(
    "flex size-10 items-center justify-center overflow-hidden rounded-full border border-primary-200 bg-primary-100 text-heading-semibold leading-none text-primary-700 outline-none focus-visible:ring-3 focus-visible:ring-brand-primary/40",
    className,
  );

  if (hydrated && !desktop) {
    return (
      <>
        <button type="button" aria-label={`Account menu for ${PROFILE_DISPLAY_NAME}`} aria-expanded={open} onClick={() => setOpen(true)} className={triggerClass}>
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photo.url} alt="" className="size-full object-cover" />
          ) : (
            initial
          )}
        </button>
        <Dialog open={open} onOpenChange={setOpen}>
          <AccountSummary photo={photo?.url} initial={initial} />
          <div className="flex flex-col">
            <SheetItem icon="user" label="Profile settings" onClick={() => { setOpen(false); router.push("/profile"); }} />
            <SheetItem icon="bellOutline" label="Job alerts" onClick={() => { setOpen(false); router.push("/alerts"); }} />
            <SheetItem icon="help" label="Help & support" onClick={() => { setOpen(false); router.push("/help"); }} />
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                authActions.logout();
              }}
              className="flex h-12 w-full items-center gap-3 text-left text-body-sm-semibold text-error-default active:bg-error-50"
            >
              <Icon name="logout" className="size-5" />
              Sign out
            </button>
          </div>
        </Dialog>
      </>
    );
  }

  return (
    <>
      <Menu.Root open={open} onOpenChange={setOpen}>
        <Menu.Trigger
          aria-label={`Account menu for ${PROFILE_DISPLAY_NAME}`}
          className={triggerClass}
        >
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photo.url} alt="" className="size-full object-cover" />
          ) : (
            initial
          )}
        </Menu.Trigger>
        <Menu.Portal>
          <Menu.Positioner sideOffset={8} align="end" className="z-50">
            <Menu.Popup className="w-[360px] rounded-xl border bg-surface-elevated p-5 shadow-lg outline-none">
              <AccountSummary photo={photo?.url} initial={initial} />
              <div className="h-px w-full bg-grey-200" />
              <Menu.Item className={itemClass} onClick={() => router.push("/profile")}>
                <Icon name="user" className="size-5 text-text-secondary" />
                <span className="flex-1">Profile settings</span>
                <Icon name="chevronRight" className="size-4 text-text-tertiary" />
              </Menu.Item>
              <Menu.Item className={itemClass} onClick={() => router.push("/alerts")}>
                <Icon name="bellOutline" className="size-5 text-text-secondary" />
                <span className="flex-1">Job alerts</span>
                <Icon name="chevronRight" className="size-4 text-text-tertiary" />
              </Menu.Item>
              <Menu.Item className={itemClass} onClick={() => router.push("/help")}>
                <Icon name="help" className="size-5 text-text-secondary" />
                <span className="flex-1">Help & support</span>
                <Icon name="chevronRight" className="size-4 text-text-tertiary" />
              </Menu.Item>
              <Menu.Separator className="my-1 h-px bg-border-default" />
              <Menu.Item
                className="flex h-12 w-full cursor-default items-center gap-3 rounded-sm px-1 py-3 text-body-sm-semibold text-error-default outline-none data-highlighted:bg-error-50"
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

function AccountSummary({ photo, initial }: { photo?: string; initial: string }) {
  return (
    <div className="flex items-center gap-4 pb-3">
      <span className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-grey-200 text-heading-semibold leading-none text-text-primary">
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photo} alt="" className="size-full object-cover" />
        ) : (
          initial
        )}
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
  );
}

function SheetItem({ icon, label, onClick }: { icon: IconName; label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="flex h-12 w-full items-center gap-3 text-left text-body-sm-medium text-text-primary active:bg-grey-100">
      <Icon name={icon} className="size-5 text-text-secondary" />
      <span className="flex-1">{label}</span>
      <Icon name="chevronRight" className="size-4 text-text-tertiary" />
    </button>
  );
}
