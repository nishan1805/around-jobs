import { Icon, type IconName } from "@/components/icon";
import type { ApplicationBadgeTone } from "@/lib/applications";
import { cn } from "@/lib/utils";

const styles: Record<ApplicationBadgeTone, { color: string; icon: IconName }> = {
  review: { color: "bg-warning-50 text-warning-700", icon: "file" },
  shortlisted: { color: "bg-primary-50 text-primary-700", icon: "bookmark" },
  interview: { color: "bg-features-50 text-features-700", icon: "calendar" },
  rejected: { color: "bg-error-100 text-error-800", icon: "close" },
  withdrawn: { color: "bg-error-50 text-error-700", icon: "logout" },
  closed: { color: "bg-grey-100 text-text-tertiary", icon: "alertCircle" },
};

export function ApplicationStatusBadge({ tone, label, className }: {
  tone: ApplicationBadgeTone;
  label: string;
  className?: string;
}) {
  const { color, icon } = styles[tone];
  return (
    <span className={cn("inline-flex h-6 w-fit shrink-0 items-center gap-1 rounded-4xl px-3 text-label-medium whitespace-nowrap", color, className)}>
      <Icon name={icon} className="size-4" />
      {label}
    </span>
  );
}
