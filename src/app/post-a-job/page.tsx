import type { Metadata } from "next";

import { PlaceholderPage } from "@/components/placeholder-page";

export const metadata: Metadata = { title: "Post a job" };

export default function PostAJobPage() {
  return (
    <PlaceholderPage
      icon="briefcase"
      title="Hiring in Raipur?"
      body="Job posting for local businesses is coming soon. Until then, browse what's already open nearby."
    />
  );
}
