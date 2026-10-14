import type { Metadata } from "next";

import { PlaceholderPage } from "@/components/placeholder-page";

export const metadata: Metadata = { title: "My applications", robots: { index: false } };

export default function ApplicationsPage() {
  return (
    <PlaceholderPage
      active="applications"
      icon="navApplications"
      title="No applications yet"
      body="When you apply to a job, you'll be able to track its status here."
    />
  );
}
