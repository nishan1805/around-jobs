import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

/** Figma "Status pill" on My applications (1985:23694). */
const statusPillVariants = cva(
  "inline-flex shrink-0 items-center rounded-4xl px-3 py-1 text-label-medium whitespace-nowrap",
  {
    variants: {
      tone: {
        applied: "bg-grey-100 text-text-secondary",
        viewed: "bg-info-50 text-info-700",
        shortlisted: "bg-success-50 text-success-700",
        interview: "bg-primary-50 text-brand-primary",
        closed: "bg-grey-100 text-text-tertiary",
        rejected: "bg-error-50 text-error-500",
        hired: "bg-success-50 text-success-700",
        withdrawn: "bg-grey-100 text-text-secondary",
        submitted: "bg-info-50 text-info-700",
        review: "bg-secondary-50 text-secondary-600",
        unavailable: "bg-grey-100 text-text-tertiary",
      },
    },
    defaultVariants: { tone: "applied" },
  },
);

export type StatusTone = NonNullable<VariantProps<typeof statusPillVariants>["tone"]>;

export function StatusPill({ tone, className, ...props }: ComponentProps<"span"> & VariantProps<typeof statusPillVariants>) {
  return <span className={cn(statusPillVariants({ tone }), className)} {...props} />;
}
