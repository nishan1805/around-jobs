import type { Metadata } from "next";

import { PlaceholderPage } from "@/components/placeholder-page";

export const metadata: Metadata = { title: "Job alerts", robots: { index: false } };

export default function AlertsPage() {
  return (
    <PlaceholderPage
      icon="bell"
      title="Job alerts"
      body="You don't have any job alerts yet."
    />
  );
}
