import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";

export type View = "map" | "list";

const options = [
  { value: "map", label: "Map", icon: "map" },
  { value: "list", label: "List", icon: "list" },
] as const;

/** Map / List segmented control (top-right of the map and in the Jobs List header). */
export function ViewToggle({
  view,
  onChange,
  size = "default",
  className,
}: {
  view: View;
  onChange: (view: View) => void;
  size?: "default" | "sm";
  className?: string;
}) {
  return (
    <div
      role="group"
      aria-label="View"
      className={cn(
        "flex shrink-0 items-center rounded-4xl bg-surface-default p-1",
        size === "default" && "shadow-md",
        className,
      )}
    >
      {options.map((option) => {
        const isActive = option.value === view;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(option.value)}
            className={cn(
              "flex items-center justify-center gap-2 rounded-4xl text-body-sm-semibold transition-colors",
              size === "default" ? "h-8 px-4" : "h-8 px-3",
              isActive ? "bg-brand-primary text-text-on-brand" : "text-text-primary hover:bg-grey-100",
            )}
          >
            <Icon name={option.icon} />
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
