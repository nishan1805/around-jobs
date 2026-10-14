import type { ReactNode } from "react";

import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";

const tones = {
  info: { surface: "bg-primary-50", icon: "text-brand-primary" },
  warning: { surface: "bg-secondary-50", icon: "text-secondary-600" },
  success: { surface: "bg-success-50", icon: "text-text-primary" },
  error: { surface: "bg-error-50", icon: "text-error-500" },
} as const;

/** Figma "Around / Banner" (1888:42411). */
export function Banner({
  tone = "info",
  children,
  className,
}: {
  tone?: keyof typeof tones;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      role={tone === "error" || tone === "warning" ? "alert" : "status"}
      className={cn("flex w-full items-start gap-2 rounded-sm p-3", tones[tone].surface, className)}
    >
      <Icon name={tone === "success" ? "checkCircle" : "alertCircle"} className={cn("size-5", tones[tone].icon)} />
      <p className="min-w-0 flex-1 text-body-sm-regular text-text-primary">{children}</p>
    </div>
  );
}
