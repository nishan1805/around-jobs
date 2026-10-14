import { Fragment } from "react";

import { isEnded, stageLabels } from "@/lib/applications";
import { applicationStages, type Application } from "@/lib/seeker-store";
import { cn } from "@/lib/utils";

/** Furthest stepper step the application reached (rejected ones keep their last step). */
export function reachedStep(application: Application) {
  const stages = [application.stage, ...application.history.map((event) => event.stage)];
  return Math.max(0, ...stages.map((stage) => applicationStages.indexOf(stage as (typeof applicationStages)[number])));
}

/**
 * Figma "Progress" on the application card: 8px dots, 24px connectors. Done steps are
 * brand, the current step is semibold, future steps are grey.
 */
export function ProgressStepper({ application, className }: { application: Application; className?: string }) {
  const reached = reachedStep(application);
  const muted = isEnded(application);

  return (
    <ol aria-label="Application progress" className={cn("flex items-center gap-2", className)}>
      {applicationStages.map((stage, index) => {
        const done = index <= reached;
        const current = index === reached;
        return (
          <Fragment key={stage}>
            {index > 0 && (
              <li
                aria-hidden
                className={cn("h-0.5 w-3 shrink-0 rounded-4xl @xs:w-6", done && !muted ? "bg-brand-primary" : "bg-grey-200")}
              />
            )}
            <li
              aria-current={current ? "step" : undefined}
              className={cn(
                "flex shrink-0 items-center gap-1 whitespace-nowrap",
                current ? "text-body-sm-semibold" : "text-label-medium",
                done && !muted ? "text-brand-primary" : done ? "text-text-secondary" : "text-text-tertiary",
              )}
            >
              <span
                aria-hidden
                className={cn("size-2 rounded-full", done && !muted ? "bg-brand-primary" : done ? "bg-grey-500" : "bg-grey-300")}
              />
              <span className={current ? undefined : "sr-only @xs:not-sr-only"}>{stageLabels[stage]}</span>
              {!done && <span className="sr-only"> (not yet)</span>}
            </li>
          </Fragment>
        );
      })}
    </ol>
  );
}

/** Phone version of the stepper (M15): four segments with their labels underneath. */
export function ProgressBar({ application, className }: { application: Application; className?: string }) {
  const reached = reachedStep(application);
  const muted = isEnded(application);

  return (
    <ol aria-label="Application progress" className={cn("grid grid-cols-4 gap-1", className)}>
      {applicationStages.map((stage, index) => {
        const done = index <= reached;
        return (
          <li key={stage} aria-current={index === reached ? "step" : undefined} className="flex min-w-0 flex-col gap-1.5">
            <span
              aria-hidden
              className={cn("h-1 rounded-4xl", done && !muted ? "bg-brand-primary" : done ? "bg-grey-500" : "bg-grey-200")}
            />
            <span className={cn("truncate text-label-regular", done ? "text-text-secondary" : "text-text-tertiary")}>
              {stageLabels[stage]}
              {!done && <span className="sr-only"> (not yet)</span>}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
