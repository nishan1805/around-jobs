"use client";

import { useEffect } from "react";

import { AppShell } from "@/components/app-shell";
import { Icon } from "@/components/icon";
import { TopBar } from "@/components/jobs/top-bar";
import { useAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { markAlertsRead } from "@/lib/alerts";

export default function AlertsPage() {
  const { user, openLogin } = useAuth();
  useEffect(() => {
    if (user) markAlertsRead();
  }, [user]);

  return (
    <AppShell>
      <TopBar />
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-4 overflow-y-auto px-6 py-10">
        <h1 className="text-display-small-semibold text-text-primary">Alerts</h1>
        {!user ? (
          <div className="flex flex-col items-start gap-3 rounded-xl border bg-surface-default p-6">
            <p className="text-body-regular text-text-secondary">Log in to see job alerts for your area.</p>
            <Button type="button" shape="rect" onClick={openLogin}>
              Log in
            </Button>
          </div>
        ) : (
          <article className="flex gap-3 rounded-xl border bg-surface-default p-5">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-50 text-brand-primary">
              <Icon name="bell" className="size-5" />
            </span>
            <div className="flex flex-col gap-1">
              <h2 className="text-body-semibold text-text-primary">New retail roles near Pandri</h2>
              <p className="text-body-sm-regular text-text-secondary">
                Cashier at Magneto Retail and other on-site jobs were posted this week. This alert is marked read when you open Alerts.
              </p>
            </div>
          </article>
        )}
      </main>
    </AppShell>
  );
}
