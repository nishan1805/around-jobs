import type { Metadata } from "next";

import { ApplicationsView } from "@/components/applications/applications-view";

export const metadata: Metadata = { title: "My applications", robots: { index: false } };

export default function ApplicationsPage() {
  return <ApplicationsView />;
}
