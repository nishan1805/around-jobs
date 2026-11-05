"use client";

import Link from "next/link";
import { useState } from "react";

import { useAuth } from "@/components/auth/auth-provider";
import { AppShell } from "@/components/app-shell";
import { Icon } from "@/components/icon";
import { TopBar } from "@/components/jobs/top-bar";
import { MobileHeader } from "@/components/mobile-header";
import { Button, buttonVariants } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { useHydrated } from "@/hooks/use-hydrated";
import { applicationBadge, applicationDisplayId, isEnded, type ApplicationBadgeTone } from "@/lib/applications";
import { employmentTypes, experienceLabel, formatDate, isOpen, jobPath, type Job } from "@/lib/jobs";
import { applicationFor, seekerActions, useSeeker, type Application, type ApplicationEvent } from "@/lib/seeker-store";
import { cn } from "@/lib/utils";

const badgeClass: Record<ApplicationBadgeTone, string> = {
  review: "bg-[#fff9e7] text-[#b58708]",
  shortlisted: "bg-[#e6efff] text-[#0146b5]",
  interview: "bg-[#f3ebfd] text-[#5d28a8]",
  rejected: "bg-[#ffbacb] text-[#8c122f]",
  withdrawn: "bg-grey-100 text-text-secondary",
  closed: "bg-grey-100 text-text-tertiary",
};

function initials(name: string) {
  const parts = name.split(/\s+/).filter((part) => /[A-Za-z]/.test(part));
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "•";
}

function place(job: Job) {
  if (job.workMode === "REMOTE") return "Remote";
  return job.company.area.toLowerCase().includes(job.city.name.toLowerCase())
    ? job.company.area
    : `${job.company.area}, ${job.city.name}`;
}

type Activity = { title: string; body: string; on?: string; current: boolean };

function activity(application: Application): Activity[] {
  const eventOn = (stage: ApplicationEvent["stage"]) => application.history.find((event) => event.stage === stage)?.on;
  const steps: Activity[] = [
    {
      title: "Application Submitted",
      body: "You applied for this job.",
      on: eventOn("applied") ?? application.appliedOn,
      current: false,
    },
  ];
  if (eventOn("viewed") || application.stage === "viewed") {
    steps.push({
      title: "Application Viewed",
      body: "The employer viewed your application.",
      on: eventOn("viewed"),
      current: false,
    });
  }
  if (application.stage === "applied" || application.stage === "viewed") {
    steps.push({
      title: "Under Review",
      body: "Your application is currently under review.",
      on: eventOn("viewed") ?? application.appliedOn,
      current: true,
    });
  }
  if (eventOn("shortlisted") || application.stage === "shortlisted") {
    steps.push({
      title: "Shortlisted",
      body: "The employer shortlisted your application.",
      on: eventOn("shortlisted"),
      current: application.stage === "shortlisted",
    });
  }
  if (eventOn("interview") || application.stage === "interview") {
    steps.push({
      title: "Interviewing",
      body: application.interviewOn
        ? `Your interview is on ${formatDate(application.interviewOn)}.`
        : "The employer scheduled an interview.",
      on: eventOn("interview") ?? application.interviewOn,
      current: application.stage === "interview",
    });
  }
  if (application.stage === "rejected") {
    steps.push({
      title: "Not selected",
      body: "The employer chose other candidates.",
      on: eventOn("rejected"),
      current: true,
    });
  }
  if (application.stage === "withdrawn") {
    steps.push({
      title: "Application Withdrawn",
      body: "You withdrew your application for this job.",
      on: eventOn("withdrawn"),
      current: true,
    });
  }
  return steps;
}

/** S13 application detail. View Job opens the same map job sheet as a card on the map. */
export function ApplicationDetail({ job }: { job: Job }) {
  const hydrated = useHydrated();
  const { user, openLogin } = useAuth();
  const seeker = useSeeker();
  const application = applicationFor(seeker, job.slug);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  return (
    <AppShell active="applications">
      <MobileHeader title="Application" backHref="/applications" backLabel="Back to My Applications" heading={false} />
      <TopBar />
      <main className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto bg-background-secondary px-5 pt-5 pb-12 md:px-10 md:py-8">
        <Link href="/applications" className="inline-flex w-fit items-center gap-2 text-body-sm-medium text-text-secondary hover:text-text-primary max-md:hidden">
          <Icon name="arrowLeft" className="size-4" />
          Back to My Applications
        </Link>
        {!hydrated ? (
          <div aria-busy className="h-40 animate-pulse rounded-2xl bg-grey-100" />
        ) : !user ? (
          <div className="flex flex-col items-start gap-3 rounded-2xl border bg-surface-default p-6">
            <h1 className="text-heading-semibold text-text-primary">Log in to see this application</h1>
            <p className="text-body-sm-regular text-text-secondary">Your applications and their status are saved to your mobile number.</p>
            <Button type="button" shape="rect" onClick={openLogin}>
              Log in with mobile number
            </Button>
          </div>
        ) : !application ? (
          <div className="flex flex-col items-start gap-3 rounded-2xl border bg-surface-default p-6">
            <h1 className="text-heading-semibold text-text-primary">You haven&apos;t applied to this job</h1>
            <Link href={jobPath(job)} className={buttonVariants({ shape: "rect" })}>
              View Job
            </Link>
          </div>
        ) : (
          <ApplicationBody
            job={job}
            application={application}
            onWithdraw={() => setConfirmOpen(true)}
          />
        )}
        {toast && (
          <p role="status" className="fixed bottom-[calc(5.5rem+env(safe-area-inset-bottom))] left-1/2 z-50 max-w-[calc(100%-2rem)] -translate-x-1/2 rounded-md bg-grey-900 px-4 py-3 text-center text-body-sm-medium text-text-on-brand shadow-lg md:bottom-6">
            {toast}
          </p>
        )}
      </main>
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen} className="md:w-[440px]">
        <h2 className="text-heading-semibold text-text-primary">Withdraw application?</h2>
        <p className="text-body-sm-regular text-text-secondary">
          Your application will be marked as withdrawn. You may not be able to undo this action.
        </p>
        <div className="flex flex-col-reverse gap-3 md:flex-row md:justify-end">
          <Button type="button" variant="outline" shape="rect" className="max-md:w-full" onClick={() => setConfirmOpen(false)}>
            Keep application
          </Button>
          <Button
            type="button"
            variant="destructive"
            shape="rect"
            className="max-md:w-full"
            onClick={() => {
              seekerActions.withdraw(job.slug);
              setConfirmOpen(false);
              setToast("Application withdrawn");
            }}
          >
            Withdraw application
          </Button>
        </div>
      </Dialog>
    </AppShell>
  );
}

function ApplicationBody({
  job,
  application,
  onWithdraw,
}: {
  job: Job;
  application: Application;
  onWithdraw: () => void;
}) {
  const badge = applicationBadge(application, job);
  const ended = isEnded(application) || !isOpen(job);
  const submission = application.submission;
  const withdrawnOn = application.history.find((event) => event.stage === "withdrawn")?.on;
  const steps = activity(application);
  const resumeName = submission?.resumeName;
  const resumeSize = submission?.resumeKb ? `${submission.resumeKb} KB` : null;
  const cover = submission?.coverNote?.trim();

  return (
    <>
      <section className="flex flex-col gap-4 rounded-2xl border border-grey-200 bg-surface-default p-6 md:flex-row md:items-center md:gap-6">
        <span className="flex size-16 shrink-0 items-center justify-center rounded-xl bg-[#fff2e8] text-subheading-semibold text-text-primary">
          {initials(job.company.name)}
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="text-heading-semibold text-text-primary">{job.title}</h1>
          <p className="mt-1 flex items-center gap-1 text-body-sm-regular text-text-secondary">
            {job.company.name}
            {job.company.verified && <Icon name="verified" className="size-5 text-success-700" />}
          </p>
          <p className="mt-2 flex flex-wrap gap-2">
            <span className="rounded-full bg-grey-100 px-2 py-1 text-label-medium text-text-secondary">{employmentTypes[job.employmentType]}</span>
            <span className="rounded-full bg-grey-100 px-2 py-1 text-label-medium text-text-secondary">{experienceLabel(job.experience)}</span>
          </p>
        </div>
        <div className="flex flex-col gap-2 text-body-sm-regular text-text-tertiary">
          <span className="flex items-center gap-1">
            <Icon name="pinSm" className="size-4" />
            {place(job)}
          </span>
          <span className="flex items-center gap-2">
            <Icon name="calendar" className="size-5" />
            Applied on {formatDate(application.appliedOn)}
          </span>
          {withdrawnOn && <span>Withdrawn on {formatDate(withdrawnOn)}</span>}
        </div>
        <span className={cn("inline-flex w-fit items-center gap-1 self-start rounded-full px-3 py-1 text-label-medium", badgeClass[badge.tone])}>
          <span className="size-2 rounded-full bg-current" />
          {badge.label}
        </span>
      </section>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.75fr)_minmax(280px,1fr)]">
        <section className="flex flex-col gap-4 rounded-2xl border border-grey-200 bg-surface-default p-6">
          <h2 className="text-subheading-semibold text-text-primary">Application Details</h2>
          <dl className="flex flex-col">
            <DetailRow icon="file" label="Application ID" value={applicationDisplayId(application)} />
            <DetailRow icon="calendar" label="Applied on" value={formatDate(application.appliedOn)} />
            {withdrawnOn && <DetailRow icon="calendar" label="Withdrawn on" value={formatDate(withdrawnOn)} />}
            <DetailRow icon="briefcase" label="Job type" value={employmentTypes[job.employmentType]} />
            <DetailRow icon="user" label="Experience" value={experienceLabel(job.experience)} />
            <DetailRow icon="pinSm" label="Location" value={place(job)} />
          </dl>
          <h3 className="text-subheading-semibold text-text-primary">Submitted with</h3>
          <DocumentRow
            title="Resume"
            detail={resumeName ? [resumeName, resumeSize].filter(Boolean).join(" ") : "No resume attached"}
          />
          <DocumentRow title="Cover Letter" detail={cover ? cover : "Not attached"} />
          <div className="flex flex-wrap gap-3 pt-2">
            <Link href={`/?job=${job.slug}`} className={buttonVariants({ shape: "rect" })}>
              View Job
            </Link>
            {!ended && (
              <Button type="button" variant="outline" shape="rect" className="border-[#ff2056] text-[#ff2056] hover:bg-error-50" onClick={onWithdraw}>
                Withdraw Application
              </Button>
            )}
          </div>
        </section>

        <section className="flex flex-col gap-5 rounded-2xl border border-grey-200 bg-surface-default p-6">
          <h2 className="text-subheading-semibold text-text-primary">Application Activity</h2>
          <ol className="flex flex-col">
            {steps.map((step, index) => (
              <li key={step.title} className={cn("flex gap-3", step.current && "rounded-xl bg-[#fff9e7] p-3")}>
                <span className="flex w-5 shrink-0 flex-col items-center">
                  <span className={cn("mt-1 size-2.5 rounded-full", step.current ? "bg-[#b58708]" : "bg-success-500")} />
                  {index < steps.length - 1 && <span className="mt-1 w-px flex-1 bg-grey-200" />}
                </span>
                <span className={cn("flex min-w-0 flex-1 flex-col gap-1", !step.current && "pb-4")}>
                  <span className="text-body-sm-semibold text-text-primary">{step.title}</span>
                  <span className="text-body-sm-regular text-text-secondary">{step.body}</span>
                  {step.on && <span className="text-label-medium text-text-tertiary">{formatDate(step.on)}</span>}
                </span>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </>
  );
}

function DetailRow({ icon, label, value }: { icon: "file" | "calendar" | "briefcase" | "user" | "pinSm"; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2 border-b border-grey-200 py-3 text-body-sm-regular md:items-center md:py-2.5">
      <Icon name={icon} className="mt-0.5 size-4 shrink-0 text-text-tertiary md:mt-0" />
      <dt className="w-28 shrink-0 text-text-secondary md:w-44">{label}</dt>
      <dd className="min-w-0 flex-1 text-body-sm-semibold text-text-primary">{value}</dd>
    </div>
  );
}

function DocumentRow({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-grey-200 bg-[#fafafa] px-4 py-3">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-surface-default text-text-secondary">
        <Icon name="file" className="size-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-body-sm-semibold text-text-primary">{title}</span>
        <span className="block truncate text-label-medium text-text-secondary">{detail}</span>
      </span>
    </div>
  );
}
