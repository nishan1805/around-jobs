"use client";

import { useCallback, useDeferredValue, useEffect, useMemo, useState, useSyncExternalStore } from "react";

import { Chip } from "@/components/jobs/chip";
import { FiltersButton } from "@/components/jobs/filters-button";
import { MapPeek, MobileSearchBar } from "@/components/jobs/mobile-map-controls";
import { EmployerPanel } from "@/components/jobs/panels/employer-panel";
import { FiltersPanel } from "@/components/jobs/panels/filters-panel";
import { JobDetailPanel } from "@/components/jobs/panels/job-detail-panel";
import { JobsListPanel, type ListStatus } from "@/components/jobs/panels/jobs-list-panel";
import { panelInset } from "@/components/jobs/panels/panel-parts";
import { TopBar } from "@/components/jobs/top-bar";
import { ViewToggle } from "@/components/jobs/view-toggle";
import { JobsMap, type FitRequest, type MapCompany, type MapView } from "@/components/map";
import { Button } from "@/components/ui/button";
import { EmptyBlock } from "@/components/ui/empty-block";
import { breakpoints, useMediaQuery } from "@/hooks/use-media-query";
import { activeFilters, defaultFilters, matchesFilters, toggleValue, type JobFilters } from "@/lib/job-filters";
import { categories, distanceKm, isOpen, type City, type Company, type Job } from "@/lib/jobs";
import { cn } from "@/lib/utils";
import { useCoverTabBar } from "@/hooks/use-cover-tab-bar";

type Panel =
  | { kind: "none" }
  | { kind: "list" }
  | { kind: "company"; slug: string; back: Panel }
  | { kind: "job"; slug: string; back: Panel }
  | { kind: "filters"; back: Panel };

const none: Panel = { kind: "none" };

/** The searched location; GPS isn't used for the list yet. */
const LOCATION_AREA = "Shankar Nagar";

const subscribeToUrl = (onChange: () => void) => {
  window.addEventListener("popstate", onChange);
  return () => window.removeEventListener("popstate", onChange);
};
const useSearchParam = (name: string) =>
  useSyncExternalStore(
    subscribeToUrl,
    () => new URLSearchParams(window.location.search).get(name),
    () => null,
  );

const inView = (view: MapView | null, [lat, lng]: [number, number]) =>
  !view || (lat >= view[0][0] && lat <= view[1][0] && lng >= view[0][1] && lng <= view[1][1]);

export function JobsExplorer({ jobs, companies, city }: { jobs: Job[]; companies: Company[]; city: City }) {
  const [filters, setFilters] = useState<JobFilters>(defaultFilters);
  const deferredFilters = useDeferredValue(filters);
  const [panelState, setPanel] = useState<Panel | null>(null);
  const [mapView, setMapView] = useState<MapView | null>(null);
  const [fitRequest, setFitRequest] = useState<FitRequest | null>(null);
  const [retried, setRetried] = useState(false);
  const isTablet = useMediaQuery(breakpoints.md);

  // Deep links: `?view=list`, `?company=<slug>` (shared employer links), `?job=<slug>`,
  // `?filters=open`. `?state=loading|error` previews the Jobs List loading and error
  // states until a real API is wired in.
  const companyParam = useSearchParam("company");
  const jobParam = useSearchParam("job");
  const viewParam = useSearchParam("view");
  const filtersParam = useSearchParam("filters");
  const stateParam = useSearchParam("state");
  const queryParam = useSearchParam("q");
  const [seenQueryParam, setSeenQueryParam] = useState<string | null>(null);
  if (queryParam !== seenQueryParam) {
    setSeenQueryParam(queryParam);
    if (queryParam) setFilters((current) => ({ ...current, query: queryParam }));
  }
  const linkedPanel = (): Panel => {
    const list: Panel = viewParam === "list" ? { kind: "list" } : none;
    if (jobParam && jobs.some((item) => item.slug === jobParam)) return { kind: "job", slug: jobParam, back: list };
    if (companyParam && companies.some((item) => item.slug === companyParam))
      return { kind: "company", slug: companyParam, back: list };
    if (filtersParam === "open") return { kind: "filters", back: list };
    return list;
  };
  const panel: Panel = panelState ?? linkedPanel();

  const from = city.center;
  const openJobs = useMemo(() => jobs.filter(isOpen), [jobs]);
  const matching = useMemo(
    () =>
      openJobs
        .filter((job) => matchesFilters(job, deferredFilters))
        .sort((a, b) => distanceKm(from, a.company.position) - distanceKm(from, b.company.position)),
    [openJobs, deferredFilters, from],
  );
  const chips = activeFilters(filters);
  const hasAnyFilter = chips.length > 0 || filters.categories.length > 0 || filters.query.trim().length > 0;

  const mapCompanies = useMemo<MapCompany[]>(
    () =>
      companies
        .map((company) => ({
          company,
          jobCount: matching.filter((job) => job.company.slug === company.slug && job.workMode !== "REMOTE").length,
        }))
        .filter((item) => item.jobCount > 0 || (!hasAnyFilter && !openJobs.some((job) => job.company.slug === item.company.slug))),
    [companies, matching, hasAnyFilter, openJobs],
  );
  const initialBounds = useMemo(() => companies.map((item) => item.position), [companies]);
  const listJobs = useMemo(
    () => matching.filter((job) => job.workMode === "REMOTE" || inView(mapView, job.company.position)),
    [matching, mapView],
  );

  const status: ListStatus =
    !retried && (stateParam === "loading" || stateParam === "error")
      ? stateParam
      : filters !== deferredFilters
        ? "loading"
        : "ready";

  const open = useCallback((next: Panel) => setPanel(next), []);
  const close = useCallback(() => setPanel(none), []);
  const back = (current: Panel) => ("back" in current ? current.back : none);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || event.defaultPrevented) return;
      setPanel((current) => (current && "back" in current ? current.back : none));
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const selectedCompanySlug =
    panel.kind === "company"
      ? panel.slug
      : panel.kind === "job"
        ? (jobs.find((job) => job.slug === panel.slug)?.company.slug ?? null)
        : null;

  const panelWidth = panel.kind === "filters" ? "narrow" : "wide";
  const panelOpen = panel.kind !== "none";
  const coversTabBar = panel.kind === "job" || panel.kind === "filters";

  useCoverTabBar(coversTabBar);
  const insetLeft = isTablet && panelOpen ? panelInset[panelWidth] : 0;

  const openJob = (job: Job) => open({ kind: "job", slug: job.slug, back: panel });
  const openFilters = () => open(panel.kind === "filters" ? back(panel) : { kind: "filters", back: panel });

  const renderPanel = () => {
    switch (panel.kind) {
      case "none":
        return null;
      case "list":
        return (
          <JobsListPanel
            cityName={city.name}
            status={status}
            jobs={listJobs}
            totalMatching={matching.length}
            filters={filters}
            onFiltersChange={setFilters}
            onOpenFilters={openFilters}
            onClose={close}
            onSelectJob={openJob}
            onSearchArea={() => setFitRequest((current) => ({ key: (current?.key ?? 0) + 1, positions: matching.map((job) => job.company.position) }))}
            onRetry={() => setRetried(true)}
            from={from}
          />
        );
      case "company": {
        const company = companies.find((item) => item.slug === panel.slug);
        if (!company) return null;
        return (
          <EmployerPanel
            key={company.slug}
            company={company}
            jobs={openJobs.filter((job) => job.company.slug === company.slug)}
            from={from}
            cityName={city.name}
            onClose={() => open(back(panel))}
            onSelectJob={openJob}
          />
        );
      }
      case "job": {
        const job = jobs.find((item) => item.slug === panel.slug);
        if (!job) return null;
        const previous = back(panel);
        return (
          <JobDetailPanel
            key={job.slug}
            job={job}
            onBack={() => open(previous)}
            backLabel={previous.kind === "list" ? "Back to jobs list" : previous.kind === "company" ? "Back to employer" : "Close job details"}
          />
        );
      }
      case "filters":
        return (
          <FiltersPanel filters={filters} onChange={setFilters} resultCount={matching.length} onDone={() => open(back(panel))} />
        );
    }
  };

  return (
    <>
      <TopBar
        query={filters.query}
        onQueryChange={(query) => setFilters((current) => ({ ...current, query }))}
        locationLabel={`${LOCATION_AREA}, ${city.name}`}
      />

      <main
        className={cn(
          "relative isolate flex min-h-0 flex-1 flex-col overflow-hidden",
          !panelOpen && "max-md:[--map-inset-bottom:8.75rem]",
        )}
      >
        <h1 className="sr-only">Jobs near you in {city.name}</h1>

        <div className="absolute inset-0">
          <JobsMap
            companies={mapCompanies}
            initialBounds={initialBounds}
            center={city.center}
            selectedSlug={selectedCompanySlug}
            onSelectCompany={(slug) => open({ kind: "company", slug, back: panel.kind === "list" ? panel : none })}
            onViewChange={setMapView}
            fitRequest={fitRequest}
            insetLeft={insetLeft}
          />
        </div>

        <div
          className={cn(
            "pointer-events-none absolute inset-x-0 top-0 z-1000 flex flex-col gap-2 px-5 pt-3 md:flex-row md:items-start md:justify-between md:gap-4 md:p-6",
            panelOpen && "max-md:hidden",
            panelOpen && (panelWidth === "wide" ? "md:pl-124" : "md:pl-88"),
          )}
        >
          <MobileSearchBar
            query={filters.query}
            onQueryChange={(query) => setFilters((current) => ({ ...current, query }))}
            filterCount={chips.length}
            onOpenFilters={openFilters}
          />
          <div
            role="group"
            aria-label="Job categories"
            className="pointer-events-auto -mx-1 flex flex-wrap gap-2 md:mx-0 md:w-auto md:min-w-0 md:flex-1 md:flex-nowrap md:overflow-x-auto md:py-1.5 md:[scrollbar-width:none] md:*:shrink-0"
          >
            {categories.map((category) => (
              <Chip
                key={category}
                selected={filters.categories.includes(category)}
                onClick={() => setFilters((current) => ({ ...current, categories: toggleValue(current.categories, category) }))}
                className={cn(!filters.categories.includes(category) && "border-transparent shadow-sm")}
              >
                {category}
              </Chip>
            ))}
          </div>
          <ViewToggle
            view={panel.kind === "list" ? "list" : "map"}
            onChange={(view) => open(view === "list" ? { kind: "list" } : none)}
            className="pointer-events-auto max-md:hidden"
          />
        </div>

        {!panelOpen && (
          <MapPeek
            title={`${matching.length} ${matching.length === 1 ? "job" : "jobs"} near ${LOCATION_AREA}`}
            onOpenList={() => open({ kind: "list" })}
          />
        )}

        {renderPanel()}

        {!panelOpen && matching.length === 0 && status === "ready" && (
          <div className="absolute top-1/2 left-1/2 z-1000 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-xl bg-surface-default shadow-xl">
            <EmptyBlock
              title="No jobs match your filters"
              body="Try another category, widen the salary range or clear filters."
              action={
                <Button variant="outline" shape="rect" onClick={() => setFilters(defaultFilters)}>
                  Clear filters
                </Button>
              }
            />
          </div>
        )}

        <FiltersButton
          count={chips.length}
          expanded={panel.kind === "filters"}
          onClick={openFilters}
          className={cn(
            "absolute bottom-6 left-6 z-1000 max-md:hidden",
            panelOpen && (panelWidth === "wide" ? "md:left-124" : "md:left-88"),
          )}
        />
      </main>
    </>
  );
}
