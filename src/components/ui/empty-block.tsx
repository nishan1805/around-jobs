import type { ReactNode } from "react";

import { Icon, type IconName } from "@/components/icon";
import { cn } from "@/lib/utils";

/** Figma "Around / Jobs / Empty Block" (1888:42439). */
export function EmptyBlock({
  icon = "briefcase",
  title,
  body,
  action,
  className,
}: {
  icon?: IconName;
  title: string;
  body: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div role="status" className={cn("flex w-full flex-col items-center gap-3 px-6 py-8 text-center", className)}>
      <span className="flex rounded-full bg-grey-100 p-4.5 text-text-primary">
        <Icon name={icon} className="size-5" />
      </span>
      <p className="text-body-semibold text-text-primary">{title}</p>
      <p className="text-body-sm-regular text-text-secondary">{body}</p>
      {action}
    </div>
  );
}
