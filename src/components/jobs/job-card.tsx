"use client";

import Link from "next/link";
import type { MouseEvent } from "react";

import { Badge } from "@/components/ui/badge";
import { IconButton } from "@/components/ui/icon-button";
import { Icon } from "@/components/icon";
import {
  employmentTypes,
  experienceLabel,
  formatSalaryRange,
  formatSalaryShort,
  isExpiringSoon,
  isOpen,
  jobPath,
  locationLine,
  timeAgo,
  type Job,
} from "@/lib/jobs";
import { useSeekerActions } from "@/components/auth/use-seeker-actions";
import { activeApplicationFor, useSeeker } from "@/lib/seeker-store";
import { cn } from "@/lib/utils";

const markTones = ["bg-info-50 text-info-700", "bg-secondary-50 text-secondary-700", "bg-success-50 text-success-700", "bg-primary-50 text-primary-700", "bg-warning-50 text-warning-700"];

export function CompanyMark({ name, className }: { name: string; className?: string }) {
  const words = name.split(/\s+/).filter((word) => /[A-Za-z]/.test(word));
  const letters = ((words[0]?.[0] ?? "") + (words[1]?.[0] ?? "")).toUpperCase() || "•";
  let hash = 0;
  for (const char of name) hash = (hash + char.charCodeAt(0)) % markTones.length;
  return (
    <span aria-hidden className={cn("flex size-12 shrink-0 items-center justify-center rounded-sm text-body-bold", markTones[hash], className)}>
      {letters}
    </span>
  );
}

export function LogoPlaceholder({ className }: { className?: string }) {
  return <span aria-hidden className={cn("block size-12 shrink-0 rounded-sm bg-grey-100", className)} />;
}

export function VerifiedBadge({ verified }: { verified: boolean }) {
  if (!verified) return null;
  return <Icon name="verified" className="size-5 text-success-700" />;
}

export function SalaryBadge({ job }: { job: Job }) {
  return <Badge type="salary">{job.salaryDisclosed ? formatSalaryShort(job.salary) : "Salary not disclosed"}</Badge>;
}

const cardEmployment = {
  FULL_TIME: "Full Time",
  PART_TIME: "Part Time",
  CONTRACTOR: "Contract",
  INTERN: "Internship",
};

const isPlainClick = (event: MouseEvent) =>
  event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;

/**
 * Figma "Around / Jobs / Job Card" (1888:42501). The title is a real link to the
 * job page (so it can be opened in a new tab and crawled); `onSelect` lets the
 * map explorer open the in-map detail panel instead on a plain click.
 */
export function JobCard({
  job,
  from,
  onSelect,
  variant = "default",
  className,
}: {
  job: Job;
  from: [number, number];
  onSelect?: (job: Job) => void;
  /** "saved": Saved jobs tile (2510:38512) with a bookmark and status footer. */
  variant?: "default" | "saved";
  className?: string;
}) {
  const seeker = useSeeker();
  const actions = useSeekerActions();
  const saved = seeker.savedJobs.includes(job.slug);
  const applied = activeApplicationFor(seeker, job.slug) !== null;
  const isSavedTile = variant === "saved";

  const bookmark = (
    <IconButton
      variant="plain"
      icon={saved ? "bookmarkFilled" : "bookmark"}
      label={saved ? `Remove ${job.title} from saved` : `Save ${job.title}`}
      aria-pressed={saved}
      onClick={() => actions.setSavedJob(job.slug, !saved)}
      className={cn(
        "relative z-1",
        isSavedTile ? "absolute top-2 right-2 size-9" : "-m-0.5",
        saved ? "text-primary-600" : "text-grey-500",
      )}
    />
  );

  return (
    <article
      className={cn(
        "relative flex w-full items-start gap-3 rounded-md border bg-surface-default p-4 transition-colors hover:border-border-strong",
        applied && !isSavedTile && "border-brand-primary hover:border-brand-primary",
        isSavedTile && "grid grid-cols-[auto_minmax(0,1fr)] rounded-md",
        className,
      )}
    >
      <CompanyMark name={job.company.name} />
      <div className={cn("flex min-w-0 flex-1 flex-col gap-1.5", isSavedTile && "pr-7")}>
        <h3 className="text-body-semibold text-text-primary">
          <Link
            href={jobPath(job)}
            onClick={(event) => {
              if (!onSelect || !isPlainClick(event)) return;
              event.preventDefault();
              onSelect(job);
            }}
            className="rounded-md outline-none after:absolute after:inset-0 after:rounded-md focus-visible:after:ring-3 focus-visible:after:ring-brand-primary/40"
          >
            {job.title}
          </Link>
        </h3>
        <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
          <span className="text-body-sm-regular text-text-secondary">{job.company.name}</span>
          <VerifiedBadge verified={job.company.verified} />
        </div>
        <p className="flex items-center gap-1 text-label-medium text-text-tertiary">
          <Icon name="pinSm" className="size-4" />
          <span className="truncate" title={locationLine(job, from)}>{locationLine(job, from)}</span>
        </p>
        {isSavedTile && job.salaryDisclosed && (
          <p className="flex flex-wrap items-baseline gap-x-1">
            <span className="text-body-semibold text-text-primary">{formatSalaryRange(job.salary).replace(" / month", "")}</span>
            <span className="text-body-sm-regular text-text-tertiary">/ month</span>
          </p>
        )}
        <div className="flex flex-wrap gap-1.5">
          {(!isSavedTile || !job.salaryDisclosed) && <SalaryBadge job={job} />}
          <Badge type="employment">{isSavedTile ? cardEmployment[job.employmentType] : employmentTypes[job.employmentType]}</Badge>
          <Badge type="experience">{isSavedTile ? experienceLabel(job.experience).replace("–", "-") : experienceLabel(job.experience)}</Badge>
        </div>
        {!isSavedTile && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="whitespace-nowrap text-label-medium text-text-tertiary">Posted {timeAgo(job.datePosted)}</span>
            {applied && <Badge type="applied">Applied</Badge>}
          </div>
        )}
      </div>
      {bookmark}
      {isSavedTile && (
        <div className="col-span-2 flex flex-wrap items-center gap-2 border-t pt-3">
          <span className="mr-auto text-body-sm-regular text-text-tertiary">Posted {timeAgo(job.datePosted)}</span>
          {applied && <Badge type="applied">Applied</Badge>}
          {isExpiringSoon(job) && <Badge type="expiring">Expiring soon</Badge>}
          {!isOpen(job) && <Badge type={job.status === "expired" ? "expired" : "closed"}>{job.status === "expired" ? "Expired" : "Closed"}</Badge>}
        </div>
      )}
    </article>
  );
}

export function JobCardSkeleton() {
  return (
    <div aria-hidden className="flex w-full items-start gap-3 rounded-md border bg-surface-default p-4">
      <span className="size-12 shrink-0 animate-pulse rounded-sm bg-grey-100" />
      <div className="flex flex-1 flex-col gap-2 pt-1">
        <span className="h-4 w-3/5 animate-pulse rounded-xs bg-grey-100" />
        <span className="h-3 w-4/5 animate-pulse rounded-xs bg-grey-100" />
        <span className="h-3 w-2/5 animate-pulse rounded-xs bg-grey-100" />
      </div>
    </div>
  );
}
