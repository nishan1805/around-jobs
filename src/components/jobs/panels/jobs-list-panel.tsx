"use client";

import { Chip, RemovableChip } from "@/components/jobs/chip";
import { FiltersButton } from "@/components/jobs/filters-button";
import { FrameJobCardView } from "@/components/jobs/frame-job-card";
import { JobCard, JobCardSkeleton } from "@/components/jobs/job-card";
import { ViewToggle } from "@/components/jobs/view-toggle";
import { Button } from "@/components/ui/button";
import { EmptyBlock } from "@/components/ui/empty-block";
import { IconButton } from "@/components/ui/icon-button";
import { activeFilters, defaultFilters, describeFilters, filterBadgeCount, toggleValue, type JobFilters } from "@/lib/job-filters";
import { useSeekerActions } from "@/components/auth/use-seeker-actions";
import { categories, experienceLabel, formatSalaryShort, locationLine, relativeDay, type EmploymentType, type Job } from "@/lib/jobs";
import type { FrameJobCard } from "@/lib/seeker-design-seed";
import { useSeeker } from "@/lib/seeker-store";

import { MapPanel } from "./panel-parts";

export type ListStatus = "ready" | "loading" | "error";

const plural = (count: number, word: string) => `${count} ${word}${count === 1 ? "" : "s"}`;

const cardEmployment: Record<EmploymentType, string> = {
  FULL_TIME: "Full Time",
  PART_TIME: "Part Time",
  CONTRACTOR: "Contract",
  INTERN: "Internship",
};

function liveListCard(job: Job, from: [number, number]): FrameJobCard {
  const words = job.company.name.split(/\s+/).filter(Boolean);
  const when = relativeDay(job.datePosted);
  return {
    id: job.slug,
    title: job.title,
    company: job.company.name,
    initials: words.slice(0, 2).map((word) => word[0]?.toUpperCase() ?? "").join(""),
    verified: job.company.verified,
    location: locationLine(job, from),
    salary: job.salaryDisclosed ? formatSalaryShort(job.salary) : "Salary not disclosed",
    employment: cardEmployment[job.employmentType],
    experience: experienceLabel(job.experience).replace("–", "-"),
    posted: `Posted ${when.charAt(0).toLowerCase()}${when.slice(1)}`,
  };
}

/** Figma "Around / Jobs / Jobs List Panel" (1889:41885), screens S03 and S05. */
export function JobsListPanel({
  cityName,
  status,
  jobs,
  totalMatching,
  filters,
  onFiltersChange,
  onOpenFilters,
  onClose,
  onSelectJob,
  onSearchArea,
  onChangeArea,
  onRetry,
  from,
  areaName = "you",
}: {
  cityName: string;
  status: ListStatus;
  /** Matching jobs inside the visible map area (plus remote jobs). */
  jobs: Job[];
  /** Matching jobs anywhere in the city. */
  totalMatching: number;
  filters: JobFilters;
  onFiltersChange: (filters: JobFilters) => void;
  onOpenFilters: () => void;
  onClose: () => void;
  onSelectJob: (job: Job) => void;
  onSearchArea: () => void;
  onChangeArea?: () => void;
  onRetry: () => void;
  from: [number, number];
  areaName?: string;
}) {
  const seeker = useSeeker();
  const actions = useSeekerActions();
  const chips = activeFilters(filters);
  const badgeCount = filterBadgeCount(filters);
  const hasPanelFilters = chips.length > 0 || filters.query.trim().length > 0;
  const description = describeFilters(filters);
  const clearAll = () => onFiltersChange({ ...defaultFilters, query: filters.query });
  const resetEverything = () => onFiltersChange(defaultFilters);

  const subtitle =
    status === "loading"
      ? "Finding jobs…"
      : status === "error"
        ? "Something went wrong"
        : jobs.length === 0 && totalMatching > 0
          ? "0 jobs in this area"
          : badgeCount > 0
            ? `${plural(jobs.length, "job")} · ${plural(badgeCount, "filter")} applied`
            : `${plural(jobs.length, "job")} near you`;

  const resultsLine =
    status === "loading"
      ? "Searching jobs…"
      : status === "error"
        ? "Results unavailable right now"
        : jobs.length === 0 && totalMatching > 0
          ? "0 results in this area"
          : description
            ? `${plural(jobs.length, "result")} for “${description}” in ${cityName}`
            : `${plural(jobs.length, "result")} in ${cityName}`;

  return (
    <MapPanel label={`Jobs in ${cityName}`} onDismiss={onClose}>
      <div className="flex shrink-0 flex-col gap-4 px-5 pt-1 pb-4 md:p-6 md:pb-4">
        <div className="flex items-center gap-2 md:hidden">
          <IconButton variant="plain" icon="chevronLeft" label="Back to map" onClick={onClose} className="-ml-2" />
          <h2 className="text-heading-semibold text-text-primary">Jobs near you</h2>
          <p aria-live="polite" className="sr-only">
            {subtitle}
          </p>
        </div>
        <div className="hidden items-start gap-3 md:flex">
          <div className="min-w-0 flex-1">
            <h2 className="text-heading-semibold text-text-primary">Jobs in {cityName}</h2>
            <p aria-live="polite" className="text-label-medium text-text-tertiary">
              {hasPanelFilters
              ? `${plural(totalMatching, "job")} match your filters`
              : `${plural(totalMatching, "job")} near ${areaName}`}
            </p>
          </div>
          <FiltersButton count={badgeCount} onClick={onOpenFilters} />
          <IconButton variant="outline" icon="close" label="Close jobs list" onClick={onClose} iconClassName="size-4" />
        </div>
        <div className="flex items-center gap-3">
          <p className="min-w-0 flex-1 truncate text-body-sm-regular text-text-secondary" title={resultsLine}>
            {resultsLine}
          </p>
          <ViewToggle view="list" size="sm" onChange={(view) => view === "map" && onClose()} />
        </div>
        <div role="group" aria-label="Job categories" className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Chip
              key={category}
              selected={filters.categories.includes(category)}
              onClick={() => onFiltersChange({ ...filters, categories: toggleValue(filters.categories, category) })}
            >
              {category}
            </Chip>
          ))}
        </div>
        {chips.length > 0 && (
          <div role="group" aria-label="Applied filters" className="flex flex-wrap items-center gap-2">
            {chips.map((chip) => (
              <RemovableChip key={chip.key} label={chip.label} onRemove={() => onFiltersChange(chip.remove(filters))} />
            ))}
            <button type="button" onClick={clearAll} className="text-label-semibold text-brand-primary hover:underline">
              Clear all
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto overscroll-contain px-5 pb-6 md:px-6">
        {status === "loading" ? (
          <div className="flex flex-col gap-3" aria-busy="true">
            <span className="sr-only">Loading jobs</span>
            {Array.from({ length: 4 }, (_, index) => (
              <JobCardSkeleton key={index} />
            ))}
          </div>
        ) : status === "error" ? (
          <EmptyBlock
            icon="alertCircle"
            title="Couldn't load jobs"
            body="Check your internet connection and try again."
            action={
              <Button variant="outline" shape="rect" onClick={onRetry}>
                Retry
              </Button>
            }
          />
        ) : (
          <>
            <div>
              {totalMatching === 0 ? (
                <EmptyBlock
                  title="No matching jobs"
                  body="Try removing a filter or searching a wider area."
                  action={
                    <Button variant="outline" shape="rect" onClick={resetEverything}>
                      Clear filters
                    </Button>
                  }
                />
              ) : jobs.length === 0 ? (
                <EmptyBlock
                  title="No jobs in this area yet"
                  body="Look at jobs in nearby areas or change your area."
                  action={
                    <div className="flex flex-col items-center gap-3">
                      <Button variant="outline" shape="rect" onClick={onSearchArea}>
                        Explore nearby jobs
                      </Button>
                      <Button variant="outline" shape="rect" onClick={onChangeArea ?? onSearchArea}>
                        Change area
                      </Button>
                    </div>
                  }
                />
              ) : (
                <ul className="flex flex-col gap-3">
                  {jobs.map((job) => {
                    const saved = seeker.savedJobs.includes(job.slug);
                    const applied = seeker.applications.some((item) => item.jobSlug === job.slug && item.stage !== "withdrawn");
                    return (
                      <li key={job.slug}>
                        <div className="md:hidden">
                          <JobCard job={job} from={from} onSelect={onSelectJob} />
                        </div>
                        <div className="hidden md:block">
                          <FrameJobCardView
                            card={{ ...liveListCard(job, from), applied }}
                            saved={saved}
                            onOpen={() => onSelectJob(job)}
                            onToggleSave={() => actions.setSavedJob(job.slug, !saved)}
                          />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </>
        )}
      </div>
    </MapPanel>
  );
}
