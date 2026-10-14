import type { ComponentProps } from "react";

import { Icon, type IconName } from "@/components/icon";
import { cn } from "@/lib/utils";

const variants = {
  /** White circle on top of photos and the map (gallery nav, close). */
  floating: "bg-surface-default p-2 shadow-sm hover:bg-grey-100",
  /** Bordered circle next to titles (save, share). */
  outline: "border bg-surface-default p-2.5 hover:bg-grey-100",
  /** Bare icon inside cards (bookmark). */
  plain: "p-0.5 hover:bg-grey-100",
} as const;

/** Figma "Around / Icon Button" (1900:16595). Always needs an accessible `label`. */
export function IconButton({
  icon,
  label,
  variant = "floating",
  iconClassName,
  className,
  ...props
}: Omit<ComponentProps<"button">, "children"> & {
  icon: IconName;
  label: string;
  variant?: keyof typeof variants;
  iconClassName?: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full text-text-primary transition-colors focus-visible:ring-3 focus-visible:ring-brand-primary/40 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        className,
      )}
      {...props}
    >
      <Icon name={icon} className={cn("size-5", iconClassName)} />
    </button>
  );
}
