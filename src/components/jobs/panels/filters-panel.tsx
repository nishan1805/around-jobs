"use client";

import { useState, type CSSProperties, type ReactNode } from "react";

import { Icon } from "@/components/icon";
import { Chip } from "@/components/jobs/chip";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { defaultFilters, morePresets, SALARY_BOUNDS, toggleValue, type JobFilters, type MorePreset } from "@/lib/job-filters";
import {
  categories,
  employmentTypes,
  experienceBuckets,
  formatRupees,
  workModes,
  type EmploymentType,
  type ExperienceBucket,
  type WorkMode,
} from "@/lib/jobs";
import { cn } from "@/lib/utils";

import { MapPanel } from "./panel-parts";

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="flex flex-col gap-2.5">
      <legend className="mb-2.5 text-body-semibold text-text-primary md:text-body-medium md:text-grey-700">{title}</legend>
      {children}
    </fieldset>
  );
}

function ChipOptions<T extends string>({
  options,
  selected,
  onToggle,
}: {
  options: { value: T; label: string }[];
  selected: T[];
  onToggle: (value: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <Chip key={option.value} selected={selected.includes(option.value)} onClick={() => onToggle(option.value)}>
          {option.label}
        </Chip>
      ))}
    </div>
  );
}

const entries = <K extends string, V>(record: Record<K, V>) => Object.entries(record) as [K, V][];

function SalaryRange({ value, onChange }: { value: [number, number]; onChange: (value: [number, number]) => void }) {
  const { min, max, step } = SALARY_BOUNDS;
  const percent = (amount: number) => ((amount - min) / (max - min)) * 100;
  const style = { "--from": `${percent(value[0])}%`, "--to": `${percent(value[1])}%` } as CSSProperties;
  return (
    <>
      <p className="text-body-sm-regular text-text-secondary" aria-live="polite">
        {formatRupees(value[0])} – {formatRupees(value[1])} / month
      </p>
      <div className="range-dual relative h-5 w-full" style={style}>
        <span aria-hidden className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-grey-100" />
        <span
          aria-hidden
          className="absolute top-1/2 right-[calc(100%-var(--to))] left-(--from) h-1 -translate-y-1/2 rounded-full bg-brand-primary"
        />
        <input
          type="range"
          aria-label="Minimum monthly salary"
          min={min}
          max={max}
          step={step}
          value={value[0]}
          aria-valuetext={formatRupees(value[0])}
          onChange={(event) => onChange([Math.min(Number(event.target.value), value[1] - step), value[1]])}
        />
        <input
          type="range"
          aria-label="Maximum monthly salary"
          min={min}
          max={max}
          step={step}
          value={value[1]}
          aria-valuetext={formatRupees(value[1])}
          onChange={(event) => onChange([value[0], Math.max(Number(event.target.value), value[0] + step)])}
        />
      </div>
    </>
  );
}

/** The filter groups shared by the desktop panel (S04) and the mobile sheet. */
export function FilterFields({ filters, onChange }: { filters: JobFilters; onChange: (filters: JobFilters) => void }) {
  const [moreOpen, setMoreOpen] = useState(true);
  return (
    <>
      <div className="md:hidden">
        <Group title="Category">
          <ChipOptions
            options={categories.map((value) => ({ value, label: value }))}
            selected={filters.categories}
            onToggle={(value) => onChange({ ...filters, categories: toggleValue(filters.categories, value) })}
          />
        </Group>
      </div>
      <Group title="Experience">
        <ChipOptions<ExperienceBucket>
          options={entries(experienceBuckets).map(([value, bucket]) => ({ value, label: bucket.label }))}
          selected={filters.experience}
          onToggle={(value) => onChange({ ...filters, experience: toggleValue(filters.experience, value) })}
        />
      </Group>
      <Group title="Employment type">
        <ChipOptions<EmploymentType>
          options={entries(employmentTypes).map(([value, label]) => ({ value, label }))}
          selected={filters.types}
          onToggle={(value) => onChange({ ...filters, types: toggleValue(filters.types, value) })}
        />
      </Group>
      <Group title="Salary range">
        <SalaryRange value={filters.salary} onChange={(salary) => onChange({ ...filters, salary })} />
      </Group>
      <Group title="Work mode">
        <ChipOptions<WorkMode>
          options={entries(workModes).map(([value, label]) => ({ value, label }))}
          selected={filters.workModes}
          onToggle={(value) => onChange({ ...filters, workModes: toggleValue(filters.workModes, value) })}
        />
      </Group>
      <p className="text-label-medium text-text-tertiary md:hidden">Remote jobs are listed but not shown on the map.</p>
      <div className="flex flex-col gap-2.5">
        <button
          type="button"
          aria-expanded={moreOpen}
          aria-controls="filter-more"
          onClick={() => setMoreOpen((open) => !open)}
          className="flex w-full items-center text-left text-body-semibold text-text-primary"
        >
          <span className="flex-1">More filters</span>
          <Icon name="chevronDown" className={cn("size-4 transition-transform", moreOpen && "rotate-180")} />
        </button>
        {moreOpen && (
          <div id="filter-more">
            <ChipOptions<MorePreset>
              options={entries(morePresets).map(([value, label]) => ({ value, label }))}
              selected={filters.more}
              onToggle={(value) => {
                const more = toggleValue(filters.more, value);
                // "Posted in 24h" and "Last 7 days" are alternatives, not a combination.
                const exclusive = value === "posted24h" ? "posted7d" : value === "posted7d" ? "posted24h" : null;
                onChange({ ...filters, more: exclusive ? more.filter((item) => item !== exclusive) : more });
              }}
            />
          </div>
        )}
      </div>
    </>
  );
}

/** Figma "Around / Jobs / Filters Panel" (1953:19326), screen S04. */
export function FiltersPanel({
  filters,
  onChange,
  resultCount,
  onDone,
}: {
  filters: JobFilters;
  onChange: (filters: JobFilters) => void;
  resultCount: number;
  onDone: () => void;
}) {
  const reset = () => onChange({ ...defaultFilters, query: filters.query });
  return (
    <MapPanel label="Filters" width="narrow" onDismiss={onDone}>
      <div className="flex shrink-0 items-center gap-3 px-5 pt-1 md:p-4 md:pb-0">
        <h2 className="flex-1 text-heading-semibold text-text-primary md:text-subheading-semibold">Filters</h2>
        <IconButton variant="outline" icon="close" label="Close filters" onClick={onDone} iconClassName="size-4" />
      </div>
      <div className="flex flex-1 flex-col gap-5 overflow-y-auto overscroll-contain px-10 py-5 md:p-4">
        <FilterFields filters={filters} onChange={onChange} />
      </div>
      <div className="flex shrink-0 gap-3 border-t px-5 py-3 md:border-t-0 md:p-4 md:pt-0">
        <Button variant="outline" shape="rect" className="h-11 flex-1" onClick={reset}>
          Reset
        </Button>
        <Button shape="rect" className="h-11 flex-1" onClick={onDone}>
          <span className="md:hidden">Apply</span>
          <span className="hidden md:inline">
            Show {resultCount} {resultCount === 1 ? "job" : "jobs"}
          </span>
        </Button>
      </div>
    </MapPanel>
  );
}
