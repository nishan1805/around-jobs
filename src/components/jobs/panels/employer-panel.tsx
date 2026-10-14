"use client";

import { useState } from "react";

import { Icon } from "@/components/icon";
import { JobCard, LogoPlaceholder, VerifiedBadge } from "@/components/jobs/job-card";
import { Banner } from "@/components/ui/banner";
import { Button, buttonVariants } from "@/components/ui/button";
import { EmptyBlock } from "@/components/ui/empty-block";
import { IconButton } from "@/components/ui/icon-button";
import type { Company, Job } from "@/lib/jobs";
import { useSeekerActions } from "@/components/auth/use-seeker-actions";
import { useSeeker } from "@/lib/seeker-store";
import { cn } from "@/lib/utils";

import { GalleryHeader, MapPanel, SectionHeader, shareLink } from "./panel-parts";

const directionsUrl = ([lat, lng]: [number, number]) =>
  `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

/** Figma "Around / Jobs / Employer Overview Panel" (1889:42132), screen S01. */
export function EmployerPanel({
  company,
  jobs,
  from,
  cityName,
  onClose,
  onSelectJob,
}: {
  company: Company;
  jobs: Job[];
  from: [number, number];
  cityName: string;
  onClose: () => void;
  onSelectJob: (job: Job) => void;
}) {
  const seeker = useSeeker();
  const saved = seeker.savedEmployers.includes(company.slug);
  const [notice, setNotice] = useState<string | null>(null);
  const actions = useSeekerActions();
  const toggleSave = () => actions.setSavedEmployer(company.slug, !saved);
  const saveLabel = saved ? "Saved" : "Save";

  return (
    <MapPanel label={`${company.name} overview`}>
      <div className="flex-1 overflow-y-auto overscroll-contain">
        <GalleryHeader
          name={company.name}
          photoCount={company.photoCount}
          nav={{ icon: "close", label: "Close employer details", onClick: onClose }}
          actions={
            <>
              <IconButton
                icon={saved ? "heartFilled" : "heart"}
                label={saved ? "Remove employer from saved" : "Save employer"}
                aria-pressed={saved}
                onClick={toggleSave}
                className={cn(saved && "text-brand-primary")}
                iconClassName="size-4"
              />
              <IconButton
                icon="share"
                label="Share employer"
                onClick={async () => {
                  const result = await shareLink(company.name, `/?company=${company.slug}`);
                  if (result === "copied") setNotice("Link copied");
                }}
              />
            </>
          }
        />

        <div className="flex flex-col gap-5 p-6">
          <div className="flex items-center gap-3">
            <LogoPlaceholder className="size-14 rounded-md" />
            <div className="flex min-w-0 flex-1 flex-col items-start gap-1">
              <h2 className="text-heading-semibold text-text-primary">{company.name}</h2>
              <p className="text-body-sm-regular text-text-secondary">
                {company.category} · {company.area}, {cityName}
              </p>
              <VerifiedBadge verified={company.verified} />
            </div>
          </div>

          {!company.verified && (
            <Banner tone="warning">This employer is not verified by Around yet. Check details before you apply.</Banner>
          )}

          <div className="flex gap-2">
            <a
              href={directionsUrl(company.position)}
              target="_blank"
              rel="noreferrer"
              className={cn(buttonVariants({ shape: "rect" }), "h-auto flex-1 px-3 py-2.5")}
            >
              <Icon name="directions" className="size-5" />
              Get Directions
            </a>
            <Button
              variant="outline"
              shape="rect"
              aria-pressed={saved}
              onClick={toggleSave}
              className="h-auto flex-1 px-3 py-2.5"
            >
              <Icon name={saved ? "bookmarkFilled" : "bookmark"} className={cn("size-5", saved && "text-brand-primary")} />
              {saveLabel}
            </Button>
          </div>
          {notice && (
            <p role="status" className="text-label-medium text-text-tertiary">
              {notice}
            </p>
          )}

          {jobs.length > 0 ? (
            <div className="flex flex-col gap-3">
              <SectionHeader title={`Open jobs (${jobs.length})`} />
              {jobs.map((job) => (
                <JobCard key={job.slug} job={job} from={from} onSelect={onSelectJob} />
              ))}
            </div>
          ) : (
            <EmptyBlock
              title="No active vacancies"
              body="This employer has no open jobs right now. Save them to get notified about new jobs."
              action={
                <Button variant="outline" shape="rect" onClick={toggleSave} aria-pressed={saved}>
                  {saved ? "Employer saved" : "Save employer"}
                </Button>
              }
            />
          )}
        </div>
      </div>
    </MapPanel>
  );
}
