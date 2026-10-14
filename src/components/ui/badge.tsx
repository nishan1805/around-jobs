import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

/** Figma "Around / Jobs / Badge" (1888:42346). */
const badgeVariants = cva("inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-label-medium whitespace-nowrap", {
  variants: {
    type: {
      salary: "bg-success-50 text-success-700",
      employment: "bg-primary-50 text-brand-primary",
      verified: "bg-primary-50 text-brand-primary",
      applied: "bg-primary-50 text-brand-primary",
      mode: "bg-grey-100 text-text-secondary",
      experience: "bg-grey-100 text-text-secondary",
      closed: "bg-grey-100 text-text-tertiary",
      unverified: "bg-secondary-50 text-secondary-600",
      expired: "bg-error-50 text-error-500",
    },
  },
  defaultVariants: { type: "employment" },
});

export type BadgeType = NonNullable<VariantProps<typeof badgeVariants>["type"]>;

export function Badge({ type, className, ...props }: ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span data-slot="badge" className={cn(badgeVariants({ type }), className)} {...props} />;
}
