"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { Chip } from "@/components/jobs/chip";
import { FiltersButton } from "@/components/jobs/filters-button";
import { LocationPill, LocationSheet, MapAccountCluster, MapPeek, MobileSearchBar } from "@/components/jobs/mobile-map-controls";
import type { SheetSnap } from "@/components/jobs/panels/panel-parts";
import { EmployerPanel } from "@/components/jobs/panels/employer-panel";
import { FiltersPanel } from "@/components/jobs/panels/filters-panel";
import { JobDetailPanel } from "@/components/jobs/panels/job-detail-panel";
import { JobsListPanel, type ListStatus } from "@/components/jobs/panels/jobs-list-panel";
import { panelInset } from "@/components/jobs/panels/panel-parts";
import { TopBar } from "@/components/jobs/top-bar";
import { ViewToggle } from "@/components/jobs/view-toggle";
import { JobsMap, type FitRequest, type MapCompany, type MapFocus } from "@/components/map";
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
import { AREA_CENTERS } from "@/lib/seeker-design-seed";
import { cn } from "@/lib/utils";
import { useAboveTabBar, useCoverTabBar } from "@/hooks/use-cover-tab-bar";

type Panel =
  | { kind: "none" }
  | { kind: "list" }
  | { kind: "company"; slug: string; back: Panel }
  | { kind: "job"; slug: string; back: Panel }
  | { kind: "filters"; back: Panel };

const none: Panel = { kind: "none" };

/** The searched location until the seeker picks another area. */
const LOCATION_AREA = "Shankar Nagar";

function setQueryParam(key: string, value: string | null) {
  const url = new URL(window.location.href);
  if (value) url.searchParams.set(key, value);
  else url.searchParams.delete(key);
  window.history.replaceState(null, "", url);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

export function JobsExplorer({ jobs, companies, city }: { jobs: Job[]; companies: Company[]; city: City }) {
  const [filters, setFilters] = useState<JobFilters>(defaultFilters);
  const [panelState, setPanel] = useState<Panel | null>(null);
  const [fitRequest, setFitRequest] = useState<FitRequest | null>(null);
  const [focus, setFocus] = useState<MapFocus | null>(null);
  const [locateSignal, setLocateSignal] = useState(0);
  const [areaLabel, setAreaLabel] = useState(`${LOCATION_AREA}, ${city.name}`);
  const [areaName, setAreaName] = useState(LOCATION_AREA);
  const [origin, setOrigin] = useState<[number, number]>(city.center);
  const [retried, setRetried] = useState(false);
  const [mobileSnap, setMobileSnap] = useState<SheetSnap>("peek");
  const [locationOpen, setLocationOpen] = useState(false);
  const isTablet = useMediaQuery(breakpoints.md);

  // Deep links: `?view=list`, `?company=<slug>` (shared employer links), `?job=<slug>`,
  // `?filters=open`. `?state=loading|error` previews the Jobs List loading and error
  // states until a real API is wired in.
  const companyParam = useSearchParam("company");
  const jobParam = useSearchParam("job");
  const viewParam = useSearchParam("view");
  const filtersParam = useSearchParam("filters");
  const stateParam = useSearchParam("state");
  const locationParam = useSearchParam("location");
  const queryParam = useSearchParam("q");
  const categoryParam = useSearchParam("category");
  const typeParam = useSearchParam("type");
  const modeParam = useSearchParam("mode");
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
    if (jobParam && jobs.some((item) => item.slug === jobParam)) return { kind: "job", slug: jobParam, back: list };
    if (companyParam && companies.some((item) => item.slug === companyParam))
      return { kind: "company", slug: companyParam, back: list };
    if (filtersParam === "open") return { kind: "filters", back: list };
    return list;
  };
  const panel: Panel = panelState ?? linkedPanel();
  const [seenLocation, setSeenLocation] = useState<string | null>(null);
  if (locationParam !== seenLocation) {
    setSeenLocation(locationParam);
    if (locationParam === "open") setLocationOpen(true);
  }

  const openJobs = useMemo(() => jobs.filter(isOpen), [jobs]);
  const matching = useMemo(
    () =>
      openJobs
        .filter((job) => matchesFilters(job, filters))
        .sort((a, b) => distanceKm(origin, a.company.position) - distanceKm(origin, b.company.position)),
    [openJobs, filters, origin],
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
  const status: ListStatus = !retried && (stateParam === "loading" || stateParam === "error") ? stateParam : "ready";

  const open = useCallback((next: Panel) => {
    setPanel(next);
    setMobileSnap(next.kind === "list" || next.kind === "company" ? "half" : next.kind === "none" ? "peek" : "full");
  }, []);
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
  const coversTabBar = (panel.kind === "job" || panel.kind === "filters") && mobileSnap === "full";
  const hideMapChrome = panel.kind === "job" || panel.kind === "filters" || (panelOpen && mobileSnap === "full");

  useCoverTabBar(coversTabBar);
  useAboveTabBar(panelOpen);
  const insetLeft = isTablet && panelOpen && !dockRight ? panelInset[panelWidth] : 0;
  const insetRight = isTablet && panelOpen && dockRight ? panelInset.wide : 0;

  const openJob = (job: Job) => {
    setQueryParam("company", null);
    setQueryParam("job", job.slug);
    open({ kind: "job", slug: job.slug, back: panel });
  };
  const openFilters = () => open(panel.kind === "filters" ? back(panel) : { kind: "filters", back: panel });

  const renderPanel = () => {
    switch (panel.kind) {
      case "none":
        return null;
      case "list":
        return (
          <JobsListPanel
            cityName={city.name}
            areaName={areaName}
            onSnapChange={setMobileSnap}
            status={status}
            jobs={stateParam === "empty" ? [] : matching}
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
            from={origin}
          />
        );
      case "company": {
        const company = companies.find((item) => item.slug === panel.slug);
        if (!company) return null;
        const companyJobs = openJobs.filter((job) => job.company.slug === company.slug);
        return (
          <EmployerPanel
            company={company}
            jobs={companyJobs}
            from={origin}
            cityName={city.name}
            onClose={() => open(back(panel))}
            onSelectJob={openJob}
            onSnapChange={setMobileSnap}
          />
        );
      }
      case "job": {
        const job = jobs.find((item) => item.slug === panel.slug);
        if (!job) return null;
        return <JobDetailPanel job={job} onBack={() => open(back(panel))} backLabel="Back" onSnapChange={setMobileSnap} />;
      }
      case "filters":
        return (
          <FiltersPanel
            filters={filters}
            onChange={setFilters}
            resultCount={matching.length}
            onDone={() => open(back(panel))}
            onSnapChange={setMobileSnap}
          />
        );
    }
  };

  const chooseArea = (label: string) => {
    setAreaLabel(label);
    const center = AREA_CENTERS[label as keyof typeof AREA_CENTERS];
    if (center) {
      setOrigin(center);
      setAreaName(label.split(",")[0]?.trim() || label);
      setFocus({ key: Date.now(), center, zoom: 15 });
    }
    setLocationOpen(false);
    setQueryParam("location", null);
  };
  const useCurrentLocation = () => {
    setAreaLabel("Current location");
    setAreaName("you");
    setLocateSignal((current) => current + 1);
    setLocationOpen(false);
    setQueryParam("location", null);
  };

  return (
    <>
      <TopBar
        showFinder
        query={filters.query}
        onQueryChange={(query) => setFilters((current) => ({ ...current, query }))}
        locationLabel={areaLabel}
        onLocationChange={chooseArea}
        onUseCurrentLocation={useCurrentLocation}
      />

      <main
        className={cn(
          "relative isolate flex min-h-0 flex-1 flex-col overflow-hidden",
          (!panelOpen || mobileSnap === "peek") && "max-md:[--map-inset-bottom:140px]",
          panelOpen && mobileSnap === "half" && "max-md:[--map-inset-bottom:min(480px,58%)]",
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
            onViewChange={() => {}}
            fitRequest={fitRequest}
            focus={focus}
            locateSignal={locateSignal}
            insetLeft={insetLeft}
            insetRight={insetRight}
          />
        </div>

        <div
          className={cn(
            "pointer-events-none absolute inset-x-0 top-0 z-1000 flex flex-col gap-2 px-4 pt-[max(0.75rem,env(safe-area-inset-top))] md:flex-row md:items-start md:justify-between md:gap-4 md:p-6",
            hideMapChrome && "max-md:hidden",
            panelOpen && dockRight && "md:pr-[496px]",
          )}
        >
          <div className="pointer-events-auto flex flex-col gap-2 md:hidden">
            <div className="flex items-center gap-2">
              <MobileSearchBar
                query={filters.query}
                onQueryChange={(query) => setFilters((current) => ({ ...current, query }))}
                filterCount={badgeCount}
                onOpenFilters={openFilters}
              />
              <MapAccountCluster />
            </div>
            <LocationPill label={areaLabel} expanded={locationOpen} onClick={() => setLocationOpen(true)} />
          </div>
          <div
            role="group"
            aria-label="Job categories"
            className={cn(
              "pointer-events-auto flex min-w-0 flex-1 flex-nowrap gap-2 overflow-x-auto overflow-y-hidden py-1.5 [scrollbar-width:none] *:shrink-0",
            )}
          >
            {categories.map((category) => (
              <Chip
                key={category}
                selected={filters.categories.includes(category)}
                onClick={() => setFilters((current) => ({ ...current, categories: toggleValue(current.categories, category) }))}
                className={cn(
                  !filters.categories.includes(category) && "border-transparent shadow-sm",
                )}
              >
                {category}
              </Chip>
            ))}
          </div>
          <ViewToggle
            view={panel.kind === "list" ? "list" : "map"}
            onChange={(view) => open(view === "list" ? { kind: "list" } : none)}
            className="pointer-events-auto relative z-20 shrink-0 bg-surface-default max-md:hidden"
          />
        </div>

        {!panelOpen && (
          <MapPeek
            title={`${matching.length} ${matching.length === 1 ? "job" : "jobs"} near ${areaName}`}
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
          count={badgeCount}
          expanded={panel.kind === "filters"}
          onClick={openFilters}
          className="absolute bottom-6 left-6 z-1000 max-md:hidden"
        />
        {panel.kind !== "list" && panel.kind !== "filters" && (
          <p
            data-job-count={matching.length}
            className="pointer-events-none absolute bottom-6 left-44 z-1000 hidden h-11 items-center rounded-full bg-surface-default px-4 text-body-sm-semibold text-text-primary shadow-md md:flex"
          >
            {matching.length} {matching.length === 1 ? "job" : "jobs"} near {areaName}
          </p>
        )}
      </main>
      {!isTablet && (
        <LocationSheet
          open={locationOpen}
          area={areaLabel}
          onClose={() => {
            setLocationOpen(false);
            setQueryParam("location", null);
          }}
          onChoose={chooseArea}
          onUseCurrentLocation={useCurrentLocation}
        />
      )}
    </>
  );
}
