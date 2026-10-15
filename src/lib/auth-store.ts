"use client";

import { useSyncExternalStore } from "react";

import type { Category, EmploymentType } from "@/lib/jobs";

/**
 * Mock phone + OTP auth. Nothing leaves the browser: the "session" lives in
 * localStorage so the UI can be exercised end to end until a real provider is
 * wired in behind `sendOtp` / `verifyOtp`.
 */
export type User = {
  phone: string;
  name: string | null;
  city: string | null;
  preferredTypes: EmploymentType[];
  preferredCategories: Category[];
  resumeName: string | null;
  profileSkipped: boolean;
};

export const SAMPLE_OTP = "123456";
export const OTP_LENGTH = 6;
export const OTP_ATTEMPTS = 3;
export const RESEND_SECONDS = 30;

const STORAGE_KEY = "around-jobs:auth:v1";

let user: User | null | undefined;
const listeners = new Set<() => void>();

function read(): User | null {
  if (user !== undefined) return user;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as Partial<User>) : null;
    user = parsed?.phone
      ? { name: null, city: null, preferredTypes: [], preferredCategories: [], resumeName: null, profileSkipped: false, ...parsed, phone: parsed.phone }
      : null;
  } catch {
    user = null;
  }
  return user;
}

function write(next: User | null) {
  user = next;
  try {
    if (next) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    else window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage can be unavailable (private mode); the in-memory session still works.
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY) return;
    user = undefined;
    listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function useUser() {
  return useSyncExternalStore(subscribe, read, () => null);
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** "+91 98XXX XXX10": the Figma format, keeping the first two and last two digits. */
export const maskPhone = (digits: string) => `+91 ${digits.slice(0, 2)}XXX XXX${digits.slice(-2)}`;

export const isValidIndianMobile = (digits: string) => /^[6-9]\d{9}$/.test(digits);

export const authActions = {
  async sendOtp(phone: string) {
    await wait(600);
    return { ok: isValidIndianMobile(phone) };
  },
  async verifyOtp(phone: string, code: string) {
    await wait(800);
    if (code !== SAMPLE_OTP) return { ok: false as const };
    const existing = read();
    const next: User =
      existing?.phone === phone
        ? existing
        : { phone, name: null, city: null, preferredTypes: [], preferredCategories: [], resumeName: null, profileSkipped: false };
    write(next);
    return { ok: true as const, user: next };
  },
  updateProfile(patch: Partial<Omit<User, "phone">>) {
    const current = read();
    if (current) write({ ...current, ...patch });
  },
  logout() {
    write(null);
  },
};

export const needsProfile = (current: User | null) => current !== null && !current.name && !current.profileSkipped;
