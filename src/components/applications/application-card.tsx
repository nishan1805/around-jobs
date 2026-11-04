import Link from "next/link";

import { Icon } from "@/components/icon";
import { applicationPath } from "@/components/jobs/apply-button";
import type { StatusTone } from "@/components/ui/status-pill";
import { applicationBadge, groupOf, type ApplicationBadgeTone } from "@/lib/applications";
import { employmentTypes, experienceLabel, formatDate, type Job } from "@/lib/jobs";
import type { Application } from "@/lib/seeker-store";
import { cn } from "@/lib/utils";

export const statusTone = (application: Application, job: Job): StatusTone =>
  application.stage === "rejected" ? "rejected" : groupOf(application, job);

const badgeClass: Record<ApplicationBadgeTone, string> = {
  review: "bg-[#fff9e7] text-[#b58708]",
  shortlisted: "bg-[#e6efff] text-[#0146b5]",
  interview: "bg-[#f3ebfd] text-[#5d28a8]",
  rejected: "bg-[#ffbacb] text-[#8c122f]",
  withdrawn: "bg-grey-100 text-text-secondary",
  closed: "bg-grey-100 text-text-tertiary",
};

function initials(name: string) {
  const parts = name.split(/\s+/).filter((part) => /[A-Za-z]/.test(part));
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "•";
}

function place(job: Job) {
  const area = job.workMode === "REMOTE" ? "Remote" : job.company.area;
  if (area.toLowerCase().includes(job.city.name.toLowerCase())) return area;
  return `${area}, ${job.city.name}`;
}

/** Figma MyApplicationCard (2540:36115): logo, role, company, chips, location, date, status, chevron. */
export function ApplicationCard({ application, job }: { application: Application; job: Job }) {
  const badge = applicationBadge(application, job);
  return (
    <Link
      href={applicationPath(job.slug)}
      className="flex w-full flex-col gap-3 rounded-2xl border border-grey-200 bg-surface-default px-4 py-4 shadow-none transition-colors outline-none hover:border-grey-300 focus-visible:ring-3 focus-visible:ring-brand-primary/40 md:flex-row md:items-center md:gap-4 md:px-5"
    >
      <span className="flex size-12 shrink-0 flex-col items-center justify-center rounded-lg bg-[#fff2e8] text-body-bold text-text-primary">
        {initials(job.company.name)}
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-2">
        <span className="flex flex-col gap-1">
          <span className="text-body-semibold text-text-primary">{job.title}</span>
          <span className="flex items-center gap-1 text-body-sm-regular text-text-secondary">
            {job.company.name}
            {job.company.verified && <Icon name="verified" className="size-5 text-success-700" />}
          </span>
        </span>
        <span className="flex flex-wrap gap-2">
          <span className="rounded-full bg-grey-100 px-2 py-1 text-label-medium text-text-secondary">{employmentTypes[job.employmentType]}</span>
          <span className="rounded-full bg-grey-100 px-2 py-1 text-label-medium text-text-secondary">{experienceLabel(job.experience)}</span>
        </span>
      </span>
      <span className="flex flex-col gap-2 text-body-sm-regular text-text-tertiary md:w-[220px] md:shrink-0">
        <span className="flex items-center gap-1">
          <Icon name="pinSm" className="size-4" />
          {place(job)}
        </span>
        <span className="flex items-center gap-2">
          <Icon name="calendar" className="size-5" />
          Applied {formatDate(application.appliedOn)}
        </span>
      </span>
      <span className={cn("inline-flex w-fit items-center gap-1 rounded-full px-3 py-1 text-label-medium md:w-[180px]", badgeClass[badge.tone])}>
        <span className="size-2 rounded-full bg-current" />
        {badge.label}
      </span>
      <Icon name="chevronRight" className="hidden size-5 text-text-secondary md:inline-block" />
    </Link>
  );
}

export function ApplicationCardSkeleton() {
  return (
    <div aria-hidden className="flex w-full items-center gap-4 rounded-2xl border border-grey-200 bg-surface-default px-5 py-4">
      <span className="size-12 shrink-0 animate-pulse rounded-lg bg-grey-100" />
      <span className="flex flex-1 flex-col gap-2">
        <span className="h-4 w-2/5 animate-pulse rounded-xs bg-grey-100" />
        <span className="h-3 w-1/3 animate-pulse rounded-xs bg-grey-100" />
        <span className="h-3 w-1/4 animate-pulse rounded-xs bg-grey-100" />
      </span>
    </div>
  );
}
