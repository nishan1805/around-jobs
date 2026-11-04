"use client";

import { useSyncExternalStore } from "react";

export type SavedProfilePhoto = { url: string; name: string };

let photo: SavedProfilePhoto | null = null;
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export const profilePhotoActions = {
  set(next: SavedProfilePhoto | null) {
    photo = next;
    listeners.forEach((listener) => listener());
  },
};

export function useProfilePhoto() {
  return useSyncExternalStore(subscribe, () => photo, () => null);
}
