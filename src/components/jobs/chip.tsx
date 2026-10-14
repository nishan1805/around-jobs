import type { ComponentProps } from "react";

import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";

/** Figma "Around / Jobs / Category Chip" (1888:42379, Default / Selected). */
export function Chip({
  selected = false,
  className,
  ...props
}: ComponentProps<"button"> & { selected?: boolean }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cn(
        "inline-flex shrink-0 items-center rounded-full border px-3 py-1.5 text-label-medium whitespace-nowrap transition-colors focus-visible:ring-3 focus-visible:ring-brand-primary/40 focus-visible:outline-none",
        selected
          ? "border-brand-primary bg-brand-primary text-text-on-brand"
          : "bg-surface-default text-text-secondary hover:bg-grey-100",
        className,
      )}
      {...props}
    />
  );
}

/** Static chip for read-only lists such as skills. */
export function Tag({ className, ...props }: ComponentProps<"li">) {
  return (
    <li
      className={cn(
        "inline-flex shrink-0 items-center rounded-full border bg-surface-default px-3 py-1.5 text-label-medium text-text-secondary",
        className,
      )}
      {...props}
    />
  );
}

/** Applied filter with a remove "×" (S05). */
export function RemovableChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <button
      type="button"
      onClick={onRemove}
      aria-label={`Remove filter: ${label}`}
      className="inline-flex shrink-0 items-center gap-1 rounded-full bg-brand-primary py-1.5 pr-2 pl-3 text-label-medium text-text-on-brand transition-colors hover:bg-primary-600 focus-visible:ring-3 focus-visible:ring-brand-primary/40 focus-visible:outline-none"
    >
      {label}
      <Icon name="close" className="size-3" />
    </button>
  );
}
