import type { ReactNode } from "react";

import { AppShell } from "@/components/app-shell";
import { TopBar } from "@/components/jobs/top-bar";

export function TextPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <AppShell>
      <TopBar />
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-4 overflow-y-auto px-6 py-10">
        <h1 className="text-display-small-semibold text-text-primary">{title}</h1>
        <div className="flex flex-col gap-4 text-body-regular text-text-secondary">{children}</div>
      </main>
    </AppShell>
  );
}
