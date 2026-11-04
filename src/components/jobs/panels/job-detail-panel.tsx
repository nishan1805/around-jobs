"use client";

import { useState } from "react";
import Image from "next/image";

import { Icon } from "@/components/icon";
import { Tag } from "@/components/jobs/chip";
import { ApplyButton } from "@/components/jobs/apply-button";
import { LogoPlaceholder } from "@/components/jobs/job-card";
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
  timeAgo,
  workModes,
  type Job,
} from "@/lib/jobs";
import { employerOverviewSeed } from "@/lib/seeker-design-seed";
import { activeApplicationFor, useSeeker } from "@/lib/seeker-store";
import { cn } from "@/lib/utils";

import { BulletList, MapPanel, SectionHeader, shareLink } from "./panel-parts";

/**
 * Job pin / card panel. Matches Around / Jobs / Job Detail Panel on S02
 * (2018:44934): right-hand sheet, back / save / share / close, then the
 * detail stack and a full-width apply bar. No photo carousel.
 */
export function JobDetailPanel({
  job,
  onBack,
}: {
  job: Job;
  onBack: () => void;
  backLabel: string;
}) {
  const seeker = useSeeker();
  const actions = useSeekerActions();
  const application = activeApplicationFor(seeker, job.slug);
  const saved = seeker.savedJobs.includes(job.slug);
  const [notice, setNotice] = useState<string | null>(null);
  const isRemote = job.workMode === "REMOTE";
  const address = isRemote
    ? "Remote"
    : `${job.company.streetAddress}, ${job.company.area}, ${job.city.name}, ${job.city.region} ${job.company.postalCode}`;
  const sampleLogo = job.slug === "civil-engineer" ? employerOverviewSeed.logo : null;

  return (
    <MapPanel label={`${job.title} details`} dock="right" onDismiss={onBack}>
      <div className="flex shrink-0 items-center gap-1 px-4 pt-3 pb-2">
        <IconButton variant="outline" icon="arrowLeft" label="Back" onClick={onBack} iconClassName="size-5" />
        <span className="flex-1" />
        <IconButton
          variant="outline"
          icon={saved ? "bookmarkFilled" : "bookmark"}
          label={saved ? "Remove job from saved" : "Save job"}
          aria-pressed={saved}
          onClick={() => actions.setSavedJob(job.slug, !saved)}
          className={cn(saved && "text-brand-primary")}
          iconClassName="size-5"
        />
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
        {job.status === "expired" && (
          <Banner tone="error">This job is no longer accepting applications.</Banner>
        )}
        {job.status === "closed" && (
          <Banner tone="error">This job is closed. The employer is no longer hiring for this role.</Banner>
        )}
        {application && job.status === "open" && (
          <Banner tone="success">You applied on {formatDate(application.appliedOn)}</Banner>
        )}
        <div className="flex flex-col gap-2">
          <h2 className="text-heading-semibold text-text-primary">{job.title}</h2>
          <div className="flex items-center gap-2">
            {sampleLogo ? (
              <Image src={sampleLogo} alt="" width={32} height={32} className="size-8 rounded-sm object-cover" />
            ) : (
              <LogoPlaceholder className="size-8 rounded-sm" />
            )}
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
            {job.status === "open" && (
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
      <div className="shrink-0 border-t bg-surface-default px-6 py-4">
        <ApplyButton jobSlug={job.slug} status={job.status} className="w-full" />
      </div>
    </MapPanel>
  );
}
