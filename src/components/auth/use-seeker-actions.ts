"use client";

import { seekerActions } from "@/lib/seeker-store";

import { useAuth } from "./auth-provider";

/** Seeker actions that ask the user to log in first (and then finish the action). */
export function useSeekerActions() {
  const { requireAuth } = useAuth();
  return {
    setSavedJob: (slug: string, saved: boolean) =>
      requireAuth(() => seekerActions.setSavedJob(slug, saved), "Log in to save jobs and find them later."),
    setSavedEmployer: (slug: string, saved: boolean) =>
      requireAuth(() => seekerActions.setSavedEmployer(slug, saved), "Log in to save employers and hear about new jobs."),
    apply: (slug: string) =>
      requireAuth(() => seekerActions.apply(slug), "Log in with your mobile number to apply. It takes a minute."),
  };
}
