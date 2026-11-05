"use client";

import { useState } from "react";

import { Icon } from "@/components/icon";
import { Tag } from "@/components/jobs/chip";
import { ApplyButton } from "@/components/jobs/apply-button";
import { CompanyMark } from "@/components/jobs/job-card";
import { LocationMap } from "@/components/map";
import { Badge } from "@/components/ui/badge";
import { Banner } from "@/components/ui/banner";
import { IconButton } from "@/components/ui/icon-button";
import { useSeekerActions } from "@/components/auth/use-seeker-actions";
import {
  employmentTypes,
  experienceLabel,
  formatDate,
  formatSalaryRange,
  listingStatus,
  timeAgo,
  workModes,
  type Job,
} from "@/lib/jobs";
import { activeApplicationFor, useSeeker } from "@/lib/seeker-store";
import { cn } from "@/lib/utils";

import { BulletList, MapPanel, SectionHeader, shareLink, type SheetSnap } from "./panel-parts";

/**
 * Job pin / card panel. Matches Around / Jobs / Job Detail Panel on S02
 * (2018:44934): right-hand sheet, back / save / share / close, then the
 * detail stack and a full-width apply bar. No photo carousel.
 */
export function JobDetailPanel({
  job,
  onBack,
  onSnapChange,
}: {
  job: Job;
  onBack: () => void;
  backLabel: string;
  onSnapChange?: (snap: SheetSnap) => void;
}) {
  const seeker = useSeeker();
  const actions = useSeekerActions();
  const application = activeApplicationFor(seeker, job.slug);
  const saved = seeker.savedJobs.includes(job.slug);
  const [notice, setNotice] = useState<string | null>(null);
  const status = listingStatus(job);
  const isRemote = job.workMode === "REMOTE";
  const address = isRemote
    ? "Remote"
    : `${job.company.streetAddress}, ${job.company.area}, ${job.city.name}, ${job.city.region} ${job.company.postalCode}`;
  return (
    <MapPanel key={job.slug} label={`${job.title} details`} dock="right" initialSnap="full" onDismiss={onBack} onSnapChange={onSnapChange}>
      <div className="flex shrink-0 items-center gap-1 px-4 pt-3 pb-2">
        <IconButton variant="outline" icon="arrowLeft" label="Back" onClick={onBack} iconClassName="size-5" className="max-md:size-11" />
        <span className="flex-1" />
        <button
          type="button"
          aria-pressed={saved}
          onClick={() => actions.setSavedJob(job.slug, !saved)}
          className={cn(
            "inline-flex h-11 items-center gap-1.5 rounded-full border bg-surface-default px-3 text-body-sm-semibold text-text-primary hover:bg-grey-100",
            saved && "border-brand-primary text-brand-primary",
          )}
        >
          <Icon name={saved ? "bookmarkFilled" : "bookmark"} className="size-5" />
          {saved ? "Saved" : "Save"}
        </button>
        <IconButton
          variant="outline"
          icon="share"
          label="Share job"
          iconClassName="size-5"
          onClick={async () => {
            const result = await shareLink(job.title, `/?job=${job.slug}`);
            if (result === "copied") setNotice("Link copied");
          }}
        />
        <IconButton variant="outline" icon="close" label="Close job details" onClick={onBack} iconClassName="size-5" />
      </div>
      <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-6">
        {status === "expired" && (
          <Banner tone="error">This job expired. The apply-by date has passed.</Banner>
        )}
        {status === "closed" && (
          <Banner tone="error">This job is closed. The employer is no longer hiring for this role.</Banner>
        )}
        {application && job.status === "open" && (
          <Banner tone="success">You applied on {formatDate(application.appliedOn)}</Banner>
        )}
        <div className="flex flex-col gap-2">
          <h2 className="text-heading-semibold text-text-primary">{job.title}</h2>
          <div className="flex items-center gap-2">
            <CompanyMark name={job.company.name} className="size-8 rounded-sm text-label-semibold" />
            <span className="text-body-semibold text-brand-primary">{job.company.name}</span>
            {job.company.verified && <Icon name="verified" className="size-5 text-success-700" />}
          </div>
          <div className="flex flex-wrap gap-1.5">
            <Badge type="salary">{job.salaryDisclosed ? formatSalaryRange(job.salary) : "Salary not disclosed"}</Badge>
            <Badge type="employment">{employmentTypes[job.employmentType]}</Badge>
            <Badge type="mode">{workModes[job.workMode]}</Badge>
            <Badge type="experience">{experienceLabel(job.experience)}</Badge>
          </div>
          <p className="flex items-center gap-1 text-label-medium text-text-secondary">
            <Icon name="pinSm" className="size-4" />
            {isRemote ? "Remote" : `${job.company.area}, ${job.city.name}`}
          </p>
          <p className="flex flex-wrap gap-x-3 text-label-medium text-text-tertiary">
            <span className="inline-flex items-center gap-1">
              <Icon name="calendar" className="size-4" />
              Posted {timeAgo(job.datePosted)}
            </span>
            {status === "open" && (
              <span className="inline-flex items-center gap-1">
                <Icon name="calendar" className="size-4" />
                Apply by {formatDate(job.validThrough)}
              </span>
            )}
          </p>
          <p className="text-label-medium text-text-tertiary">{job.applicants} applicants</p>
          {notice && (
            <p role="status" className="text-label-medium text-text-tertiary">
              {notice}
            </p>
          )}
        </div>
        <section className="flex flex-col gap-2">
          <SectionHeader title="Description" />
          <p className="text-body-sm-regular text-text-secondary">{job.summary}</p>
        </section>
        <section className="flex flex-col gap-2">
          <SectionHeader title="Requirements" />
          <BulletList items={job.requirements} />
        </section>
        <section className="flex flex-col gap-2">
          <SectionHeader title="Skills & qualifications" />
          <ul className="flex flex-wrap gap-2">
            {job.skills.map((skill) => (
              <Tag key={skill}>{skill}</Tag>
            ))}
          </ul>
        </section>
        <section className="flex flex-col gap-2">
          <SectionHeader title="Location details" />
          <p className="flex items-start gap-1.5 text-body-sm-regular text-text-secondary">
            <Icon name="pinSm" className="mt-0.5 size-4" />
            {address}
          </p>
          {!isRemote && (
            <div className="isolate h-30 w-full overflow-hidden rounded-sm">
              <LocationMap position={job.company.position} name={job.company.name} jobCount={0} compact />
            </div>
          )}
        </section>
      </div>
      <div className="shrink-0 border-t bg-surface-default px-5 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:px-6 md:py-4">
        <ApplyButton jobSlug={job.slug} status={status} className="w-full max-md:h-12" />
      </div>
    </MapPanel>
  );
}
