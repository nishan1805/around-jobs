"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import { AppShell, type NavKey } from "@/components/app-shell";
import { Icon } from "@/components/icon";
import { LogoPlaceholder } from "@/components/jobs/job-card";
import { TopBar } from "@/components/jobs/top-bar";
import { useCoverTabBar } from "@/hooks/use-cover-tab-bar";
import type { Job } from "@/lib/jobs";
import { cn } from "@/lib/utils";

const backClass =
  "flex size-12 shrink-0 items-center justify-center rounded-md border bg-surface-default text-text-primary transition-colors hover:bg-grey-100 focus-visible:ring-3 focus-visible:ring-brand-primary/40 focus-visible:outline-none";

/**
 * Focused task screens (Apply M08–M14, Application detail M16): full screen with a sticky
 * footer on phones, a centred card next to the sidebar from tablet up.
 */
export function FlowScreen({
  active,
  title,
  back,
  backLabel = "Back",
  backDisabled = false,
  meta,
  footer,
  children,
  className,
}: {
  active: NavKey;
  title?: string;
  /** A link target, or a handler for in-flow steps. Omitted on end screens. */
  back?: string | (() => void);
  backLabel?: string;
  backDisabled?: boolean;
  /** Shown under the title row: step counter and progress bar. */
  meta?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  useCoverTabBar(true);

  return (
    <AppShell active={active}>
      <TopBar />
      <main className="flex min-h-0 flex-1 flex-col md:overflow-y-auto md:bg-background-secondary md:px-10 md:py-8">
        <section className="flex min-h-0 flex-1 flex-col bg-surface-default md:mx-auto md:w-full md:max-w-140 md:flex-none md:rounded-xl md:border md:shadow-sm">
          {(title || back) && (
            <header className="flex shrink-0 flex-col gap-1 px-5 pt-3 md:px-6 md:pt-6">
              <div className="flex items-center gap-3">
                {typeof back === "string" ? (
                  <Link href={back} aria-label={backLabel} title={backLabel} className={backClass}>
                    <Icon name="chevronLeft" className="size-5" />
                  </Link>
                ) : back ? (
                  <button
                    type="button"
                    onClick={back}
                    disabled={backDisabled}
                    aria-label={backLabel}
                    title={backLabel}
                    className={cn(backClass, "disabled:text-text-disabled disabled:hover:bg-surface-default")}
                  >
                    <Icon name="chevronLeft" className="size-5" />
                  </button>
                ) : null}
                {title && <h1 className="text-heading-semibold text-text-primary">{title}</h1>}
              </div>
              {meta}
            </header>
          )}
          <div className={cn("flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-5 py-4 md:overflow-visible md:px-6 md:py-5", className)}>
            {children}
          </div>
          {footer && (
            <div className="flex shrink-0 flex-col gap-3 border-t bg-surface-default px-5 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:rounded-b-xl md:px-6 md:py-4">
              {footer}
            </div>
          )}
        </section>
      </main>
    </AppShell>
  );
}

/** "Step 1 of 5 · Details" with a segmented progress bar. */
export function StepProgress({ step, total, label }: { step: number; total: number; label: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-label-medium text-text-secondary">
        Step {step} of {total} · {label}
      </p>
      <div
        role="progressbar"
        aria-label="Application progress"
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={step}
        aria-valuetext={`Step ${step} of ${total}, ${label}`}
        className="flex gap-1"
      >
        {Array.from({ length: total }, (_, index) => (
          <span key={index} className={cn("h-1 flex-1 rounded-4xl", index < step ? "bg-brand-primary" : "bg-grey-200")} />
        ))}
      </div>
    </div>
  );
}

/** Logo, title and "Company · Area, City" row at the top of the Apply and Application screens. */
export function JobSummaryRow({ job, children }: { job: Job; children?: ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <LogoPlaceholder />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="truncate text-body-semibold text-text-primary">{job.title}</p>
        <p className="truncate text-label-medium text-text-secondary">
          {job.company.name} · {job.company.area}, {job.city.name}
        </p>
      </div>
      {children}
    </div>
  );
}
