import type { Metadata } from "next";

import { PlaceholderPage } from "@/components/placeholder-page";

export const metadata: Metadata = { title: "Saved jobs", robots: { index: false } };

export default function SavedPage() {
  return (
    <PlaceholderPage
      active="saved"
      icon="navSaved"
      title="Nothing saved yet"
      body="Save jobs you like from the map and they'll be waiting for you here."
    />
  );
}
