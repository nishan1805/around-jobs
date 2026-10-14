import Link from "next/link";
import type { ReactNode } from "react";

import { Icon, type IconName } from "@/components/icon";
import { TabIcon, type TabIconName } from "@/components/tab-bar-icons";
import { cn } from "@/lib/utils";

export type NavKey = "jobs" | "applications" | "saved" | "profile";

const navItems: { key: Exclude<NavKey, "profile">; label: string; href: string; icon: IconName }[] = [
  { key: "jobs", label: "Jobs", href: "/", icon: "navJobs" },
  { key: "applications", label: "My applications", href: "/applications", icon: "navApplications" },
  { key: "saved", label: "Saved", href: "/saved", icon: "navSaved" },
];

const tabs: { key: NavKey; label: string; href: string; icon: TabIconName }[] = [
  { key: "jobs", label: "Jobs", href: "/", icon: "jobs" },
  { key: "applications", label: "Applied", href: "/applications", icon: "applications" },
  { key: "saved", label: "Saved", href: "/saved", icon: "saved" },
  { key: "profile", label: "Profile", href: "/profile", icon: "profile" },
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

      <MobileTabBar active={active} />
    </div>
  );
}

/**
 * Figma "Mobile Tab Bar" (1952:18438): four tabs around a raised "Post a job" button.
 * Full-height sheets hide it by setting `data-sheet="full"` on <body>.
 */
function MobileTabBar({ active }: { active?: NavKey }) {
  const [left, right] = [tabs.slice(0, 2), tabs.slice(2)];
  const renderTab = (tab: (typeof tabs)[number]) => {
    const isActive = tab.key === active;
    return (
      <Link
        key={tab.key}
        href={tab.href}
        aria-current={isActive ? "page" : undefined}
        className={cn(
          "flex w-18 flex-col items-center gap-1 pt-2 pb-1.5 outline-none focus-visible:ring-3 focus-visible:ring-brand-primary/40 rounded-sm",
          isActive ? "text-label-semibold text-brand-primary" : "text-label-regular text-text-tertiary",
        )}
      >
        <TabIcon name={tab.icon} active={isActive} />
        {tab.label}
      </Link>
    );
  };

  return (
    <nav
      aria-label="Primary"
      data-mobile-tabbar
      className="relative z-10 flex h-17 shrink-0 items-start justify-between bg-surface-primary px-2 shadow-sm pb-[env(safe-area-inset-bottom)] box-content md:hidden"
    >
      <div className="flex gap-1">{left.map(renderTab)}</div>
      <Link
        href="/post-a-job"
        aria-label="Post a job"
        className="absolute -top-5 left-1/2 flex -translate-x-1/2 items-center justify-center rounded-2xl border-4 border-primary-100 bg-brand-primary p-4 text-text-on-brand outline-none transition-colors hover:bg-primary-600 focus-visible:ring-3 focus-visible:ring-brand-primary/40"
      >
        <Icon name="plus" className="size-8" />
      </Link>
      <div className="flex gap-1">{right.map(renderTab)}</div>
    </nav>
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
