"use client";

import { useSyncExternalStore } from "react";

import { useUser } from "@/lib/auth-store";
import { SAMPLE_TODAY } from "@/lib/jobs";

export const applicationStages = ["applied", "viewed", "shortlisted", "interview", "hired"] as const;
export type ApplicationStage = (typeof applicationStages)[number] | "rejected";

export type Application = { jobSlug: string; appliedOn: string; stage: ApplicationStage };

export type SeekerState = {
  savedJobs: string[];
  savedEmployers: string[];
  applications: Application[];
};

const STORAGE_KEY = "around-jobs:seeker:v1";

/** Sample applications so the Applied badges and My applications page have something to show. */
const sampleState: SeekerState = {
  savedJobs: ["barista-urban-bites-cafe", "junior-frontend-developer-raipur-tech-hub"],
  savedEmployers: [],
  applications: [
    { jobSlug: "retail-sales-associate-magneto-retail", appliedOn: "2026-10-12", stage: "viewed" },
    { jobSlug: "qa-tester-raipur-tech-hub", appliedOn: "2026-10-08", stage: "applied" },
    { jobSlug: "night-shift-pharmacist-lakeside-pharmacy", appliedOn: "2026-10-03", stage: "rejected" },
  ],
};

const emptyState: SeekerState = { savedJobs: [], savedEmployers: [], applications: [] };

let state: SeekerState | null = null;
const listeners = new Set<() => void>();

function read(): SeekerState {
  if (state) return state;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    state = raw ? { ...emptyState, ...(JSON.parse(raw) as SeekerState) } : sampleState;
  } catch {
    state = sampleState;
  }
  return state;
}

function write(next: SeekerState) {
  state = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Private mode or quota errors: keep the in-memory copy for this session.
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY) return;
    state = null;
    listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

/** Saved items and applications belong to the logged-in (mock) user; logged out there are none. */
export function useSeeker() {
  const user = useUser();
  const seeker = useSyncExternalStore(subscribe, read, () => emptyState);
  return user ? seeker : emptyState;
}

const setIn = (list: string[], value: string, present: boolean) =>
  present ? (list.includes(value) ? list : [...list, value]) : list.filter((item) => item !== value);

export const seekerActions = {
  setSavedJob(slug: string, saved: boolean) {
    const current = read();
    write({ ...current, savedJobs: setIn(current.savedJobs, slug, saved) });
  },
  setSavedEmployer(slug: string, saved: boolean) {
    const current = read();
    write({ ...current, savedEmployers: setIn(current.savedEmployers, slug, saved) });
  },
  apply(jobSlug: string) {
    const current = read();
    if (current.applications.some((item) => item.jobSlug === jobSlug)) return;
    write({
      ...current,
      applications: [{ jobSlug, appliedOn: SAMPLE_TODAY, stage: "applied" }, ...current.applications],
    });
  },
  withdraw(jobSlug: string) {
    const current = read();
    write({ ...current, applications: current.applications.filter((item) => item.jobSlug !== jobSlug) });
  },
};

export const applicationFor = (seeker: SeekerState, jobSlug: string) =>
  seeker.applications.find((item) => item.jobSlug === jobSlug) ?? null;
