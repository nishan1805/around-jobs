"use client";

import { useSyncExternalStore } from "react";

import { useUser } from "@/lib/auth-store";
import { SAMPLE_TODAY } from "@/lib/jobs";

/** Steps shown on the My applications progress stepper, in order. */
export const applicationStages = ["applied", "viewed", "shortlisted", "interview"] as const;
export type ApplicationStage = (typeof applicationStages)[number] | "rejected" | "withdrawn";

/** What the seeker sent with an application (Apply flow, M08–M12). */
export type Submission = {
  name: string;
  phone: string;
  email: string;
  location: string;
  latestTitle: string;
  latestCompany: string;
  experience: string;
  education: string;
  skills: string[];
  resumeName: string | null;
  resumeKb: number | null;
  coverNote: string;
};

export type ApplicationEvent = { stage: ApplicationStage; on: string; time?: string };

export type Application = {
  jobSlug: string;
  appliedOn: string;
  stage: ApplicationStage;
  /** Newest first. */
  history: ApplicationEvent[];
  interviewOn?: string;
  submission?: Submission;
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

const sampleSubmission: Submission = {
  name: "Aarti Sahu",
  phone: "",
  email: "aarti.sahu@email.com",
  location: "Pandri, Raipur",
  latestTitle: "Sales Assistant",
  latestCompany: "City Bazaar, Raipur",
  experience: "2 years",
  education: "Class 12",
  skills: ["Billing", "Customer service"],
  resumeName: "Resume_Nishan_Kumar_Mondal.pdf",
  resumeKb: 240,
  coverNote: "",
};

/** Sample data matching the My applications and Saved screens in Figma. */
const sampleState: SeekerState = {
  savedJobs: [
    "site-supervisor-raipur-builder",
    "barista-urban-bites-cafe",
    "retail-sales-associate-magneto-retail",
    "cashier-magneto-retail",
    "wellness-centre-receptionist-patanjali-wellness",
    "stock-associate-shree-shyam-mart",
    "waiter-waitress-nds-cafe",
  ],
  savedOn: {
    "site-supervisor-raipur-builder": "2026-10-13",
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
      submission: sampleSubmission,
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
      submission: sampleSubmission,
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
      submission: sampleSubmission,
      sample: true,
    },
    {
      jobSlug: "cashier-magneto-retail",
      appliedOn: "2026-10-14",
      stage: "applied",
      history: [{ stage: "applied", on: "2026-10-14", time: "9:05 AM" }],
      submission: sampleSubmission,
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

let lastWithdrawn: string | null = null;

/** The job slug just withdrawn, for the success banner on My applications (M18). */
export const withdrawnNotice = {
  peek: () => lastWithdrawn,
  clear: () => {
    lastWithdrawn = null;
  },
};

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
  /** Re-applying after a withdrawal replaces the old application. */
  apply(jobSlug: string, submission?: Submission) {
    const current = read();
    const existing = current.applications.find((item) => item.jobSlug === jobSlug);
    if (existing && existing.stage !== "withdrawn") return;
    const application: Application = {
      jobSlug,
      appliedOn: SAMPLE_TODAY,
      stage: "applied",
      history: [{ stage: "applied", on: SAMPLE_TODAY }],
      submission,
    };
    const others = current.applications.filter((item) => item.jobSlug !== jobSlug);
    write({ ...current, applications: [application, ...others] });
  },
  withdraw(jobSlug: string) {
    const current = read();
    lastWithdrawn = jobSlug;
    write({
      ...current,
      applications: current.applications.map((item) =>
        item.jobSlug === jobSlug
          ? { ...item, stage: "withdrawn", history: [{ stage: "withdrawn", on: SAMPLE_TODAY }, ...item.history] }
          : item,
      ),
    });
  },
};

export const applicationFor = (seeker: SeekerState, jobSlug: string) =>
  seeker.applications.find((item) => item.jobSlug === jobSlug) ?? null;

/** An application that still counts: withdrawn ones let the seeker apply again. */
export const activeApplicationFor = (seeker: SeekerState, jobSlug: string) => {
  const application = applicationFor(seeker, jobSlug);
  return application && application.stage !== "withdrawn" ? application : null;
};
