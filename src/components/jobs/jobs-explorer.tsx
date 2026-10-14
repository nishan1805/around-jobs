"use client";

import { useDeferredValue, useMemo, useState } from "react";

import { Icon } from "@/components/icon";
import { CategoryTag, JobCard } from "@/components/jobs/job-card";
import { TopBar } from "@/components/jobs/top-bar";
import { JobsMap, type MapCompany } from "@/components/map";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { breakpoints, useMediaQuery } from "@/hooks/use-media-query";
import {
  categories,
  employmentTypes,
  type Category,
  type City,
  type Company,
  type EmploymentType,
  type Job,
} from "@/lib/jobs";
import { cn } from "@/lib/utils";

type View = "map" | "list";

const toggle = <T,>(list: T[], value: T) =>
  list.includes(value) ? list.filter((item) => item !== value) : [...list, value];

const matchesQuery = (job: Job, query: string) => {
  if (!query) return true;
  const haystack = `${job.title} ${job.company.name} ${job.company.area} ${job.category}`.toLowerCase();
  return query
    .toLowerCase()
    .split(/\s+/)
    .every((term) => haystack.includes(term));
};

export function JobsExplorer({ jobs, companies, city }: { jobs: Job[]; companies: Company[]; city: City }) {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query.trim());
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<EmploymentType[]>([]);
  const [view, setView] = useState<View>("map");
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const isTablet = useMediaQuery(breakpoints.md);

  const filteredJobs = useMemo(
    () =>
      jobs.filter(
        (job) =>
          (selectedCategories.length === 0 || selectedCategories.includes(job.category)) &&
          (selectedTypes.length === 0 || selectedTypes.includes(job.employmentType)) &&
          matchesQuery(job, deferredQuery),
      ),
    [jobs, selectedCategories, selectedTypes, deferredQuery],
  );

  const mapCompanies = useMemo<MapCompany[]>(
    () =>
      companies
        .map((company) => ({
          company,
          jobCount: filteredJobs.filter((job) => job.company.slug === company.slug).length,
        }))
        .filter((item) => item.jobCount > 0),
    [companies, filteredJobs],
  );

  const initialBounds = useMemo(() => companies.map((item) => item.position), [companies]);

  const activeFilterCount = selectedCategories.length + selectedTypes.length;
  const hasAnyFilter = activeFilterCount > 0 || deferredQuery.length > 0;
  const clearAll = () => {
    setSelectedCategories([]);
    setSelectedTypes([]);
    setQuery("");
  };

  const company = companies.find((item) => item.slug === selectedCompany) ?? null;
  const companyJobs = company ? filteredJobs.filter((job) => job.company.slug === company.slug) : [];

  return (
    <>
      <TopBar query={query} onQueryChange={setQuery} locationLabel={`Shankar Nagar, ${city.name}`} />

      <main className="relative isolate flex min-h-0 flex-1 flex-col overflow-hidden">
        <h1 className="sr-only">Jobs near you in {city.name}</h1>
        <div
          className={cn(
            "z-1000 flex flex-col items-end gap-3 p-3 md:flex-row md:items-start md:justify-between md:gap-4 md:p-5",
            view === "map" ? "pointer-events-none absolute inset-x-0 top-0" : "border-b bg-background-primary",
          )}
        >
          <CategoryChips
            selected={selectedCategories}
            onToggle={(category) => setSelectedCategories((current) => toggle(current, category))}
            className="pointer-events-auto w-full md:w-auto md:min-w-0 md:flex-1 md:pt-1.5"
          />
          <ViewToggle view={view} onChange={setView} className="pointer-events-auto" />
        </div>

        {view === "map" ? (
          <div className="absolute inset-0">
            <JobsMap
              companies={mapCompanies}
              initialBounds={initialBounds}
              center={city.center}
              selectedSlug={selectedCompany}
              onSelectCompany={setSelectedCompany}
            />
            {filteredJobs.length === 0 && <NoResults onClear={clearAll} floating />}
          </div>
        ) : (
          <JobList jobs={filteredJobs} cityName={city.name} onClear={clearAll} hasAnyFilter={hasAnyFilter} />
        )}

        <Button
          variant="dark"
          onClick={() => setFiltersOpen(true)}
          className="absolute bottom-8 left-3 z-1000 gap-2.5 pr-3 pl-4 text-body-sm-medium md:bottom-9 md:left-5"
        >
          <Icon name="filters" className="size-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="flex size-5.5 items-center justify-center rounded-full bg-surface-default text-label-semibold text-grey-900">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </main>

      <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
        <SheetContent side={isTablet ? "right" : "bottom"}>
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
            <SheetDescription>Narrow down jobs around {city.name}.</SheetDescription>
          </SheetHeader>
          <div className="flex flex-col gap-6 overflow-y-auto px-4">
            <FilterGroup
              label="Category"
              options={categories.map((value) => ({ value, label: value }))}
              selected={selectedCategories}
              onToggle={(value) => setSelectedCategories((current) => toggle(current, value))}
            />
            <FilterGroup
              label="Job type"
              options={(Object.keys(employmentTypes) as EmploymentType[]).map((value) => ({
                value,
                label: employmentTypes[value],
              }))}
              selected={selectedTypes}
              onToggle={(value) => setSelectedTypes((current) => toggle(current, value))}
            />
          </div>
          <SheetFooter className="flex-row border-t">
            <Button variant="outline" className="flex-1" onClick={clearAll} disabled={!hasAnyFilter}>
              Clear all
            </Button>
            <Button className="flex-1" onClick={() => setFiltersOpen(false)}>
              Show {filteredJobs.length} {filteredJobs.length === 1 ? "job" : "jobs"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Sheet open={company !== null} onOpenChange={(open) => !open && setSelectedCompany(null)}>
        <SheetContent side={isTablet ? "right" : "bottom"}>
          {company && (
            <>
              <SheetHeader className="pr-12">
                <div className="flex items-center gap-2">
                  <CategoryTag>{company.category}</CategoryTag>
                </div>
                <SheetTitle className="mt-2">{company.name}</SheetTitle>
                <SheetDescription className="flex items-center gap-1">
                  <Icon name="pin" className="size-3.5" />
                  {company.streetAddress}, {company.area}
                </SheetDescription>
              </SheetHeader>
              <div className="flex flex-col gap-3 overflow-y-auto px-4 pb-4">
                <p className="text-label-semibold text-text-tertiary uppercase">
                  {companyJobs.length} open {companyJobs.length === 1 ? "role" : "roles"}
                </p>
                {companyJobs.map((job) => (
                  <JobCard key={job.slug} job={job} showCompany={false} />
                ))}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}

function CategoryChips({
  selected,
  onToggle,
  className,
}: {
  selected: Category[];
  onToggle: (category: Category) => void;
  className?: string;
}) {
  return (
    <div
      role="group"
      aria-label="Job categories"
      className={cn("flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden", className)}
    >
      {categories.map((category) => {
        const isSelected = selected.includes(category);
        return (
          <button
            key={category}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onToggle(category)}
            className={cn(
              "shrink-0 rounded-full border px-3 py-1.5 text-label-medium whitespace-nowrap transition-colors",
              isSelected
                ? "border-brand-primary bg-brand-primary text-text-on-brand"
                : "bg-surface-default text-text-secondary shadow-sm hover:bg-grey-100",
            )}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}

function ViewToggle({ view, onChange, className }: { view: View; onChange: (view: View) => void; className?: string }) {
  const options: { value: View; label: string; icon: "map" | "list" }[] = [
    { value: "map", label: "Map", icon: "map" },
    { value: "list", label: "List", icon: "list" },
  ];
  return (
    <div
      role="group"
      aria-label="View"
      className={cn("flex shrink-0 items-center rounded-4xl bg-surface-default p-1 shadow-md", className)}
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
              "flex h-8 items-center justify-center gap-2 rounded-4xl px-4 text-body-sm-semibold transition-colors",
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

function FilterGroup<T extends string>({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string;
  options: { value: T; label: string }[];
  selected: T[];
  onToggle: (value: T) => void;
}) {
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="mb-3 text-body-sm-semibold text-text-primary">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = selected.includes(option.value);
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onToggle(option.value)}
              className={cn(
                "rounded-full border px-3 py-2 text-body-sm-medium transition-colors",
                isSelected
                  ? "border-brand-primary bg-primary-50 text-brand-primary"
                  : "bg-surface-default text-text-secondary hover:bg-grey-100",
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function JobList({
  jobs,
  cityName,
  onClear,
  hasAnyFilter,
}: {
  jobs: Job[];
  cityName: string;
  onClear: () => void;
  hasAnyFilter: boolean;
}) {
  if (jobs.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <NoResults onClear={onClear} />
      </div>
    );
  }
  return (
    <div className="flex-1 overflow-y-auto bg-background-secondary">
      <div className="flex flex-col gap-4 p-4 pb-28 md:p-6 md:pb-28">
        <p className="text-body-sm-medium text-text-secondary">
          {jobs.length} {jobs.length === 1 ? "job" : "jobs"} {hasAnyFilter ? "match your search" : `around ${cityName}`}
        </p>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 lg:gap-4">
          {jobs.map((job) => (
            <JobCard key={job.slug} job={job} />
          ))}
        </div>
      </div>
    </div>
  );
}

function NoResults({ onClear, floating = false }: { onClear: () => void; floating?: boolean }) {
  return (
    <div
      role="status"
      className={cn(
        "flex max-w-sm flex-col items-center gap-3 rounded-xl bg-surface-default p-6 text-center",
        floating && "absolute top-1/2 left-1/2 z-1000 w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 shadow-xl",
      )}
    >
      <span className="flex size-12 items-center justify-center rounded-full bg-primary-50 text-brand-primary">
        <Icon name="briefcase" className="size-5" />
      </span>
      <div className="flex flex-col gap-1">
        <p className="text-subheading-semibold text-text-primary">No jobs match these filters</p>
        <p className="text-body-sm-regular text-text-secondary">Try another category or a broader search.</p>
      </div>
      <Button variant="outline" onClick={onClear}>
        Clear filters
      </Button>
    </div>
  );
}
