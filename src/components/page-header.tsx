import type { ReactNode } from "react";

import { Icon, type IconName } from "@/components/icon";
import { cn } from "@/lib/utils";

/** Title block at the top of My applications and Saved. Phones can use shorter copy (M15, M19). */
export function PageHeader({
  title,
  subtitle,
  mobileTitle,
  mobileSubtitle,
  className,
  titleClassName,
}: {
  title: string;
  subtitle?: ReactNode;
  mobileTitle?: string;
  mobileSubtitle?: ReactNode;
  className?: string;
  titleClassName?: string;
}) {
  return (
    <header className={cn("flex flex-col gap-1 max-md:gap-3", className)}>
      <h1 className={cn("text-heading-semibold text-text-primary md:text-display-small-semibold", titleClassName)}>
        {mobileTitle ? (
          <>
            <span className="md:hidden">{mobileTitle}</span>
            <span className="max-md:hidden">{title}</span>
          </>
        ) : (
          title
        )}
      </h1>
      {subtitle ? (
        <p className="text-body-sm-regular text-text-secondary">
          {mobileSubtitle ? (
            <>
              <span className="md:hidden">{mobileSubtitle}</span>
              <span className="max-md:hidden">{subtitle}</span>
            </>
          ) : (
            subtitle
          )}
        </p>
      ) : null}
    </header>
  );
}

/** Large centred empty state with an illustration tile (1985:23849, 1985:24057). */
export function EmptyPage({
  icon,
  title,
  body,
  action,
  className,
}: {
  icon: IconName;
  title: string;
  body: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div role="status" className={cn("flex flex-1 flex-col items-center justify-center gap-4 py-10 text-center", className)}>
      <span className="flex h-28 w-42.5 items-center justify-center rounded-xl bg-primary-50 text-brand-primary">
        <Icon name={icon} className="size-8" />
      </span>
      <div className="flex flex-col gap-2">
        <p className="text-heading-semibold text-text-primary">{title}</p>
        <p className="text-body-sm-regular text-text-secondary">{body}</p>
      </div>
      {action}
    </div>
  );
}
