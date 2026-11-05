import Link from "next/link";

import { AppShell } from "@/components/app-shell";
import { Icon, type IconName } from "@/components/icon";
import { MobileHeader } from "@/components/mobile-header";
import { buttonVariants } from "@/components/ui/button";

export function PlaceholderPage({
  active,
  icon,
  title,
  body,
}: {
  active?: "jobs" | "applications" | "saved";
  icon: IconName;
  title: string;
  body: string;
}) {
  return (
    <AppShell active={active}>
      <MobileHeader title={title} backHref="/" backLabel="Back to jobs" />
      <header className="hidden h-18 shrink-0 items-center border-b bg-background-primary px-6 md:flex" />
      <main className="flex min-h-0 flex-1 items-center justify-center bg-background-secondary p-6">
        <div className="flex max-w-sm flex-col items-center gap-4 text-center">
          <span className="flex size-14 items-center justify-center rounded-full bg-primary-50 text-brand-primary">
            <Icon name={icon} className="size-6" />
          </span>
          <h1 className="text-heading-semibold text-text-primary">{title}</h1>
          <p className="text-body-regular text-text-secondary">{body}</p>
          <Link href="/" className={buttonVariants()}>
            Browse jobs near you
          </Link>
        </div>
      </main>
    </AppShell>
  );
}
