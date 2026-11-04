"use client";

import Link from "next/link";

import { Icon } from "@/components/icon";
import { buttonVariants } from "@/components/ui/button";
import type { FrameJobCard } from "@/lib/seeker-design-seed";
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
        "flex w-full flex-col gap-3 rounded-md border bg-surface-default shadow-sm",
        layout === "saved" ? "px-4 py-5" : layout === "employer" ? "p-3" : "p-4",
      )}
    >
      <div className="flex items-start gap-3">
        {showLogo && card.initials && <LogoMark initials={card.initials} tone={card.tone ?? "info"} />}
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <div className="flex flex-col gap-1">
            {onOpen ? (
              <button type="button" onClick={onOpen} className="text-left text-body-semibold text-text-primary">
                {card.title}
              </button>
            ) : (
              <h3 className="text-body-semibold text-text-primary">{card.title}</h3>
            )}
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
              <p className="flex items-baseline gap-1">
                <span className="text-body-semibold text-text-primary">{card.salary}</span>
                <span className="text-body-sm-regular text-text-tertiary">/ month</span>
              </p>
            ) : layout !== "saved" ? (
              card.salary === "Salary not disclosed" ? (
                <GreyChip>{card.salary}</GreyChip>
              ) : (
                <p className="text-body-semibold text-text-primary">{card.salary}</p>
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
          onClick={onToggleSave}
          className={cn("text-text-primary", saved && "text-brand-primary")}
        >
          <Icon name={saved ? "bookmarkFilled" : "bookmark"} className="size-5" />
        </button>
      </div>
      <div className="h-px w-full bg-border-default" />
      {layout === "saved" ? (
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
          <div className="flex flex-col gap-1">
            <p className="flex items-baseline gap-1 whitespace-nowrap">
              <span className="text-body-semibold text-text-primary">{card.salary}</span>
              <span className="text-body-sm-regular text-text-tertiary">/ month</span>
            </p>
            <p className="flex items-center gap-2 text-body-sm-regular text-text-tertiary">
              <Icon name="calendar" className="size-5" />
              {card.posted}
            </p>
          </div>
          <Link href={`/?job=civil-engineer`} className={buttonVariants({ shape: "rect" })}>
            Apply now
          </Link>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-3">
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
