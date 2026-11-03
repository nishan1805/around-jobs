import type { Metadata } from "next";

import { StatesView } from "@/components/jobs/states-view";

export const metadata: Metadata = { title: "Component states", robots: { index: false } };

export default function StatesPage() {
  return <StatesView />;
}
