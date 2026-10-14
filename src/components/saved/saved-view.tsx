"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { JobCard, JobCardSkeleton } from "@/components/jobs/job-card";
import { Chip } from "@/components/jobs/chip";
import { EmptyPage, PageHeader } from "@/components/page-header";
import { SeekerPage } from "@/components/seeker-page";
import { Button, buttonVariants } from "@/components/ui/button";
import { EmptyBlock } from "@/components/ui/empty-block";
import { cities, daysSince, distanceKm, isExpiringSoon, jobs, type Job } from "@/lib/jobs";
import { useSeeker } from "@/lib/seeker-store";

const INTRO = "Keep jobs you like here and apply when you are ready.";
const from = cities[0].center;
const jobsBySlug = new Map(jobs.map((job) => [job.slug, job]));

export const NEARBY_KM = 4;
export const RECENTLY_SAVED_DAYS = 3;

type SavedFilter = "all" | "nearby" | "recent";

const savedFilters: { key: SavedFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "nearby", label: "Nearby" },
  { key: "recent", label: "Recently added" },
];

export function SavedView() {
  return (
    <SeekerPage
      active="saved"
      title="Saved jobs"
      intro={INTRO}
      loginIcon="bookmark"
      loginTitle="Log in to see your saved jobs"
      loginBody="Jobs you save are kept with your mobile number so you can apply later."
      skeleton={
        <div className="grid gap-4 md:grid-cols-2 md:gap-6 min-[80rem]:grid-cols-3">
          {[0, 1, 2].map((index) => (
            <JobCardSkeleton key={index} />
          ))}
        </div>
      }
    >
      <SavedContent />
    </SeekerPage>
  );
}

function SavedContent() {
  const seeker = useSeeker();
  const [filter, setFilter] = useState<SavedFilter>("all");

  const saved = useMemo(
    () => seeker.savedJobs.flatMap((slug) => jobsBySlug.get(slug) ?? []),
    [seeker.savedJobs],
  );
  const matches = (job: Job, key: SavedFilter) => {
    if (key === "nearby") return job.workMode !== "REMOTE" && distanceKm(from, job.company.position) <= NEARBY_KM;
    if (key === "recent") {
      const savedOn = seeker.savedOn[job.slug];
      return savedOn !== undefined && daysSince(savedOn) <= RECENTLY_SAVED_DAYS;
    }
    return true;
  };
  const visible = saved.filter((job) => matches(job, filter));

  if (saved.length === 0) {
    return (
      <>
        <PageHeader title="Saved jobs" subtitle={INTRO} />
        <EmptyPage
          icon="bookmark"
          title="Nothing saved yet"
          body="Tap the bookmark on any job to save it for later."
          action={
            <Link href="/" className={buttonVariants()}>
              Browse jobs
            </Link>
          }
        />
      </>
    );
  }

  const expiring = saved.filter(isExpiringSoon).length;
  const isSample = saved.some((job) => job.company.name.includes("(Sample)"));
  const subtitle = `${saved.length} saved ${saved.length === 1 ? "job" : "jobs"}${expiring ? `, ${expiring} expiring soon` : ""}.${isSample ? " (Sample)" : ""}`;

  return (
    <>
      <PageHeader
        title="Saved jobs"
        subtitle={subtitle}
        mobileSubtitle={`${saved.length} saved ${saved.length === 1 ? "job" : "jobs"}${expiring ? ` · ${expiring} expiring soon` : ""}`}
      />

      <div role="group" aria-label="Filter saved jobs" className="-mx-5 flex shrink-0 gap-2 overflow-x-auto px-5 md:mx-0 md:px-0">
        {savedFilters.map(({ key, label }) => (
          <Chip key={key} selected={filter === key} onClick={() => setFilter(key)}>
            {label} · {saved.filter((job) => matches(job, key)).length}
          </Chip>
        ))}
      </div>

      {visible.length === 0 ? (
        <EmptyBlock
          icon="bookmark"
          title={filter === "nearby" ? `No saved jobs within ${NEARBY_KM} km` : "Nothing saved in the last few days"}
          body="Your other saved jobs are still under All."
          className="rounded-xl border bg-surface-default"
          action={
            <Button variant="outline" size="sm" onClick={() => setFilter("all")}>
              Show all saved jobs
            </Button>
          }
        />
      ) : (
        <ul aria-label="Saved jobs" className="grid items-start gap-4 md:grid-cols-2 md:gap-6 min-[80rem]:grid-cols-3">
          {visible.map((job) => (
            <li key={job.slug} className="flex">
              <JobCard job={job} from={from} variant="saved" />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
