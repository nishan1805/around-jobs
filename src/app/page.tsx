import { AppShell } from "@/components/app-shell";
import { JobsExplorer } from "@/components/jobs/jobs-explorer";
import { cities, companies, getAllJobs } from "@/lib/jobs";

export default async function HomePage() {
  const jobs = await getAllJobs();
  return (
    <AppShell active="jobs">
      <JobsExplorer jobs={jobs} companies={companies} city={cities[0]} />
    </AppShell>
  );
}
