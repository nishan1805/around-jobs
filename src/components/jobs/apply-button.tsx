"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/auth/auth-provider";
import { Button, buttonVariants } from "@/components/ui/button";
import type { JobStatus } from "@/lib/jobs";
import { activeApplicationFor, useSeeker } from "@/lib/seeker-store";
import { cn } from "@/lib/utils";

export const applyPath = (jobSlug: string) => `/apply/${jobSlug}`;
export const applicationPath = (jobSlug: string) => `/applications/${jobSlug}`;

/** Apply / View application / closed states, shared by the job page, map panel and saved cards. */
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
  const router = useRouter();
  const { requireAuth } = useAuth();
  const applied = activeApplicationFor(seeker, jobSlug) !== null;

  if (status !== "open") {
    return (
      <Button shape="rect" disabled className={cn("bg-grey-100 text-text-disabled opacity-100", className)}>
        {status === "expired" ? "Applications closed" : "Position closed"}
      </Button>
    );
  }
  if (applied) {
    return (
      <Link href={applicationPath(jobSlug)} className={cn(buttonVariants({ variant: "outline", shape: "rect" }), className)}>
        View application
      </Link>
    );
  }
  return (
    <Button
      shape="rect"
      className={className}
      onClick={() =>
        requireAuth(() => router.push(applyPath(jobSlug)), "Log in with your mobile number to apply. It takes a minute.")
      }
    >
      {applyLabel}
    </Button>
  );
}
