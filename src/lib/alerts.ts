"use client";

import { useSyncExternalStore } from "react";

import { useUser } from "@/lib/auth-store";

const STORAGE_KEY = "around-jobs:alerts-read:v1";

let read = false;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded) return;
  loaded = true;
  try {
    read = window.localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    read = false;
  }
}

function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function markAlertsRead() {
  load();
  read = true;
  try {
    window.localStorage.setItem(STORAGE_KEY, "1");
  } catch {
    // Keep the in-memory flag when storage is blocked.
  }
  emit();
}

/** Logged-out visitors have no inbox. Logged-in seekers start with one unread alert. */
export function useUnreadCount() {
  const user = useUser();
  const seen = useSyncExternalStore(
    subscribe,
    () => {
      load();
      return read;
    },
    () => true,
  );
  return user && !seen ? 1 : 0;
}
