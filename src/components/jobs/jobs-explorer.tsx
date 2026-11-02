"use client";

import { useCallback, useDeferredValue, useEffect, useMemo, useState } from "react";

import { Chip } from "@/components/jobs/chip";
import { FiltersButton } from "@/components/jobs/filters-button";
import { MapPeek, MobileSearchBar } from "@/components/jobs/mobile-map-controls";
import { DesignEmployerPanel, DesignJobDetailPanel, type EmployerVariant } from "@/components/jobs/panels/design-panels";
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
import { useSearchParam } from "@/hooks/use-search-param";
import { activeFilters, defaultFilters, filterBadgeCount, matchesFilters, toggleValue, type JobFilters } from "@/lib/job-filters";
import {
  categories,
  distanceKm,
  employmentTypes,
  isOpen,
  workModes,
  type Category,
  type City,
  type Company,
  type EmploymentType,
  type Job,
  type WorkMode,
} from "@/lib/jobs";
import {
  BROWSE_LIST_SUBTITLE,
  browseListSeed,
  CIVIL_ENGINEER_SLUG,
  FILTERED_LIST_SUBTITLE,
  filteredListSeed,
  RAIPUR_BUILDER_SLUG,
  type JobDetailVariant,
} from "@/lib/seeker-design-seed";
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
  const categoryParam = useSearchParam("category");
  const typeParam = useSearchParam("type");
  const modeParam = useSearchParam("mode");
  const employerVariant = useSearchParam("employer");
  const detailVariant = useSearchParam("detail");
  const [seenQueryParam, setSeenQueryParam] = useState<string | null>(null);
  const previewKey = `${queryParam ?? ""}|${categoryParam ?? ""}|${typeParam ?? ""}|${modeParam ?? ""}|${filtersParam ?? ""}`;
  const frameFilters =
    filtersParam === "open" && categoryParam === "Retail" && typeParam === "FULL_TIME" && modeParam === "ON_SITE";
  if (previewKey !== seenQueryParam) {
    setSeenQueryParam(previewKey);
    setFilters((current) => ({
      ...current,
      query: queryParam ?? current.query,
      categories:
        categoryParam && (categories as readonly string[]).includes(categoryParam)
          ? [categoryParam as Category]
          : current.categories,
      types: typeParam && typeParam in employmentTypes ? [typeParam as EmploymentType] : current.types,
      workModes: modeParam && modeParam in workModes ? [modeParam as WorkMode] : current.workModes,
      experience: frameFilters ? ["FRESHER"] : current.experience,
      salary: frameFilters ? [10_000, 50_000] : current.salary,
    }));
  }
  const linkedPanel = (): Panel => {
    const list: Panel = viewParam === "list" ? { kind: "list" } : none;
    if (jobParam === CIVIL_ENGINEER_SLUG || (jobParam && jobs.some((item) => item.slug === jobParam)))
      return { kind: "job", slug: jobParam, back: list };
    if (companyParam === RAIPUR_BUILDER_SLUG || (companyParam && companies.some((item) => item.slug === companyParam)))
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
  const badgeCount = filterBadgeCount(filters);
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
  const dockRight = panel.kind === "company" || panel.kind === "job";
  const panelOpen = panel.kind !== "none";
  const coversTabBar = panel.kind === "job" || panel.kind === "filters";

  useCoverTabBar(coversTabBar);
  const insetLeft = isTablet && panelOpen && !dockRight ? panelInset[panelWidth] : 0;
  const insetRight = isTablet && panelOpen && dockRight ? panelInset.wide : 0;

  const openJob = (job: Job) => open({ kind: "job", slug: job.slug, back: panel });
  const openFilters = () => open(panel.kind === "filters" ? back(panel) : { kind: "filters", back: panel });

  const renderPanel = () => {
    switch (panel.kind) {
      case "none":
        return null;
      case "list": {
        const quiet =
          stateParam === "loading" || stateParam === "error" || stateParam === "none" || stateParam === "empty";
        const filteredFrame =
          !quiet &&
          filters.categories.includes("Retail") &&
          filters.types.includes("FULL_TIME") &&
          filters.workModes.includes("ON_SITE");
        const browseFrame =
          !quiet &&
          !filteredFrame &&
          filters.categories.length === 0 &&
          filters.types.length === 0 &&
          filters.workModes.length === 0 &&
          filters.experience.length === 0 &&
          filters.more.length === 0 &&
          !filters.query.trim();
        return (
          <JobsListPanel
            cityName={city.name}
            status={status}
            jobs={stateParam === "empty" ? [] : listJobs}
            totalMatching={stateParam === "none" ? 0 : stateParam === "empty" ? Math.max(matching.length, 1) : matching.length}
            filters={filters}
            onFiltersChange={setFilters}
            onOpenFilters={openFilters}
            onClose={close}
            onSelectJob={openJob}
            onSearchArea={() => setFitRequest((current) => ({ key: (current?.key ?? 0) + 1, positions: matching.map((job) => job.company.position) }))}
            onChangeArea={() => {
              const url = new URL(window.location.href);
              url.searchParams.set("location", "open");
              window.history.replaceState(null, "", url);
              window.dispatchEvent(new PopStateEvent("popstate"));
            }}
            onRetry={() => setRetried(true)}
            from={from}
            desktopCards={filteredFrame ? filteredListSeed : browseFrame ? browseListSeed : null}
            desktopSubtitle={filteredFrame ? FILTERED_LIST_SUBTITLE : browseFrame ? BROWSE_LIST_SUBTITLE : undefined}
            onOpenDesignJob={() => open({ kind: "job", slug: CIVIL_ENGINEER_SLUG, back: panel })}
          />
        );
      }
      case "company": {
        if (panel.slug === RAIPUR_BUILDER_SLUG) {
          const variant: EmployerVariant =
            employerVariant === "about" || employerVariant === "one" || employerVariant === "empty" || employerVariant === "unverified"
              ? employerVariant
              : "jobs";
          return (
            <DesignEmployerPanel
              variant={variant}
              onClose={() => open(back(panel))}
              onOpenJob={() => open({ kind: "job", slug: CIVIL_ENGINEER_SLUG, back: panel })}
            />
          );
        }
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
        if (panel.slug === CIVIL_ENGINEER_SLUG) {
          const variant: JobDetailVariant =
            detailVariant === "expired" || detailVariant === "applied" || detailVariant === "remote" || detailVariant === "closed"
              ? detailVariant
              : "open";
          return <DesignJobDetailPanel variant={variant} onBack={() => open(back(panel))} />;
        }
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
        const showFrameCount =
          filters.categories.length === 1 &&
          filters.categories[0] === "Retail" &&
          filters.types.length === 1 &&
          filters.types[0] === "FULL_TIME" &&
          filters.workModes.length === 1 &&
          filters.workModes[0] === "ON_SITE" &&
          filters.experience.length === 1 &&
          filters.experience[0] === "FRESHER" &&
          filters.salary[0] === 10_000 &&
          filters.salary[1] === 50_000;
        return (
          <FiltersPanel
            filters={filters}
            onChange={setFilters}
            resultCount={showFrameCount ? 3 : matching.length}
            onDone={() => open(back(panel))}
          />
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
            insetRight={insetRight}
          />
        </div>

        <div
          className={cn(
            "pointer-events-none absolute inset-x-0 top-0 z-1000 flex flex-col gap-2 px-5 pt-3 md:flex-row md:items-start md:justify-between md:gap-4 md:p-6",
            panelOpen && "max-md:hidden",
            panelOpen && !dockRight && (panelWidth === "wide" ? "md:pl-124" : "md:pl-[428px]"),
          )}
        >
          <MobileSearchBar
            query={filters.query}
            onQueryChange={(query) => setFilters((current) => ({ ...current, query }))}
            filterCount={badgeCount}
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

        {panel.kind !== "filters" && (
          <FiltersButton
            count={badgeCount}
            expanded={false}
            onClick={openFilters}
            className={cn(
              "absolute bottom-6 left-6 z-1000 max-md:hidden",
              panelOpen && !dockRight && (panelWidth === "wide" ? "md:left-124" : "md:left-[428px]"),
            )}
          />
        )}
      </main>
    </>
  );
}
