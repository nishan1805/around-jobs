"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { JobCard, JobCardSkeleton } from "@/components/jobs/job-card";
import { Chip } from "@/components/jobs/chip";
import { PageHeader } from "@/components/page-header";
import { SeekerPage } from "@/components/seeker-page";
import { Button, buttonVariants } from "@/components/ui/button";
import { EmptyBlock } from "@/components/ui/empty-block";
import { useSearchParam } from "@/hooks/use-search-param";
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
  const router = useRouter();
  const [filter, setFilter] = useState<SavedFilter>("all");
  const emptyPreview = useSearchParam("empty") === "1";

  const saved = useMemo(() => {
    const unique = [...new Set(seeker.savedJobs)];
    return unique.flatMap((slug) => {
      const job = jobsBySlug.get(slug);
      return job ? [job] : [];
    });
  }, [seeker.savedJobs]);

  const matches = (job: Job, key: SavedFilter) => {
    if (key === "nearby") return job.workMode !== "REMOTE" && distanceKm(from, job.company.position) <= NEARBY_KM;
    if (key === "recent") {
      const savedOn = seeker.savedOn[job.slug];
      return savedOn !== undefined && daysSince(savedOn) <= RECENTLY_SAVED_DAYS;
    }
    return true;
  };
  const visible = saved.filter((job) => matches(job, filter));
  const expiring = saved.filter(isExpiringSoon).length;
  const subtitle = `${saved.length} saved ${saved.length === 1 ? "job" : "jobs"}${expiring ? `, ${expiring} expiring soon` : ""}.`;

  if (saved.length === 0 || emptyPreview) {
    return (
      <div className="flex min-h-0 flex-1 flex-col gap-6">
        <header className="hidden flex-col gap-1 md:flex">
          <h1 className="text-display-small-semibold text-text-primary">Saved jobs</h1>
          <p className="text-body-sm-regular text-text-secondary">{INTRO}</p>
        </header>
        <div className="flex flex-1 flex-col items-center justify-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/illustrations/saved-empty.svg" alt="" width={280} height={200} className="hidden md:block" />
          <EmptyBlock
            icon="bookmark"
            title="No saved jobs yet"
            body="Tap the bookmark on any job to save it here for later."
            className="md:border-0 md:bg-transparent"
            action={
              <Link href="/" className={buttonVariants({ shape: "pill" })}>
                Browse jobs
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="md:hidden">
        <PageHeader
          title="Saved jobs"
          titleClassName="hidden"
          subtitle={subtitle}
          mobileSubtitle={`${saved.length} saved ${saved.length === 1 ? "job" : "jobs"}${expiring ? ` · ${expiring} expiring soon` : ""}`}
        />
      </div>
      <header className="hidden flex-col gap-1 md:flex">
        <h1 className="text-display-small-semibold text-text-primary">Saved jobs</h1>
        <p className="text-body-sm-regular text-text-secondary">{subtitle}</p>
      </header>
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
              <JobCard job={job} from={from} variant="saved" onSelect={() => router.push(`/?job=${job.slug}`)} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
