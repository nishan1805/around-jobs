"use client";

import { ApplyButton } from "@/components/jobs/apply-button";
import { Icon } from "@/components/icon";
import type { FrameJobCard } from "@/lib/seeker-design-seed";
import { SAMPLE_APPLY_SLUG } from "@/lib/seeker-design-seed";
import { cn } from "@/lib/utils";

function LogoMark({ initials, tone }: { initials: string; tone: "info" | "orange" }) {
  return (
    <span
      className={cn(
        "relative flex size-12 shrink-0 flex-col items-center justify-center overflow-hidden rounded-sm",
        tone === "orange" ? "bg-secondary-50" : "bg-info-50",
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/icons/logo-roof.svg" alt="" width={20} height={20} />
      <span className="text-body-bold text-text-primary">{initials}</span>
    </span>
  );
}

function GreyChip({ children }: { children: string }) {
  return <span className="rounded-full bg-grey-100 px-2 py-0.5 text-label-medium text-text-secondary">{children}</span>;
}

/** "Salary not disclosed" stays bare. A string that already says /mo does not gain a second "/ month". */
function SalaryText({ salary, withMonth }: { salary: string; withMonth?: boolean }) {
  const undisclosed = /not disclosed/i.test(salary);
  const text = undisclosed ? "Salary not disclosed" : salary.replace(/\s*\/\s*month\s*$/i, "");
  const showMonth = Boolean(withMonth) && !undisclosed && !/\/\s*mo(nth)?\b/i.test(text);
  return (
    <p className="flex items-baseline gap-1">
      <span className={undisclosed ? "text-body-sm-regular text-text-secondary" : "text-body-semibold text-text-primary"}>{text}</span>
      {showMonth && <span className="text-body-sm-regular text-text-tertiary">/ month</span>}
    </p>
  );
}

/** Finalized job card used by S03, S06, S17 and the employer jobs list. */
export function FrameJobCardView({
  card,
  layout = "list",
  saved = false,
  expiring = false,
  onOpen,
  onToggleSave,
}: {
  card: FrameJobCard;
  layout?: "list" | "saved" | "employer";
  saved?: boolean;
  expiring?: boolean;
  onOpen?: () => void;
  onToggleSave?: () => void;
}) {
  const showLogo = layout !== "employer";
  return (
    <article
      className={cn(
        "relative flex w-full flex-col gap-3 rounded-md border bg-surface-default shadow-sm",
        onOpen && "cursor-pointer",
        layout === "saved" ? "px-4 py-5" : layout === "employer" ? "p-3" : "p-4",
      )}
    >
      {onOpen && (
        <button
          type="button"
          onClick={onOpen}
          aria-label={`View ${card.title}`}
          className="absolute inset-0 z-0 rounded-md outline-none focus-visible:ring-3 focus-visible:ring-brand-primary/40"
        />
      )}
      <div className={cn("flex items-start gap-3", onOpen && "pointer-events-none")}>
        {showLogo && card.initials && <LogoMark initials={card.initials} tone={card.tone ?? "info"} />}
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <div className="flex flex-col gap-1">
            <h3 className="text-body-semibold text-text-primary">{card.title}</h3>
            {card.company && (
              <p className="flex items-center gap-1 text-body-sm-regular text-text-secondary">
                {card.company}
                {card.verified && <Icon name="verified" className="size-5 text-success-700" />}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <p className="flex items-start gap-1 text-body-sm-regular text-text-tertiary">
              <Icon name="pinSm" className="mt-0.5 size-4 shrink-0" />
              <span className={layout === "saved" ? "whitespace-nowrap" : "truncate"}>{card.location}</span>
            </p>
            {layout === "employer" ? (
              <SalaryText salary={card.salary} withMonth />
            ) : layout !== "saved" ? (
              /not disclosed/i.test(card.salary) ? (
                <GreyChip>Salary not disclosed</GreyChip>
              ) : (
                <p className="text-body-semibold text-text-primary">{card.salary.replace(/\s*\/\s*month\s*$/i, "")}</p>
              )
            ) : null}
            <div className="flex flex-wrap gap-1.5">
              <GreyChip>{card.employment}</GreyChip>
              <GreyChip>{card.experience}</GreyChip>
              {expiring && <span className="rounded-full bg-warning-50 px-2 py-0.5 text-label-medium text-warning-700">Expiring soon</span>}
            </div>
          </div>
        </div>
        <button
          type="button"
          aria-label={saved ? `Remove ${card.title} from saved` : `Save ${card.title}`}
          aria-pressed={saved}
          onClick={(event) => {
            event.stopPropagation();
            onToggleSave?.();
          }}
          className={cn("pointer-events-auto relative z-1 text-text-primary", saved && "text-brand-primary")}
        >
          <Icon name={saved ? "bookmarkFilled" : "bookmark"} className="size-5" />
        </button>
      </div>
      <div className={cn("h-px w-full bg-border-default", onOpen && "pointer-events-none")} />
      {layout === "saved" ? (
        <div className={cn("flex flex-wrap items-center justify-between gap-x-3 gap-y-2", onOpen && "pointer-events-none")}>
          <div className="flex flex-col gap-1">
            <SalaryText salary={card.salary} withMonth />
            <p className="flex items-center gap-2 text-body-sm-regular text-text-tertiary">
              <Icon name="calendar" className="size-5" />
              {card.posted}
            </p>
          </div>
          <ApplyButton jobSlug={SAMPLE_APPLY_SLUG} status="open" className="pointer-events-auto relative z-1" />
        </div>
      ) : (
        <div className={cn("flex items-center justify-between gap-3", onOpen && "pointer-events-none")}>
          <p className="flex items-center gap-2 text-body-sm-regular text-text-tertiary">
            <Icon name="calendar" className="size-5" />
            {card.posted}
          </p>
          {card.applied && (
            <span className="inline-flex items-center gap-1 rounded-full bg-success-50 px-3 py-0.5 text-body-sm-semibold text-success-700">
              <Icon name="checkCircle" className="size-4" />
              Applied
            </span>
          )}
        </div>
      )}
    </article>
  );
}
