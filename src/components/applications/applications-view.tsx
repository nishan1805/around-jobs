"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { ApplicationCard, ApplicationCardSkeleton } from "@/components/applications/application-card";
import { ApplicationPreview } from "@/components/applications/application-preview";
import { Chip } from "@/components/jobs/chip";
import { EmptyPage, PageHeader } from "@/components/page-header";
import { SeekerPage } from "@/components/seeker-page";
import { Button, buttonVariants } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { EmptyBlock } from "@/components/ui/empty-block";
import { breakpoints, useMediaQuery } from "@/hooks/use-media-query";
import { applicationGroups, groupOf, type ApplicationGroup } from "@/lib/applications";
import { cities, jobs, type Job } from "@/lib/jobs";
import { useSeeker, type Application } from "@/lib/seeker-store";
import { cn } from "@/lib/utils";

const INTRO = "Track every job you apply to, all in one place.";
const from = cities[0].center;
const jobsBySlug = new Map(jobs.map((job) => [job.slug, job]));

type Row = { application: Application; job: Job; group: ApplicationGroup };

function summary(rows: Row[]) {
  const count = (group: ApplicationGroup) => rows.filter((row) => row.group === group).length;
  const shortlisted = count("shortlisted");
  const interviews = count("interview");
  const parts = [
    shortlisted > 0 && `${shortlisted} ${shortlisted === 1 ? "is" : "are"} shortlisted`,
    interviews > 0 && `${interviews} ${interviews === 1 ? "has an interview" : "have interviews"}`,
  ].filter(Boolean);
  const text = `You applied to ${rows.length} ${rows.length === 1 ? "job" : "jobs"}.${parts.length ? ` ${parts.join(" and ")}.` : ""}`;
  return rows.some((row) => row.application.sample) ? `${text} (Sample)` : text;
}

export function ApplicationsView() {
  return (
    <SeekerPage
      active="applications"
      title="Your applications"
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
  const isSplit = useMediaQuery(breakpoints.split);
  const [group, setGroup] = useState<ApplicationGroup | "all">("all");
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const rows = useMemo<Row[]>(
    () =>
      seeker.applications.flatMap((application) => {
        const job = jobsBySlug.get(application.jobSlug);
        return job ? [{ application, job, group: groupOf(application, job) }] : [];
      }),
    [seeker.applications],
  );
  const visible = group === "all" ? rows : rows.filter((row) => row.group === group);
  const selected = visible.find((row) => row.job.slug === selectedSlug) ?? visible[0] ?? null;

  if (rows.length === 0) {
    return (
      <>
        <PageHeader title="Your applications" subtitle={INTRO} />
        <EmptyPage
          icon="briefcase"
          title="No applications yet"
          body="Find a job nearby you like and apply in a minute. It will show up here."
          action={
            <Link href="/" className={buttonVariants()}>
              Find jobs near you
            </Link>
          }
        />
      </>
    );
  }

  return (
    <>
      <PageHeader title="Your applications" subtitle={summary(rows)} />

      <div role="group" aria-label="Filter by status" className="-mx-5 flex shrink-0 gap-2 overflow-x-auto px-5 md:mx-0 md:flex-wrap md:px-0">
        <Chip selected={group === "all"} onClick={() => setGroup("all")}>
          All · {rows.length}
        </Chip>
        {applicationGroups.map(({ key, label }) => (
          <Chip key={key} selected={group === key} onClick={() => setGroup(key)}>
            {label} · {rows.filter((row) => row.group === key).length}
          </Chip>
        ))}
      </div>

      <div className="flex flex-col gap-6 min-[80rem]:flex-row min-[80rem]:items-start">
        <ul aria-label="Applications" className="flex min-w-0 flex-1 flex-col gap-4">
          {visible.length === 0 && (
            <li>
              <EmptyBlock
                icon="navApplications"
                title={`No ${applicationGroups.find((item) => item.key === group)?.label.toLowerCase()} applications`}
                body="Applications move here as employers update them."
                className="rounded-xl border bg-surface-default"
                action={
                  <Button variant="outline" size="sm" onClick={() => setGroup("all")}>
                    Show all applications
                  </Button>
                }
              />
            </li>
          )}
          {visible.map(({ application, job }) => (
            <li key={job.slug}>
              <ApplicationCard
                application={application}
                job={job}
                from={from}
                selected={isSplit && selected?.job.slug === job.slug}
                onSelect={() => {
                  setSelectedSlug(job.slug);
                  if (!isSplit) setSheetOpen(true);
                }}
              />
            </li>
          ))}
        </ul>

        {selected && isSplit && (
          <ApplicationPreview
            key={selected.job.slug}
            application={selected.application}
            job={selected.job}
            from={from}
            className={cn("sticky top-0 w-100 shrink-0 rounded-2xl border bg-surface-default p-6 shadow-md")}
          />
        )}
      </div>

      {selected && !isSplit && (
        <Dialog open={sheetOpen} onOpenChange={setSheetOpen}>
          <ApplicationPreview application={selected.application} job={selected.job} from={from} />
          <Button variant="outline" shape="rect" className="w-full" onClick={() => setSheetOpen(false)}>
            Close
          </Button>
        </Dialog>
      )}
    </>
  );
}
