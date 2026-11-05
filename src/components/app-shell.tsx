import Link from "next/link";
import type { ReactNode } from "react";

import { Icon, type IconName } from "@/components/icon";
import { TabIcon, type TabIconName } from "@/components/tab-bar-icons";
import { cn } from "@/lib/utils";

export type NavKey = "jobs" | "applications" | "saved" | "profile";

const navItems: { key: NavKey; label: string; href: string; icon: IconName; activeIcon: IconName }[] = [
  { key: "jobs", label: "Jobs", href: "/", icon: "navJobs", activeIcon: "navJobsFilled" },
  { key: "applications", label: "Applied", href: "/applications", icon: "navApplications", activeIcon: "navApplicationsFilled" },
  { key: "saved", label: "Saved", href: "/saved", icon: "navSaved", activeIcon: "navSavedFilled" },
  { key: "profile", label: "Profile", href: "/profile", icon: "user", activeIcon: "userFilled" },
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
    <div data-app-frame className="flex h-dvh flex-col bg-background-primary md:flex-row">
      <aside className="hidden w-[124px] shrink-0 flex-col items-center border-r bg-background-primary px-4 pt-5 pb-6 md:flex">
        <div className="flex flex-col items-center gap-8">
          <Wordmark />
          <nav aria-label="Primary" className="flex flex-col items-center gap-2">
            {navItems.map(({ key, ...item }) => (
              <SidebarLink key={key} {...item} isActive={key === active} />
            ))}
          </nav>
        </div>
      </aside>

      <div data-app-main className="flex min-h-0 min-w-0 flex-1 flex-col max-md:pb-7 max-md:has-[.leaflet-container]:pb-0">{children}</div>

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
          "flex min-h-11 w-18 flex-col items-center gap-1 rounded-sm pt-2 pb-1.5 outline-none transition-transform active:scale-95 focus-visible:ring-3 focus-visible:ring-brand-primary/40",
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
        className="absolute -top-5 left-1/2 flex -translate-x-1/2 items-center justify-center rounded-2xl border-4 border-primary-100 bg-brand-primary p-4 text-text-on-brand outline-none transition-transform hover:bg-primary-600 active:scale-95 focus-visible:ring-3 focus-visible:ring-brand-primary/40"
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
  activeIcon,
  isActive,
}: {
  label: string;
  href: string;
  icon: IconName;
  activeIcon: IconName;
  isActive: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "flex w-[92px] flex-col items-center justify-center gap-1.5 p-2 text-center text-label-medium transition-colors",
        isActive
          ? "rounded-lg bg-primary-50 text-primary-600"
          : "rounded-2xl text-grey-600 hover:bg-grey-100",
      )}
    >
      <Icon name={isActive ? activeIcon : icon} className="size-6" />
      {label}
    </Link>
  );
}
