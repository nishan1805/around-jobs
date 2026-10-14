import { Icon } from "@/components/icon";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function FiltersButton({
  count,
  onClick,
  expanded,
  className,
}: {
  count: number;
  onClick: () => void;
  expanded?: boolean;
  className?: string;
}) {
  return (
    <Button
      variant="dark"
      onClick={onClick}
      aria-expanded={expanded}
      aria-label={count > 0 ? `Filters, ${count} applied` : "Filters"}
      className={cn("gap-2.5 pr-3 pl-4 text-body-sm-medium", className)}
    >
      <Icon name="filters" className="size-4" />
      Filters
      {count > 0 && (
        <span className="flex size-5.5 items-center justify-center rounded-full bg-surface-default text-label-semibold text-grey-900">
          {count}
        </span>
      )}
    </Button>
  );
}
