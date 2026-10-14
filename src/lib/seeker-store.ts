"use client";

import { useSyncExternalStore } from "react";

import { useUser } from "@/lib/auth-store";
import { SAMPLE_TODAY } from "@/lib/jobs";

/** Steps shown on the My applications progress stepper, in order. */
export const applicationStages = ["applied", "viewed", "shortlisted", "interview"] as const;
export type ApplicationStage = (typeof applicationStages)[number] | "rejected";

export type ApplicationEvent = { stage: ApplicationStage; on: string; time?: string };

export type Application = {
  jobSlug: string;
  appliedOn: string;
  stage: ApplicationStage;
  /** Newest first. */
  history: ApplicationEvent[];
  interviewOn?: string;
  /** Seeded demo data, labelled "(Sample)" in the UI. */
  sample?: boolean;
};

export type SeekerState = {
  /** Newest first. */
  savedJobs: string[];
  savedOn: Record<string, string>;
  savedEmployers: string[];
  applications: Application[];
};

const STORAGE_KEY = "around-jobs:seeker:v2";

/** Sample data matching the My applications and Saved screens in Figma. */
const sampleState: SeekerState = {
  savedJobs: [
    "barista-urban-bites-cafe",
    "retail-sales-associate-magneto-retail",
    "wellness-centre-receptionist-patanjali-wellness",
    "stock-associate-shree-shyam-mart",
    "waiter-waitress-nds-cafe",
    "billing-executive-shree-shyam-mart",
  ],
  savedOn: {
    "barista-urban-bites-cafe": "2026-10-06",
    "retail-sales-associate-magneto-retail": "2026-10-05",
    "wellness-centre-receptionist-patanjali-wellness": "2026-10-13",
    "stock-associate-shree-shyam-mart": "2026-10-02",
    "waiter-waitress-nds-cafe": "2026-10-12",
    "billing-executive-shree-shyam-mart": "2026-10-04",
  },
  savedEmployers: [],
  applications: [
    {
      jobSlug: "barista-urban-bites-cafe",
      appliedOn: "2026-10-11",
      stage: "shortlisted",
      history: [
        { stage: "shortlisted", on: "2026-10-14", time: "10:30 AM" },
        { stage: "viewed", on: "2026-10-13" },
        { stage: "applied", on: "2026-10-11" },
      ],
      sample: true,
    },
    {
      jobSlug: "customer-service-associate-shree-shyam-mart",
      appliedOn: "2026-10-09",
      stage: "viewed",
      history: [
        { stage: "viewed", on: "2026-10-12", time: "4:15 PM" },
        { stage: "applied", on: "2026-10-09" },
      ],
      sample: true,
    },
    {
      jobSlug: "front-office-executive-ghatarani-resort",
      appliedOn: "2026-10-07",
      stage: "interview",
      interviewOn: "2026-10-17",
      history: [
        { stage: "interview", on: "2026-10-13", time: "11:00 AM" },
        { stage: "shortlisted", on: "2026-10-10" },
        { stage: "viewed", on: "2026-10-08" },
        { stage: "applied", on: "2026-10-07" },
      ],
      sample: true,
    },
    {
      jobSlug: "cashier-magneto-retail",
      appliedOn: "2026-10-14",
      stage: "applied",
      history: [{ stage: "applied", on: "2026-10-14", time: "9:05 AM" }],
      sample: true,
    },
  ],
};

const emptyState: SeekerState = { savedJobs: [], savedOn: {}, savedEmployers: [], applications: [] };

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
  present ? (list.includes(value) ? list : [value, ...list]) : list.filter((item) => item !== value);

export const seekerActions = {
  setSavedJob(slug: string, saved: boolean) {
    const current = read();
    const savedOn = { ...current.savedOn };
    if (saved) savedOn[slug] ??= SAMPLE_TODAY;
    else delete savedOn[slug];
    write({ ...current, savedJobs: setIn(current.savedJobs, slug, saved), savedOn });
  },
  setSavedEmployer(slug: string, saved: boolean) {
    const current = read();
    write({ ...current, savedEmployers: setIn(current.savedEmployers, slug, saved) });
  },
  apply(jobSlug: string) {
    const current = read();
    if (current.applications.some((item) => item.jobSlug === jobSlug)) return;
    const application: Application = {
      jobSlug,
      appliedOn: SAMPLE_TODAY,
      stage: "applied",
      history: [{ stage: "applied", on: SAMPLE_TODAY }],
    };
    write({ ...current, applications: [application, ...current.applications] });
  },
  withdraw(jobSlug: string) {
    const current = read();
    write({ ...current, applications: current.applications.filter((item) => item.jobSlug !== jobSlug) });
  },
};

export const applicationFor = (seeker: SeekerState, jobSlug: string) =>
  seeker.applications.find((item) => item.jobSlug === jobSlug) ?? null;
