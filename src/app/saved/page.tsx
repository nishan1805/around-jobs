import type { Metadata } from "next";

import { SavedView } from "@/components/saved/saved-view";

export const metadata: Metadata = { title: "Saved jobs", robots: { index: false } };

export default function SavedPage() {
  return <SavedView />;
}
