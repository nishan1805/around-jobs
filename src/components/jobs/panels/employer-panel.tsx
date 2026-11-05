"use client";

import { useState } from "react";

import { Icon } from "@/components/icon";
import { FrameJobCardView } from "@/components/jobs/frame-job-card";
import { CompanyMark } from "@/components/jobs/job-card";
import { IconButton } from "@/components/ui/icon-button";
import { useSeekerActions } from "@/components/auth/use-seeker-actions";
import {
  experienceLabel,
  formatRupees,
  timeAgo,
  type Company,
  type EmploymentType,
  type Job,
} from "@/lib/jobs";
import { useSeeker } from "@/lib/seeker-store";
import type { FrameJobCard } from "@/lib/seeker-design-seed";
import { cn } from "@/lib/utils";

import { MapPanel, shareLink, type SheetSnap } from "./panel-parts";

const cardEmployment: Record<EmploymentType, string> = {
  FULL_TIME: "Full Time",
  PART_TIME: "Part Time",
  CONTRACTOR: "Contract",
  INTERN: "Internship",
};

function toCard(job: Job, cityName: string): FrameJobCard {
  return {
    id: job.slug,
    title: job.title,
    location: `${job.company.area}, ${cityName}`,
    salary: job.salaryDisclosed
      ? `${formatRupees(job.salary.min)} – ${formatRupees(job.salary.max)}`
      : "Salary not disclosed",
    employment: cardEmployment[job.employmentType],
    experience: experienceLabel(job.experience).replace("–", "-"),
    posted: `Posted ${timeAgo(job.datePosted)}`,
  };
}

/**
 * Company pin panel. Matches Around / Jobs / Employer Overview Panel on S01
 * (2018:42720): right-hand sheet, logo and share/close, Jobs and About tabs,
 * and the employer job card. No photo carousel.
 */
export function EmployerPanel({
  company,
  jobs,
  cityName,
  onClose,
  onSelectJob,
  onSnapChange,
}: {
  company: Company;
  jobs: Job[];
  from: [number, number];
  cityName: string;
  onClose: () => void;
  onSelectJob: (job: Job) => void;
  onSnapChange?: (snap: SheetSnap) => void;
}) {
  const seeker = useSeeker();
  const actions = useSeekerActions();
  const [tab, setTab] = useState<"jobs" | "about">("jobs");
  const [notice, setNotice] = useState<string | null>(null);
  const location = `${company.streetAddress}, ${company.area}, ${cityName}`;
  const overview =
    jobs[0]?.summary ??
    `${company.name} hires for ${company.category.toLowerCase()} roles in ${company.area}, ${cityName}.`;

  return (
    <MapPanel key={company.slug} label={`${company.name} overview`} dock="right" initialSnap="half" onDismiss={onClose} onSnapChange={onSnapChange}>
      <div className="flex shrink-0 flex-col gap-5 py-4 pr-4 pl-6">
        <div className="flex items-start gap-3">
          <CompanyMark name={company.name} className="size-16 rounded-md text-subheading-semibold" />
          <span className="flex-1" />
          <div className="flex gap-1">
            <IconButton
              variant="outline"
              icon="share"
              label="Share employer"
              iconClassName="size-5"
              onClick={async () => {
                const result = await shareLink(company.name, `/?company=${company.slug}`);
                if (result === "copied") setNotice("Link copied");
              }}
            />
            <IconButton variant="outline" icon="close" label="Close employer details" onClick={onClose} iconClassName="size-5" />
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-1">
            <h2 className="text-subheading-semibold text-text-primary">{company.name}</h2>
            {company.verified && <Icon name="verified" className="size-6 text-success-700" />}
          </div>
          <div className="flex flex-col gap-2">
            <p className="flex items-center gap-1 text-label-medium text-text-secondary">
              <Icon name="briefcase" className="size-4" />
              {company.category}
            </p>
            <p className="flex items-center gap-1 text-label-medium text-text-secondary">
              <Icon name="pinSm" className="size-4" />
              {location}
            </p>
          </div>
          <div className="flex gap-2">
            <span aria-label="Website" className="flex size-9 items-center justify-center rounded-sm border bg-background-secondary">
              <Icon name="globe" className="size-4.5" />
            </span>
            <span aria-label="LinkedIn" className="flex size-9 items-center justify-center rounded-sm border bg-background-secondary">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/icons/linkedin.svg" alt="" width={18} height={18} />
            </span>
            <span aria-label="Instagram" className="flex size-9 items-center justify-center rounded-sm border bg-background-secondary">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/icons/instagram.svg" alt="" width={18} height={18} />
            </span>
          </div>
          {notice && (
            <p role="status" className="text-label-medium text-text-tertiary">
              {notice}
            </p>
          )}
        </div>
      </div>
      <div className="flex shrink-0 border-b">
        {(
          [
            ["jobs", `Jobs (${jobs.length})`],
            ["about", "About"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={cn(
              "flex-1 px-4 py-3 text-body-sm-semibold",
              tab === key ? "border-b-2 border-brand-primary bg-primary-50 text-brand-primary" : "text-text-secondary",
            )}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-6 py-4">
        {tab === "jobs" ? (
          jobs.length === 0 ? (
            <div className="flex flex-col items-center gap-2 pt-8">
              <span className="flex rounded-full bg-primary-50 p-4 text-brand-primary">
                <Icon name="briefcase" className="size-5" />
              </span>
              <p className="text-body-semibold text-text-primary">No open jobs right now</p>
              <p className="w-full max-w-80 text-center text-body-sm-regular text-text-secondary">
                This employer has no active openings. Save them to see new jobs here.
              </p>
            </div>
          ) : (
            jobs.map((job) => (
              <FrameJobCardView
                key={job.slug}
                card={toCard(job, cityName)}
                layout="employer"
                saved={seeker.savedJobs.includes(job.slug)}
                onOpen={() => onSelectJob(job)}
                onToggleSave={() => actions.setSavedJob(job.slug, !seeker.savedJobs.includes(job.slug))}
              />
            ))
          )
        ) : (
          <div className="flex flex-col gap-6">
            <section className="flex flex-col gap-3">
              <h3 className="text-body-semibold text-text-primary">Key details</h3>
              {(
                [
                  ["briefcase", company.category],
                  ["pinSm", location],
                ] as const
              ).map(([icon, label]) => (
                <p key={label} className="flex items-center gap-3 text-body-sm-regular text-text-primary">
                  <span className="flex size-7 items-center justify-center rounded-md bg-grey-100">
                    <Icon name={icon} className="size-4" />
                  </span>
                  {label}
                </p>
              ))}
            </section>
            <section className="flex flex-col gap-2">
              <h3 className="text-body-semibold text-text-primary">Overview</h3>
              <p className="text-body-sm-regular text-text-secondary">{overview}</p>
            </section>
          </div>
        )}
      </div>
    </MapPanel>
  );
}
