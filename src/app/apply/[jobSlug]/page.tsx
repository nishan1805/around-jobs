import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ApplyFlow } from "@/components/apply/apply-flow";
import { getAllJobs, getJobBySlug } from "@/lib/jobs";

/** Every slug is prerendered, so the page blocks on its params instead of streaming a shell. */
export const instant = false;

export async function generateStaticParams() {
  const jobs = await getAllJobs();
  return jobs.map((job) => ({ jobSlug: job.slug }));
}

export async function generateMetadata({ params }: PageProps<"/apply/[jobSlug]">): Promise<Metadata> {
  const job = await getJobBySlug((await params).jobSlug);
  return { title: job ? `Apply: ${job.title} at ${job.company.name}` : "Apply", robots: { index: false } };
}

export default async function ApplyPage({ params }: PageProps<"/apply/[jobSlug]">) {
  const job = await getJobBySlug((await params).jobSlug);
  if (!job) notFound();
  return <ApplyFlow job={job} />;
}
