"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { ApplicationCard, ApplicationCardSkeleton } from "@/components/applications/application-card";
import { Icon } from "@/components/icon";
import { Chip } from "@/components/jobs/chip";
import { SeekerPage } from "@/components/seeker-page";
import { buttonVariants } from "@/components/ui/button";
import { useSearchParam } from "@/hooks/use-search-param";
import { isClosedApplication, type ApplicationListFilter } from "@/lib/applications";
import { jobs, type Job } from "@/lib/jobs";
import { useSeeker, type Application } from "@/lib/seeker-store";
import { cn } from "@/lib/utils";

const INTRO = "Track your applications and follow their progress.";
const jobsBySlug = new Map(jobs.map((job) => [job.slug, job]));

type Row = { application: Application; job: Job };

const filters: { key: ApplicationListFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "progress", label: "In progress" },
  { key: "closed", label: "Closed" },
];

export function ApplicationsView() {
  return (
    <SeekerPage
      active="applications"
      title="My Applications"
      intro={INTRO}
      loginIcon="navApplications"
      loginTitle="Log in to see your applications"
      loginBody="Your applications and their status are saved to your mobile number."
      skeleton={[0, 1, 2].map((index) => <ApplicationCardSkeleton key={index} />)}
    >
      <ApplicationsContent />
    </SeekerPage>
  );
}

function ApplicationsContent() {
  const seeker = useSeeker();
  const emptyPreview = useSearchParam("empty") === "1";
  const [filter, setFilter] = useState<ApplicationListFilter>("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"recent" | "oldest">("recent");
  const [sortOpen, setSortOpen] = useState(false);

  const rows = useMemo<Row[]>(
    () =>
      seeker.applications.flatMap((application) => {
        const job = jobsBySlug.get(application.jobSlug);
        return job ? [{ application, job }] : [];
      }),
    [seeker.applications],
  );

  if (rows.length === 0 || emptyPreview) {
    return <ApplicationsEmpty />;
  }

  const counts = {
    all: rows.length,
    progress: rows.filter((row) => !isClosedApplication(row.application, row.job)).length,
    closed: rows.filter((row) => isClosedApplication(row.application, row.job)).length,
  };
  const needle = query.trim().toLowerCase();
  const visible = rows
    .filter((row) => (filter === "all" ? true : filter === "closed" ? isClosedApplication(row.application, row.job) : !isClosedApplication(row.application, row.job)))
    .filter((row) => {
      if (!needle) return true;
      return `${row.job.title} ${row.job.company.name}`.toLowerCase().includes(needle);
    })
    .sort((a, b) => {
      const order = a.application.appliedOn.localeCompare(b.application.appliedOn);
      return sort === "recent" ? -order : order;
    });

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-heading-semibold text-text-primary md:text-display-small-semibold">My Applications</h1>
        <p className="text-body-sm-regular text-text-secondary">{INTRO}</p>
      </header>

      <div role="group" aria-label="Filter applications" className="flex gap-2">
        {filters.map(({ key, label }) => (
          <Chip key={key} selected={filter === key} onClick={() => setFilter(key)} className="h-8 px-3">
            {label} ({counts[key]})
          </Chip>
        ))}
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <label className="flex h-11 w-full items-center gap-2 rounded-2xl border border-grey-200 bg-surface-default px-3 md:w-[360px]">
          <Icon name="search" className="size-5 text-text-tertiary" />
          <span className="sr-only">Search applications</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search applications by job title or company…"
            className="min-w-0 flex-1 bg-transparent text-body-sm-regular text-text-primary outline-none placeholder:text-text-tertiary"
          />
        </label>
        <div className="relative md:ml-auto">
          <button
            type="button"
            aria-expanded={sortOpen}
            onClick={() => setSortOpen((open) => !open)}
            className="flex h-11 items-center gap-2 rounded-2xl border border-grey-200 bg-surface-default px-3 text-body-sm-regular"
          >
            <span className="text-text-tertiary">Sort by:</span>
            <span className="text-text-primary">{sort === "recent" ? "Most recent" : "Oldest"}</span>
            <Icon name="chevronDown" className={cn("size-4 text-text-tertiary", sortOpen && "rotate-180")} />
          </button>
          {sortOpen && (
            <div className="absolute top-[calc(100%+8px)] right-0 z-20 w-44 rounded-lg border bg-surface-default p-1 shadow-lg">
              {(
                [
                  ["recent", "Most recent"],
                  ["oldest", "Oldest"],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    setSort(key);
                    setSortOpen(false);
                  }}
                  className={cn(
                    "flex w-full rounded-md px-3 py-2 text-left text-body-sm-medium hover:bg-grey-50",
                    sort === key && "bg-primary-50 text-brand-primary",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="rounded-2xl border border-dashed bg-surface-default px-6 py-10 text-center text-body-sm-regular text-text-secondary">
          No applications match this search.
        </p>
      ) : (
        <ul aria-label="Applications" className="flex flex-col gap-3">
          {visible.map((row) => (
            <li key={row.job.slug}>
              <ApplicationCard application={row.application} job={row.job} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ApplicationsEmpty() {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-heading-semibold text-text-primary md:text-display-small-semibold">My Applications</h1>
        <p className="text-body-sm-regular text-text-secondary">{INTRO}</p>
      </header>
      <div className="flex flex-1 flex-col items-center justify-center gap-4 py-16 text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/illustrations/applications-empty.svg" alt="" width={280} height={200} />
        <div className="flex max-w-[360px] flex-col gap-2">
          <p className="text-subheading-semibold text-text-primary">No applications yet</p>
          <p className="text-body-sm-regular text-text-secondary">
            Jobs you apply to will appear here. Track application updates and follow your progress in one place.
          </p>
        </div>
        <Link href="/" className={buttonVariants({ shape: "rect" })}>
          Explore jobs
        </Link>
      </div>
    </div>
  );
}
