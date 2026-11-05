import type { ReactNode } from "react";

import { AppShell } from "@/components/app-shell";
import { TopBar } from "@/components/jobs/top-bar";
import { MobileHeader } from "@/components/mobile-header";

export function TextPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <AppShell>
      <MobileHeader title={title} backHref="/" backLabel="Back to jobs" />
      <TopBar />
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-4 overflow-y-auto px-5 pt-6 pb-12 md:px-6 md:py-10">
        <h1 className="text-heading-semibold text-text-primary max-md:hidden md:text-display-small-semibold">{title}</h1>
        <div className="flex flex-col gap-4 text-body-regular text-text-secondary">{children}</div>
      </main>
    </AppShell>
  );
}
