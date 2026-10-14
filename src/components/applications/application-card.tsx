import { ProgressStepper } from "@/components/applications/progress-stepper";
import { LogoPlaceholder } from "@/components/jobs/job-card";
import { StatusPill, type StatusTone } from "@/components/ui/status-pill";
import { appliedWhen, groupOf, statusLabel } from "@/lib/applications";
import { distanceKm, formatSalaryShort, type Job } from "@/lib/jobs";
import type { Application } from "@/lib/seeker-store";
import { cn } from "@/lib/utils";

export const statusTone = (application: Application, job: Job): StatusTone =>
  application.stage === "rejected" ? "rejected" : groupOf(application, job);

/** "Urban Bites Café (Sample) · Devendra Nagar · 1.2 km" */
export const companyLine = (job: Job, from: [number, number]) =>
  job.workMode === "REMOTE"
    ? `${job.company.name} · Remote`
    : `${job.company.name} · ${job.company.area} · ${distanceKm(from, job.company.position).toFixed(1)} km`;

/** Figma "Application card" (1988:24392). The whole card selects the application. */
export function ApplicationCard({
  application,
  job,
  from,
  selected,
  onSelect,
}: {
  application: Application;
  job: Job;
  from: [number, number];
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "flex w-full items-start gap-3 rounded-xl border bg-surface-default p-4 text-left shadow-sm transition-colors outline-none hover:border-border-strong focus-visible:ring-3 focus-visible:ring-brand-primary/40 md:gap-4 md:p-5",
        selected && "border-brand-primary ring-1 ring-brand-primary hover:border-brand-primary",
      )}
    >
      <LogoPlaceholder className="md:size-16 md:rounded-lg" />
      <span className="@container flex min-w-0 flex-1 flex-col gap-2">
        <span className="flex items-start gap-2">
          <span className="flex min-w-0 flex-1 flex-col gap-1">
            <span className="text-body-semibold text-text-primary">{job.title}</span>
            <span className="text-body-sm-regular text-text-secondary">{companyLine(job, from)}</span>
          </span>
          <StatusPill tone={statusTone(application, job)}>{statusLabel(application, job)}</StatusPill>
        </span>
        <span className="text-body-sm-semibold text-text-primary">
          {job.salaryDisclosed ? formatSalaryShort(job.salary) : "Salary not disclosed"}
        </span>
        <ProgressStepper application={application} />
        <span className="text-label-medium text-text-tertiary">{appliedWhen(application)}</span>
      </span>
    </button>
  );
}

export function ApplicationCardSkeleton() {
  return (
    <div aria-hidden className="flex w-full items-start gap-4 rounded-xl border bg-surface-default p-5 shadow-sm">
      <span className="size-12 shrink-0 animate-pulse rounded-sm bg-grey-100 md:size-16 md:rounded-lg" />
      <span className="flex flex-1 flex-col gap-2.5 pt-1">
        <span className="h-4 w-2/5 animate-pulse rounded-xs bg-grey-100" />
        <span className="h-3 w-3/5 animate-pulse rounded-xs bg-grey-100" />
        <span className="h-3 w-1/5 animate-pulse rounded-xs bg-grey-100" />
        <span className="h-3 w-4/5 animate-pulse rounded-xs bg-grey-100" />
      </span>
    </div>
  );
}
