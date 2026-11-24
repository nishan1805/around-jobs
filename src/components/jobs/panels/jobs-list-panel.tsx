"use client";

import { FrameJobCardView } from "@/components/jobs/frame-job-card";
import { JobCard, JobCardSkeleton } from "@/components/jobs/job-card";
import { Button } from "@/components/ui/button";
import { EmptyBlock } from "@/components/ui/empty-block";
import { IconButton } from "@/components/ui/icon-button";
import { useSeekerActions } from "@/components/auth/use-seeker-actions";
import { experienceLabel, formatSalaryShort, locationLine, relativeDay, type EmploymentType, type Job } from "@/lib/jobs";
import type { FrameJobCard } from "@/lib/seeker-design-seed";
import { useSeeker } from "@/lib/seeker-store";

import { MapPanel, type SheetSnap } from "./panel-parts";

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
  filtered,
  onResetFilters,
  onClose,
  onSelectJob,
  onSearchArea,
  onChangeArea,
  onRetry,
  from,
  onSnapChange,
}: {
  cityName: string;
  status: ListStatus;
  /** Matching jobs inside the visible map area (plus remote jobs). */
  jobs: Job[];
  /** Matching jobs anywhere in the city. */
  totalMatching: number;
  filtered: boolean;
  onResetFilters: () => void;
  onClose: () => void;
  onSelectJob: (job: Job) => void;
  onSearchArea: () => void;
  onChangeArea?: () => void;
  onRetry: () => void;
  from: [number, number];
  onSnapChange?: (snap: SheetSnap) => void;
}) {
  const seeker = useSeeker();
  const actions = useSeekerActions();

  const count = plural(jobs.length, "job");
  const subtitle =
    status === "loading"
      ? "Finding jobs…"
      : status === "error"
        ? "Something went wrong"
        : jobs.length === 0 && totalMatching > 0
          ? "0 jobs in this area"
          : filtered
            ? `${count} ${jobs.length === 1 ? "matches" : "match"} your filters`
            : `${count} near you`;

  return (
    <MapPanel label={`Jobs in ${cityName}`} initialSnap="half" onDismiss={onClose} onSnapChange={onSnapChange}>
      <div className="flex shrink-0 items-center gap-3 px-5 pt-1 pb-4 md:p-6">
        <IconButton variant="plain" icon="chevronLeft" label="Back to map" onClick={onClose} className="-ml-1 size-11 md:hidden" />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <h2 className="text-heading-semibold text-text-primary">Jobs in {cityName}</h2>
          <p data-job-count={jobs.length} aria-live="polite" className="text-label-medium text-text-tertiary">{subtitle}</p>
        </div>
        <IconButton variant="outline" icon="close" label="Close jobs list" onClick={onClose} className="size-10 max-md:hidden" />
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
                    <Button variant="outline" shape="rect" onClick={onResetFilters}>
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
