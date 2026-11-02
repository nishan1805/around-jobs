"use client";

import { useState } from "react";
import Image from "next/image";

import { Icon } from "@/components/icon";
import { FrameJobCardView } from "@/components/jobs/frame-job-card";
import { Tag } from "@/components/jobs/chip";
import { Banner } from "@/components/ui/banner";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import {
  civilEngineerDetail,
  employerOverviewSeed,
  jobDetailVariantCopy,
  type JobDetailVariant,
} from "@/lib/seeker-design-seed";
import { cn } from "@/lib/utils";

import { MapPanel, SectionHeader } from "./panel-parts";

export type EmployerVariant = "jobs" | "about" | "one" | "empty" | "unverified";

function RoundIcon({ icon, label, onClick }: { icon: "arrowLeft" | "bookmark" | "bookmarkFilled" | "share" | "close"; label: string; onClick?: () => void }) {
  return <IconButton variant="outline" icon={icon} label={label} onClick={onClick} iconClassName="size-5" />;
}

/** S01 employer overview, plus the one-job, empty, unverified and About variants. */
export function DesignEmployerPanel({
  variant,
  onClose,
  onOpenJob,
}: {
  variant: EmployerVariant;
  onClose: () => void;
  onOpenJob: () => void;
}) {
  const [tab, setTab] = useState<"jobs" | "about">(variant === "about" ? "about" : "jobs");
  const verified = variant !== "unverified";
  const jobs = variant === "one" ? employerOverviewSeed.jobs.slice(0, 1) : variant === "empty" ? [] : employerOverviewSeed.jobs;
  const employer = employerOverviewSeed;

  return (
    <MapPanel label={`${employer.name} overview`} dock="right" onDismiss={onClose}>
      <div className="flex shrink-0 flex-col gap-5 py-4 pr-4 pl-6">
        <div className="flex items-start gap-3">
          <Image
            src={employer.logo}
            alt=""
            width={64}
            height={64}
            className="size-16 rounded-md border border-grey-300 object-cover"
          />
          <span className="flex-1" />
          <div className="flex gap-1">
            <RoundIcon icon="share" label="Share employer" />
            <RoundIcon icon="close" label="Close employer details" onClick={onClose} />
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-1">
            <h2 className="text-subheading-semibold text-text-primary">{employer.name}</h2>
            {verified && <Icon name="checkCircle" className="size-6 text-success-700" />}
          </div>
          <div className="flex flex-col gap-2">
            <p className="flex items-center gap-1 text-label-medium text-text-secondary">
              <Icon name="briefcase" className="size-4" />
              {employer.industry}
            </p>
            <p className="flex items-center gap-1 text-label-medium text-text-secondary">
              <Icon name="pinSm" className="size-4" />
              {employer.location}
            </p>
          </div>
          <div className="flex gap-2">
            <a
              href={employer.website}
              target="_blank"
              rel="noreferrer"
              aria-label="Website"
              className="flex size-9 items-center justify-center rounded-sm border bg-background-secondary"
            >
              <Icon name="globe" className="size-4.5" />
            </a>
            <span aria-label="LinkedIn" className="flex size-9 items-center justify-center rounded-sm border bg-background-secondary">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/icons/linkedin.svg" alt="" width={18} height={18} />
            </span>
            <span aria-label="Instagram" className="flex size-9 items-center justify-center rounded-sm border bg-background-secondary">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/icons/instagram.svg" alt="" width={18} height={18} />
            </span>
          </div>
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
            <div className="flex flex-col items-start gap-2 py-6">
              <p className="text-body-semibold text-text-primary">No active vacancies</p>
              <p className="text-body-sm-regular text-text-secondary">This employer has no open jobs right now.</p>
            </div>
          ) : (
            jobs.map((job) => <FrameJobCardView key={job.id} card={job} layout="employer" onOpen={onOpenJob} />)
          )
        ) : (
          <div className="flex flex-col gap-6">
            <section className="flex flex-col gap-3">
              <h3 className="text-body-semibold text-text-primary">Key details</h3>
              {[
                ["briefcase", employer.industry],
                ["user", employer.size],
                ["calendar", employer.founded],
                ["pinSm", employer.location],
              ].map(([icon, label]) => (
                <p key={label} className="flex items-center gap-3 text-body-sm-regular text-text-primary">
                  <span className="flex size-7 items-center justify-center rounded-md bg-grey-100">
                    <Icon name={icon as "briefcase"} className="size-4" />
                  </span>
                  {label}
                </p>
              ))}
            </section>
            <section className="flex flex-col gap-2">
              <h3 className="text-body-semibold text-text-primary">Overview</h3>
              <p className="text-body-sm-regular text-text-secondary">{employer.about}</p>
            </section>
          </div>
        )}
      </div>
    </MapPanel>
  );
}

/** S02 job detail, plus expired, applied, remote and closed variants. */
export function DesignJobDetailPanel({
  variant,
  onBack,
}: {
  variant: JobDetailVariant;
  onBack: () => void;
}) {
  const detail = civilEngineerDetail;
  const state = jobDetailVariantCopy[variant];
  const [saved, setSaved] = useState(false);
  const salary = state.salary ?? detail.salary;
  const mode = state.mode ?? detail.mode;
  const area = state.area ?? detail.area;

  return (
    <MapPanel label={`${detail.title} details`} dock="right" onDismiss={onBack}>
      <div className="flex shrink-0 items-center gap-1 px-4 pt-3 pb-2">
        <RoundIcon icon="arrowLeft" label="Back" onClick={onBack} />
        <span className="flex-1" />
        <RoundIcon
          icon={saved ? "bookmarkFilled" : "bookmark"}
          label={saved ? "Remove job from saved" : "Save job"}
          onClick={() => setSaved((value) => !value)}
        />
        <RoundIcon icon="share" label="Share job" />
        <RoundIcon icon="close" label="Close job details" onClick={onBack} />
      </div>
      <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-6">
        {state.banner && <Banner tone="error">{state.banner}</Banner>}
        <div className="flex flex-col gap-2">
          <h2 className="text-heading-semibold text-text-primary">{detail.title}</h2>
          <div className="flex items-center gap-2">
            <Image src={employerOverviewSeed.logo} alt="" width={32} height={32} className="size-8 rounded-sm object-cover" />
            <a href={employerOverviewSeed.website} className="text-body-semibold text-brand-primary">
              {detail.company}
            </a>
            <Icon name="checkCircle" className="size-5 text-success-700" />
            {state.applied && <span className="rounded-full bg-success-50 px-2 py-0.5 text-label-medium text-success-700">Applied</span>}
          </div>
          <div className="flex flex-wrap gap-1.5">
            <span className="rounded-full bg-success-50 px-2 py-0.5 text-label-medium text-success-700">{salary}</span>
            <span className="rounded-full bg-primary-50 px-2 py-0.5 text-label-medium text-brand-primary">{detail.employment}</span>
            <span className="rounded-full bg-grey-100 px-2 py-0.5 text-label-medium text-text-secondary">{mode}</span>
            <span className="rounded-full bg-grey-100 px-2 py-0.5 text-label-medium text-text-secondary">{detail.experience}</span>
          </div>
          <p className="flex items-center gap-1 text-label-medium text-text-secondary">
            <Icon name="pinSm" className="size-4" />
            {area}
          </p>
          <p className="flex flex-wrap gap-x-3 text-label-medium text-text-tertiary">
            <span className="inline-flex items-center gap-1">
              <Icon name="calendar" className="size-4" />
              {detail.posted}
            </span>
            {!state.hideDeadline && (
              <span className="inline-flex items-center gap-1">
                <Icon name="calendar" className="size-4" />
                {detail.deadline}
              </span>
            )}
          </p>
          <p className="text-label-medium text-text-tertiary">{detail.applicants}</p>
        </div>
        <section className="flex flex-col gap-2">
          <SectionHeader title="Description" />
          <p className="text-body-sm-regular text-text-secondary">{detail.description}</p>
        </section>
        <section className="flex flex-col gap-2">
          <SectionHeader title="Requirements" />
          <ul className="flex flex-col gap-3.5 text-body-sm-regular text-text-secondary">
            {detail.requirements.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </section>
        <section className="flex flex-col gap-2">
          <SectionHeader title="Skills & qualifications" />
          <ul className="flex flex-wrap gap-2">
            {detail.skills.map((skill) => (
              <Tag key={skill}>{skill}</Tag>
            ))}
          </ul>
        </section>
        <section className="flex flex-col gap-2">
          <SectionHeader title="Location details" />
          <p className="flex items-start gap-1.5 text-body-sm-regular text-text-secondary">
            <Icon name="pinSm" className="mt-0.5 size-4" />
            {state.hideMap ? "Remote" : detail.address}
          </p>
          {!state.hideMap && <div className="h-30 w-full rounded-sm bg-grey-100" />}
        </section>
      </div>
      <div className="shrink-0 border-t bg-surface-default px-6 py-4">
        <Button shape="rect" className="w-full" disabled={state.buttonDisabled}>
          {state.button}
        </Button>
      </div>
    </MapPanel>
  );
}
