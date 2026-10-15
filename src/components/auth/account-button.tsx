"use client";

import { Menu } from "@base-ui/react/menu";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { authActions, maskPhone } from "@/lib/auth-store";

import { useAuth } from "./auth-provider";

const itemClass =
  "flex w-full cursor-default items-center rounded-xs px-3 py-2 text-body-sm-medium text-text-primary outline-none data-highlighted:bg-grey-100";

/** Top-bar avatar ("N" in Figma). Logged out it becomes a "Log in" button. */
export function AccountButton() {
  const { user, openLogin, editProfile } = useAuth();

  if (!user) {
    return (
      <Button variant="outline" size="sm" onClick={openLogin} className="h-10 px-4">
        Log in
      </Button>
    );
  }

  const initial = (user.name ?? "N").trim().charAt(0).toUpperCase();
  return (
    <Menu.Root>
      <Menu.Trigger
        aria-label={`Account menu for ${user.name ?? maskPhone(user.phone)}`}
        className="flex size-10 items-center justify-center rounded-full bg-grey-200 text-body-sm-semibold text-text-primary outline-none focus-visible:ring-3 focus-visible:ring-brand-primary/40"
      >
        {initial}
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner sideOffset={8} align="end" className="z-50">
          <Menu.Popup className="w-56 rounded-md border bg-surface-elevated p-1 shadow-lg outline-none">
            <div className="px-3 py-2">
              <p className="truncate text-body-sm-semibold text-text-primary">{user.name ?? "Your account"}</p>
              <p className="text-label-medium text-text-tertiary">{maskPhone(user.phone)} · Sample</p>
            </div>
            <Menu.Separator className="my-1 h-px bg-border-default" />
            <Menu.Item className={itemClass} onClick={editProfile}>
              {user.name ? "Edit profile" : "Complete profile"}
            </Menu.Item>
            <Menu.Item className={itemClass} render={<Link href="/profile" />}>
              Profile
            </Menu.Item>
            <Menu.Item className={itemClass} render={<Link href="/applications" />}>
              My applications
            </Menu.Item>
            <Menu.Item className={itemClass} render={<Link href="/saved" />}>
              Saved
            </Menu.Item>
            <Menu.Separator className="my-1 h-px bg-border-default" />
            <Menu.Item className={itemClass} onClick={() => authActions.logout()}>
              Log out
            </Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
