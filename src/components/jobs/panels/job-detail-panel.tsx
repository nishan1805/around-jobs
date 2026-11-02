"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";

import { Icon } from "@/components/icon";
import { Tag } from "@/components/jobs/chip";
import { LogoPlaceholder, VerifiedBadge } from "@/components/jobs/job-card";
import { LocationMap } from "@/components/map";
import { Badge } from "@/components/ui/badge";
import { Banner } from "@/components/ui/banner";
import { ApplyButton } from "@/components/jobs/apply-button";
import { IconButton } from "@/components/ui/icon-button";
import {
  employmentTypes,
  experienceLabel,
  formatDate,
  formatSalaryRange,
  jobPath,
  timeAgo,
  workModes,
  type Job,
} from "@/lib/jobs";
import { useSeekerActions } from "@/components/auth/use-seeker-actions";
import { activeApplicationFor, useSeeker } from "@/lib/seeker-store";
import { cn } from "@/lib/utils";

import { BulletList, GalleryHeader, MapPanel, SectionHeader, shareLink } from "./panel-parts";

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex w-full flex-col gap-2">
      <SectionHeader title={title} />
      {children}
    </section>
  );
}

/** Figma "Around / Jobs / Job Detail Panel" (1889:42525), screen S02. */
export function JobDetailPanel({
  job,
  onBack,
  backLabel,
}: {
  job: Job;
  onBack: () => void;
  backLabel: string;
}) {
  const seeker = useSeeker();
  const actions = useSeekerActions();
  const application = activeApplicationFor(seeker, job.slug);
  const saved = seeker.savedJobs.includes(job.slug);
  const [expanded, setExpanded] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const isRemote = job.workMode === "REMOTE";

  return (
    <MapPanel label={`${job.title} details`} onDismiss={onBack}>
      <div className="flex-1 overflow-y-auto overscroll-contain">
        <GalleryHeader
          name={job.company.name}
          photoCount={job.company.photoCount}
          nav={{ icon: "arrowLeft", label: backLabel, onClick: onBack }}
        />

        <div className="flex flex-col gap-5 p-6">
          {job.status === "expired" && (
            <Banner tone="error">This job has expired and is no longer accepting applications.</Banner>
          )}
          {job.status === "closed" && (
            <Banner tone="error">This job is closed. The employer is no longer hiring for this role.</Banner>
          )}
          {application && job.status === "open" && (
            <Banner tone="success">You applied for this job on {formatDate(application.appliedOn)}.</Banner>
          )}

          <div className="flex flex-col gap-2">
            <div className="flex items-start gap-2">
              <h2 className="min-w-0 flex-1 text-heading-semibold text-text-primary">
                <Link href={jobPath(job)} className="hover:underline">
                  {job.title}
                </Link>
              </h2>
              <IconButton
                variant="outline"
                icon={saved ? "bookmarkFilled" : "bookmark"}
                label={saved ? "Remove job from saved" : "Save job"}
                aria-pressed={saved}
                onClick={() => actions.setSavedJob(job.slug, !saved)}
                className={cn(saved && "text-brand-primary")}
              />
              <IconButton
                variant="outline"
                icon="share"
                label="Share job"
                onClick={async () => {
                  const result = await shareLink(job.title, jobPath(job));
                  if (result === "copied") setNotice("Link copied");
                }}
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <LogoPlaceholder className="size-8" />
              <span className="text-body-semibold text-text-primary">{job.company.name}</span>
              <VerifiedBadge verified={job.company.verified} />
              {application && <Badge type="applied">Applied</Badge>}
            </div>
            <p className="text-body-semibold text-text-primary">
              {job.salaryDisclosed ? formatSalaryRange(job.salary) : "Salary not disclosed"}
            </p>
            <div className="flex flex-wrap gap-1.5">
              <Badge type="employment">{employmentTypes[job.employmentType]}</Badge>
              <Badge type="mode">{workModes[job.workMode]}</Badge>
              <Badge type="experience">{experienceLabel(job.experience)}</Badge>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-label-medium text-text-tertiary">
              <span className="flex items-center gap-1">
                <Icon name="calendar" className="size-4" />
                Posted {formatDate(job.datePosted)} ({timeAgo(job.datePosted)})
              </span>
              {job.status === "open" && (
                <span className="flex items-center gap-1">
                  <Icon name="calendar" className="size-4" />
                  Apply by {formatDate(job.validThrough)}
                </span>
              )}
              {job.status === "expired" && (
                <span className="flex items-center gap-1 text-error-500">
                  <Icon name="calendar" className="size-4" />
                  Deadline expired {formatDate(job.validThrough)}
                </span>
              )}
              {job.status === "closed" && (
                <span className="flex items-center gap-1">
                  <Icon name="calendar" className="size-4" />
                  Closed by employer
                </span>
              )}
            </div>
            <p className="text-label-medium text-text-tertiary">{job.applicants} applicants</p>
            {notice && (
              <p role="status" className="text-label-medium text-text-tertiary">
                {notice}
              </p>
            )}
          </div>

          <Section title="Description">
            <p id={`${job.slug}-description`} className={cn("text-body-sm-regular text-text-secondary", !expanded && "line-clamp-3")}>
              {job.summary}
            </p>
            <button
              type="button"
              aria-expanded={expanded}
              aria-controls={`${job.slug}-description`}
              onClick={() => setExpanded((value) => !value)}
              className="flex items-center gap-1 self-start text-body-sm-semibold text-brand-primary"
            >
              {expanded ? "Read less" : "Read more"}
              <Icon name="chevronDown" className={cn("size-4 transition-transform", expanded && "rotate-180")} />
            </button>
          </Section>

          <Section title="Responsibilities">
            <BulletList items={job.responsibilities} />
          </Section>
          <Section title="Requirements">
            <BulletList items={job.requirements} />
          </Section>
          <Section title="Skills & qualifications">
            <ul className="flex flex-wrap gap-2">
              {job.skills.map((skill) => (
                <Tag key={skill}>{skill}</Tag>
              ))}
            </ul>
            <BulletList items={job.skillNotes} />
          </Section>
          <Section title="Education">
            <p className="text-body-sm-regular text-text-secondary">{job.education}</p>
          </Section>
          <Section title="Benefits">
            <BulletList items={job.benefits} />
          </Section>
          <Section title="Location">
            <p className="flex items-center gap-1.5 text-body-sm-regular text-text-secondary">
              <Icon name="pin" className="size-5" />
              {isRemote
                ? `Remote · Work from home within ${job.city.region}`
                : `${job.company.streetAddress}, ${job.company.area}, ${job.city.name}, ${job.city.region}`}
            </p>
            {!isRemote && (
              <div className="isolate h-30 w-full overflow-hidden rounded-sm">
                <LocationMap position={job.company.position} name={job.company.name} jobCount={0} compact />
              </div>
            )}
          </Section>
        </div>
      </div>

      <div className="shrink-0 border-t bg-surface-default px-6 py-4">
        <ApplyButton jobSlug={job.slug} status={job.status} className="w-full" />
      </div>
    </MapPanel>
  );
}
