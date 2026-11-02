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
      variant="outline"
      onClick={onClick}
      aria-expanded={expanded}
      aria-label={count > 0 ? `Filters, ${count} applied` : "Filters"}
      className={cn(
        "h-11 gap-2 rounded-full border-grey-300 bg-grey-50 px-4 text-body-sm-medium text-grey-900 shadow-none hover:bg-grey-100",
        className,
      )}
    >
      <Icon name="filters" className="size-5" />
      Filters
      {count > 0 && (
        <span className="flex size-5 items-center justify-center rounded-full bg-grey-200 text-label-semibold text-grey-800">
          {count}
        </span>
      )}
    </Button>
  );
}
