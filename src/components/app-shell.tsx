import Link from "next/link";
import type { ReactNode } from "react";

import { Icon, type IconName } from "@/components/icon";
import { cn } from "@/lib/utils";

type NavKey = "jobs" | "applications" | "saved";

const navItems: { key: NavKey; label: string; href: string; icon: IconName }[] = [
  { key: "jobs", label: "Jobs", href: "/", icon: "navJobs" },
  { key: "applications", label: "My applications", href: "/applications", icon: "navApplications" },
  { key: "saved", label: "Saved", href: "/saved", icon: "navSaved" },
];

export function Wordmark({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("font-display text-wordmark text-brand-primary", className)}>
      around
    </Link>
  );
}

export function AppShell({ active, children }: { active?: NavKey; children: ReactNode }) {
  return (
    <div className="flex h-dvh flex-col bg-background-primary md:flex-row">
      <aside className="hidden w-26 shrink-0 flex-col items-center gap-2 border-r bg-background-primary px-3 pt-5 pb-6 md:flex lg:w-31 lg:px-4">
        <Wordmark />
        <div className="h-5" />
        <nav aria-label="Primary" className="flex flex-col items-center gap-2">
          {navItems.map(({ key, ...item }) => (
            <SidebarLink key={key} {...item} isActive={key === active} />
          ))}
        </nav>
        <div className="flex-1" />
        <Link
          href="/post-a-job"
          className="flex w-full items-center justify-center rounded-sm border bg-surface-default px-1 py-3 text-center text-label-semibold text-text-primary lg:px-2 lg:text-body-sm-semibold transition-colors hover:bg-grey-100"
        >
          Post a job
        </Link>
      </aside>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">{children}</div>

      <nav
        aria-label="Primary"
        className="grid shrink-0 grid-cols-3 border-t bg-background-primary pb-[env(safe-area-inset-bottom)] md:hidden"
      >
        {navItems.map((item) => {
          const isActive = item.key === active;
          return (
            <Link
              key={item.key}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex flex-col items-center gap-1 py-2 text-label-medium",
                isActive ? "text-brand-primary" : "text-text-secondary",
              )}
            >
              <span className={cn("flex h-8 w-14 items-center justify-center rounded-lg", isActive && "bg-primary-50")}>
                <Icon name={item.icon} />
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

function SidebarLink({
  label,
  href,
  icon,
  isActive,
}: {
  label: string;
  href: string;
  icon: IconName;
  isActive: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "flex w-20 flex-col items-center justify-center gap-1.5 rounded-lg px-2 py-2.5 text-center text-label-medium transition-colors lg:w-23",
        isActive ? "bg-primary-50 text-brand-primary" : "text-text-secondary hover:bg-grey-100",
      )}
    >
      <span className="flex size-8 items-center justify-center">
        <Icon name={icon} className={icon === "navApplications" ? "size-5" : undefined} />
      </span>
      {label}
    </Link>
  );
}
