"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { statusTone } from "@/components/applications/application-card";
import { MessageDialog } from "@/components/applications/application-preview";
import { reachedStep } from "@/components/applications/progress-stepper";
import { useAuth } from "@/components/auth/auth-provider";
import { FlowScreen, JobSummaryRow } from "@/components/flow-screen";
import { Icon } from "@/components/icon";
import { EmptyPage } from "@/components/page-header";
import { Banner } from "@/components/ui/banner";
import { Button, buttonVariants } from "@/components/ui/button";
import { Dialog, DialogHeader } from "@/components/ui/dialog";
import { StatusPill } from "@/components/ui/status-pill";
import { useHydrated } from "@/hooks/use-hydrated";
import { isEnded, nextStep, stageLabels, statusLabel } from "@/lib/applications";
import { formatDayMonth, isOpen, jobPath, type Job } from "@/lib/jobs";
import {
  applicationFor,
  applicationStages,
  seekerActions,
  useSeeker,
  type Application,
  type ApplicationEvent,
} from "@/lib/seeker-store";
import { cn } from "@/lib/utils";

const when = (event: ApplicationEvent) => `${formatDayMonth(event.on)}${event.time ? `, ${event.time}` : ""}`;

type TimelineStep = { label: string; detail: string; state: "done" | "waiting" | "ended" | "negative" };

function timeline(application: Application, job: Job): TimelineStep[] {
  const reached = reachedStep(application);
  const eventFor = (stage: string) => application.history.find((event) => event.stage === stage);

  const steps: TimelineStep[] = applicationStages.map((stage, index) => {
    const event = eventFor(stage);
    if (index > reached) return { label: stageLabels[stage], detail: isEnded(application) ? "Skipped" : "Waiting", state: "waiting" };
    let detail = event ? when(event) : "Done";
    if (stage === "viewed" && event) detail += " · employer opened it";
    if (stage === "interview" && application.interviewOn) detail = `Interview on ${formatDayMonth(application.interviewOn)}`;
    return { label: stageLabels[stage], detail, state: "done" };
  });

  const rejected = eventFor("rejected");
  const withdrawn = eventFor("withdrawn");
  steps.push(
    application.stage === "rejected"
      ? { label: stageLabels.rejected, detail: rejected ? when(rejected) : "The employer chose other candidates", state: "negative" }
      : application.stage === "withdrawn"
        ? { label: stageLabels.withdrawn, detail: withdrawn ? `${when(withdrawn)} · by you` : "By you", state: "ended" }
        : !isOpen(job)
          ? { label: "Job closed", detail: "The employer stopped hiring", state: "ended" }
          : { label: "Decision", detail: "Waiting", state: "waiting" },
  );
  return steps;
}

const dotClass: Record<TimelineStep["state"], string> = {
  done: "bg-success-500",
  waiting: "bg-grey-200",
  ended: "bg-grey-500",
  negative: "bg-error-default",
};

/** Figma mobile M16 "Application" with the M17 withdraw confirmation. */
export function ApplicationDetail({ job }: { job: Job }) {
  const hydrated = useHydrated();
  const router = useRouter();
  const { user, openLogin } = useAuth();
  const seeker = useSeeker();
  const application = applicationFor(seeker, job.slug);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [messageOpen, setMessageOpen] = useState(false);
  const [resumeOpen, setResumeOpen] = useState(false);

  if (!hydrated || !user || !application) {
    return (
      <FlowScreen active="applications" title="Application" back="/applications" backLabel="Back to My applications">
        <JobSummaryRow job={job} />
        {!hydrated ? (
          <div aria-busy className="flex flex-col gap-3">
            <span className="sr-only">Loading</span>
            <div className="h-6 w-28 animate-pulse rounded-4xl bg-grey-100" />
            <div className="h-40 animate-pulse rounded-md bg-grey-100" />
          </div>
        ) : !user ? (
          <EmptyPage
            icon="navApplications"
            title="Log in to see this application"
            body="Your applications and their status are saved to your mobile number."
            action={<Button onClick={openLogin}>Log in with mobile number</Button>}
          />
        ) : (
          <EmptyPage
            icon="navApplications"
            title="You haven't applied to this job"
            body="Applications you send show up in My applications."
            action={
              <Link href={jobPath(job)} className={buttonVariants()}>
                View job
              </Link>
            }
          />
        )}
      </FlowScreen>
    );
  }

  const ended = isEnded(application);
  const canMessage = !ended && isOpen(job);
  const submission = application.submission;
  const steps = timeline(application, job);

  return (
    <FlowScreen
      active="applications"
      title="Application"
      back="/applications"
      backLabel="Back to My applications"
      footer={
        ended ? (
          isOpen(job) && application.stage === "withdrawn" ? (
            <Link href={`/apply/${job.slug}`} className={cn(buttonVariants({ shape: "rect" }), "w-full")}>
              Apply again
            </Link>
          ) : undefined
        ) : (
          <Button variant="destructive" shape="rect" className="w-full" onClick={() => setConfirmOpen(true)}>
            Withdraw application
          </Button>
        )
      }
    >
      <JobSummaryRow job={job} />
      <StatusPill tone={statusTone(application, job)} className="self-start">
        {statusLabel(application, job)}
      </StatusPill>

      <section className="flex flex-col gap-3">
        <h2 className="text-subheading-semibold text-text-primary">Progress</h2>
        <ol className="flex flex-col">
          {steps.map((step, index) => {
            const nextDone = steps[index + 1] && steps[index + 1].state !== "waiting";
            return (
              <li key={step.label} className="relative flex gap-3 pb-2 last:pb-0">
                <span aria-hidden className="relative flex w-2.5 shrink-0 flex-col items-center pt-1.5">
                  <span className={cn("relative z-1 size-2.5 rounded-full", dotClass[step.state])} />
                  {index < steps.length - 1 && (
                    <span className={cn("absolute top-3 -bottom-3 w-0.5", nextDone ? "bg-success-500" : "bg-grey-200")} />
                  )}
                </span>
                <div className="flex min-w-0 flex-col">
                  <p className={cn("text-body-semibold", step.state === "waiting" ? "text-text-tertiary" : "text-text-primary")}>
                    {step.label}
                    {step.state === "waiting" && <span className="sr-only"> (not yet)</span>}
                  </p>
                  <p className="text-label-medium text-text-secondary">
                    {step.detail}
                    
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-subheading-semibold text-text-primary">Next step</h2>
        <p className="text-body-sm-regular text-text-secondary">{nextStep(application, job)}</p>
        <div className="flex gap-3">
          {canMessage && (
            <Button variant="outline" shape="rect" className="flex-1" onClick={() => setMessageOpen(true)}>
              Message employer
            </Button>
          )}
          <Link href={jobPath(job)} className={cn(buttonVariants({ shape: "rect" }), "flex-1")}>
            View job
          </Link>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-subheading-semibold text-text-primary">Submitted with</h2>
        <div className="flex items-center gap-3">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-sm bg-grey-100 text-text-secondary">
            <Icon name="file" className="size-5" />
          </span>
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <p className="truncate text-body-sm-medium text-text-primary">{submission?.resumeName ?? "No resume attached"}</p>
            <p className="text-label-medium text-text-secondary">
              {[submission?.resumeKb && `${submission.resumeKb} KB`, `sent ${formatDayMonth(application.appliedOn)}`]
                .filter(Boolean)
                .join(" · ")}
              {submission?.coverNote ? " · with a cover note" : ""}
            </p>
          </div>
          {submission?.resumeName && (
            <button
              type="button"
              onClick={() => setResumeOpen(true)}
              className="shrink-0 rounded-xs text-body-sm-semibold text-brand-primary hover:underline focus-visible:ring-3 focus-visible:ring-brand-primary/40 focus-visible:outline-none"
            >
              View
            </button>
          )}
        </div>
      </section>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogHeader
          title="Withdraw application?"
          description={`${job.title} · ${job.company.name}. The employer will no longer see your application.`}
          onClose={() => setConfirmOpen(false)}
        />
        <Banner tone="warning">This can&apos;t be undone.</Banner>
        <div className="flex flex-col gap-3">
          <Button
            variant="destructive"
            shape="rect"
            className="w-full"
            onClick={() => {
              seekerActions.withdraw(job.slug);
              setConfirmOpen(false);
              router.push("/applications");
            }}
          >
            Withdraw application
          </Button>
          <Button variant="outline" shape="rect" className="w-full" onClick={() => setConfirmOpen(false)}>
            Keep application
          </Button>
        </div>
      </Dialog>

      <Dialog open={resumeOpen} onOpenChange={setResumeOpen}>
        <DialogHeader
          title={submission?.resumeName ?? "Resume"}
          description="Resumes stay on your device, so there's no file to preview."
          onClose={() => setResumeOpen(false)}
        />
        <Button shape="rect" className="w-full" onClick={() => setResumeOpen(false)}>
          Done
        </Button>
      </Dialog>

      {messageOpen && <MessageDialog job={job} onClose={() => setMessageOpen(false)} />}
    </FlowScreen>
  );
}
