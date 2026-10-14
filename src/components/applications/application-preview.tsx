"use client";

import Link from "next/link";
import { useState } from "react";

import { Icon } from "@/components/icon";
import { LogoPlaceholder } from "@/components/jobs/job-card";
import { Banner } from "@/components/ui/banner";
import { Button, buttonVariants } from "@/components/ui/button";
import { Dialog, DialogHeader, Field } from "@/components/ui/dialog";
import { eventText, eventWhen, isEnded, nextStep } from "@/lib/applications";
import { isOpen, jobPath, locationLine, type Job } from "@/lib/jobs";
import type { Application } from "@/lib/seeker-store";
import { cn } from "@/lib/utils";

/** Figma "Preview (selected application)" (1988:24500). */
export function ApplicationPreview({
  application,
  job,
  from,
  className,
}: {
  application: Application;
  job: Job;
  from: [number, number];
  className?: string;
}) {
  const [messageOpen, setMessageOpen] = useState(false);
  const canMessage = !isEnded(application) && isOpen(job);

  return (
    <section aria-label={`${job.title} application`} className={cn("flex flex-col gap-5", className)}>
      <div className="flex items-center gap-3">
        <LogoPlaceholder className="size-14 rounded-lg" />
        <div className="flex min-w-0 flex-col gap-1">
          <h2 className="text-subheading-semibold text-text-primary">{job.title}</h2>
          <p className="text-body-sm-regular text-text-secondary">{job.company.name}</p>
        </div>
      </div>

      <p className="line-clamp-3 text-body-sm-regular text-text-secondary">{job.summary}</p>

      <div className="flex flex-col gap-3">
        <h3 className="text-body-semibold text-text-primary">Updates</h3>
        <ol className="flex flex-col gap-3">
          {application.history.map((event) => (
            <li key={`${event.stage}-${event.on}`} className="flex items-start gap-3">
              <span
                aria-hidden
                className={cn(
                  "mt-1.5 size-2.5 shrink-0 rounded-full",
                  event.stage === "applied" ? "bg-grey-300" : event.stage === "rejected" ? "bg-error-500" : event.stage === "withdrawn" ? "bg-grey-400" : "bg-brand-primary",
                )}
              />
              <div className="flex flex-col gap-1">
                <p className="text-body-sm-medium text-text-primary">{eventText(event, application)}</p>
                <p className="text-label-medium text-text-tertiary">{eventWhen(event, application)}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="flex flex-col gap-1 rounded-lg bg-primary-50 px-4 py-3">
        <p className="text-label-medium text-brand-primary">Next step</p>
        <p className="text-body-sm-regular text-text-primary">{nextStep(application, job)}</p>
      </div>

      <div className="flex gap-3">
        {canMessage && (
          <Button shape="rect" className="h-11 flex-1 rounded-lg" onClick={() => setMessageOpen(true)}>
            Message employer
          </Button>
        )}
        <Link
          href={jobPath(job)}
          className={cn(buttonVariants({ variant: "outline", shape: "rect" }), "h-11 flex-1 rounded-lg")}
        >
          View job
        </Link>
      </div>

      <Link
        href={`/?company=${job.company.slug}`}
        className="flex h-30 items-center justify-center gap-2 rounded-lg bg-grey-100 px-4 text-label-medium text-text-secondary transition-colors hover:bg-grey-200"
      >
        <Icon name="pin" className="size-5 text-brand-primary" />
        {locationLine(job, from)}
        <span className="sr-only">, show on map</span>
      </Link>

      {messageOpen && <MessageDialog job={job} onClose={() => setMessageOpen(false)} />}
    </section>
  );
}

function MessageDialog({ job, onClose }: { job: Job; onClose: () => void }) {
  const [text, setText] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogHeader
        title={`Message ${job.company.name}`}
        description="Ask about timings, the interview or what to bring. Sample chat: messages stay on this device."
        onClose={onClose}
      />
      {sent ? (
        <>
          <Banner tone="success">Message sent. The employer usually replies within a day. (Sample)</Banner>
          <Button shape="rect" className="w-full" onClick={onClose}>
            Done
          </Button>
        </>
      ) : (
        <form
          className="flex flex-col gap-5"
          onSubmit={(event) => {
            event.preventDefault();
            if (text.trim()) setSent(true);
          }}
        >
          <Field label="Your message" id="employer-message" helper={`About: ${job.title}`}>
            <textarea
              id="employer-message"
              value={text}
              onChange={(event) => setText(event.target.value)}
              rows={4}
              placeholder="Hi, I applied for this job. What time should I come for the interview?"
              className="w-full resize-none rounded-sm border bg-surface-default p-3 text-body-sm-regular text-text-primary placeholder:text-text-tertiary focus-visible:border-brand-primary focus-visible:ring-3 focus-visible:ring-brand-primary/20 focus-visible:outline-none"
            />
          </Field>
          <Button type="submit" shape="rect" className="w-full" disabled={!text.trim()}>
            Send message
          </Button>
        </form>
      )}
    </Dialog>
  );
}
