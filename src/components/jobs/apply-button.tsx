"use client";

import Link from "next/link";

import { useSeekerActions } from "@/components/auth/use-seeker-actions";
import { Button, buttonVariants } from "@/components/ui/button";
import type { JobStatus } from "@/lib/jobs";
import { applicationFor, useSeeker } from "@/lib/seeker-store";
import { cn } from "@/lib/utils";

/** Apply / View application / closed states, shared by the job page and its mobile bar. */
export function ApplyButton({
  jobSlug,
  status,
  applyLabel = "Apply now",
  className,
}: {
  jobSlug: string;
  status: JobStatus;
  applyLabel?: string;
  className?: string;
}) {
  const seeker = useSeeker();
  const actions = useSeekerActions();
  const applied = applicationFor(seeker, jobSlug) !== null;

  if (status !== "open") {
    return (
      <Button shape="rect" disabled className={cn("bg-grey-100 text-text-disabled opacity-100", className)}>
        {status === "expired" ? "Applications closed" : "Position closed"}
      </Button>
    );
  }
  if (applied) {
    return (
      <Link href="/applications" className={cn(buttonVariants({ variant: "outline", shape: "rect" }), className)}>
        View application
      </Link>
    );
  }
  return (
    <Button shape="rect" className={className} onClick={() => actions.apply(jobSlug)}>
      {applyLabel}
    </Button>
  );
}
