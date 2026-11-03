"use client";

import Link from "next/link";

import { AppShell } from "@/components/app-shell";
import { Icon } from "@/components/icon";
import { Chip } from "@/components/jobs/chip";
import { FrameJobCardView } from "@/components/jobs/frame-job-card";
import { browseListSeed } from "@/lib/seeker-design-seed";
import { TopBar } from "@/components/jobs/top-bar";
import { buildingMarkerHtml, clusterMarkerHtml, companyMarkerHtml } from "@/components/map/markers";
import { ResumeUpload } from "@/components/resume-upload";
import { Badge } from "@/components/ui/badge";
import { Banner } from "@/components/ui/banner";
import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/ui/status-pill";

const control =
  "flex h-11 w-full items-center rounded-sm border bg-surface-default px-3 text-body-sm-regular outline-none";

const links = [
  ["S00 Jobs home", "/"],
  ["S01 Employer overview", "/?company=raipur-builder"],
  ["S01 one job", "/?company=raipur-builder&employer=one"],
  ["S01 no vacancies", "/?company=raipur-builder&employer=empty"],
  ["S01 unverified", "/?company=raipur-builder&employer=unverified"],
  ["S01 About", "/?company=raipur-builder&employer=about"],
  ["S02 Job detail", "/?job=civil-engineer"],
  ["S02 expired", "/?job=civil-engineer&detail=expired"],
  ["S02 applied", "/?job=civil-engineer&detail=applied"],
  ["S02 closed", "/?job=civil-engineer&detail=closed"],
  ["S02 remote, salary hidden", "/?job=civil-engineer&detail=remote"],
  ["S03 List", "/?view=list"],
  ["List loading", "/?view=list&state=loading"],
  ["List error", "/?view=list&state=error"],
  ["List no results", "/?view=list&state=none"],
  ["List empty area", "/?view=list&state=empty"],
  ["S05 Filters", "/?filters=open&category=Retail&type=FULL_TIME&mode=ON_SITE"],
  ["S06 Filtered list", "/?view=list&category=Retail&type=FULL_TIME&mode=ON_SITE"],
  ["S08 Login phone", "/?auth=phone"],
  ["S09 Login OTP", "/?auth=otp"],
  ["Login OTP error", "/?auth=otp-error"],
  ["Login loading", "/?auth=loading"],
  ["S10 Complete profile", "/?auth=profile"],
  ["S17 Saved jobs", "/saved"],
  ["P01 Basic info", "/profile"],
  ["P03c three roles", "/profile?section=experience&experience=3"],
  ["P03b validation", "/profile?section=experience&dialog=experience&error=1"],
  ["P03f empty experience", "/profile?section=experience&empty=1"],
  ["P02 upload error", "/profile?section=skills&upload=error"],
  ["P05 photo selected", "/profile?photo=selected"],
  ["P05 remove photo", "/profile?photo=remove"],
  ["Job alerts", "/alerts"],
];

function Marker({ html }: { html: string }) {
  return <div className="relative h-28 w-48" dangerouslySetInnerHTML={{ __html: html }} />;
}

/** Every job-seeker component variant that has no full screen of its own. */
export function StatesView() {
  return (
    <AppShell active="jobs">
      <TopBar />
      <main className="min-h-0 flex-1 overflow-auto bg-background-secondary px-6 py-8 md:px-10">
        <h1 className="text-display-small-semibold text-text-primary">Job-seeker component states</h1>
        <p className="mt-2 max-w-3xl text-body-regular text-text-secondary">
          Variants from the Around Jobs component sets. Full screens stay on their own routes.
        </p>

        <section className="mt-8 flex flex-col gap-4">
          <h2 className="text-heading-semibold">Button</h2>
          <div className="flex flex-wrap items-center gap-3">
            <Button shape="rect">Apply now</Button>
            <Button variant="outline" shape="rect">
              Apply now
            </Button>
            <Button shape="rect" disabled>
              Apply now
            </Button>
            <Button variant="destructive" shape="rect">
              Remove
            </Button>
            <Button shape="rect" disabled>
              <Icon name="spinner" className="size-4 animate-spin" />
              Submitting…
            </Button>
          </div>
        </section>

        <section className="mt-8 flex flex-col gap-4">
          <h2 className="text-heading-semibold">Badge</h2>
          <div className="flex flex-wrap gap-2">
            <Badge type="salary">₹15,000 – ₹20,000</Badge>
            <Badge type="employment">Full-time</Badge>
            <Badge type="mode">On-site</Badge>
            <Badge type="experience">1–3 yrs</Badge>
            <Badge type="verified">Verified</Badge>
            <Badge type="unverified">Unverified</Badge>
            <Badge type="applied">Applied</Badge>
            <Badge type="expired">Expired</Badge>
            <Badge type="closed">Closed</Badge>
          </div>
        </section>

        <section className="mt-8 flex flex-col gap-4">
          <h2 className="text-heading-semibold">Application status</h2>
          <div className="flex flex-wrap gap-2">
            <StatusPill tone="applied">Applied</StatusPill>
            <StatusPill tone="viewed">Viewed</StatusPill>
            <StatusPill tone="shortlisted">Shortlisted</StatusPill>
            <StatusPill tone="interview">Interviewing</StatusPill>
            <StatusPill tone="rejected">Not selected</StatusPill>
            <StatusPill tone="hired">Hired</StatusPill>
            <StatusPill tone="withdrawn">Withdrawn</StatusPill>
            <StatusPill tone="submitted">Submitted</StatusPill>
            <StatusPill tone="review">Under review</StatusPill>
            <StatusPill tone="unavailable">Job no longer available</StatusPill>
          </div>
        </section>

        <section className="mt-8 flex flex-col gap-4">
          <h2 className="text-heading-semibold">Category chip</h2>
          <div className="flex gap-2">
            <Chip>Retail</Chip>
            <Chip selected>Retail</Chip>
          </div>
        </section>

        <section className="mt-8 flex max-w-xl flex-col gap-3">
          <h2 className="text-heading-semibold">Job card</h2>
          <FrameJobCardView card={browseListSeed[1]} />
          <FrameJobCardView card={browseListSeed[0]} />
          <FrameJobCardView card={{ ...browseListSeed[1], id: "saved-state" }} layout="saved" saved expiring />
        </section>

        <section className="mt-8 grid max-w-xl gap-3">
          <h2 className="text-heading-semibold">Resume upload</h2>
          <ResumeUpload state="empty" />
          <ResumeUpload state="uploading" />
          <ResumeUpload state="uploaded" />
          <ResumeUpload state="unsupported" />
          <ResumeUpload state="too-large" />
        </section>

        <section className="mt-8 flex flex-col gap-4">
          <h2 className="text-heading-semibold">Company marker</h2>
          <div className="flex flex-wrap items-end gap-6 overflow-hidden rounded-md bg-grey-100 px-6 pt-24 pb-6">
            <Marker html={companyMarkerHtml({ name: "Magneto Retail", count: 4, selected: false })} />
            <Marker html={companyMarkerHtml({ name: "Magneto Retail", count: 4, selected: true })} />
            <Marker html={clusterMarkerHtml({ count: 12 })} />
            <Marker html={buildingMarkerHtml({ count: 3 })} />
          </div>
        </section>

        <section className="mt-8 flex max-w-xl flex-col gap-3">
          <h2 className="text-heading-semibold">Banner</h2>
          <Banner tone="info">This helps us show you relevant jobs.</Banner>
          <Banner tone="warning">This employer is not verified by Around yet.</Banner>
          <Banner tone="success">Message sent. The employer usually replies within a day.</Banner>
          <Banner tone="error">Couldn&apos;t load jobs. Check your internet connection and try again.</Banner>
        </section>

        <section className="mt-8 grid max-w-md gap-4">
          <h2 className="text-heading-semibold">Input</h2>
          <input className={control} placeholder="Default" readOnly />
          <input className={`${control} border-error-default`} placeholder="Error" aria-invalid readOnly />
          <input className={`${control} bg-background-secondary text-text-disabled`} placeholder="Disabled" disabled />
          <input className={`${control} border-warning-500`} placeholder="Warning" readOnly />
          <input className={control} defaultValue="Filled value" readOnly />
        </section>

        <section className="mt-8">
          <h2 className="text-heading-semibold">Screens and panel states</h2>
          <ul className="mt-3 grid gap-2 md:grid-cols-2">
            {links.map(([label, href]) => (
              <li key={href}>
                <Link href={href} className="text-body-sm-semibold text-brand-primary hover:underline">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </AppShell>
  );
}
