import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ApplicationDetail } from "@/components/applications/application-detail";
import { getAllJobs, getJobBySlug } from "@/lib/jobs";

/** Every slug is prerendered, so the page blocks on its params instead of streaming a shell. */
export const instant = false;

export async function generateStaticParams() {
  const jobs = await getAllJobs();
  return jobs.map((job) => ({ jobSlug: job.slug }));
}

export async function generateMetadata({ params }: PageProps<"/applications/[jobSlug]">): Promise<Metadata> {
  const job = await getJobBySlug((await params).jobSlug);
  return { title: job ? `Application: ${job.title}` : "Application", robots: { index: false } };
}

export default async function ApplicationPage({ params }: PageProps<"/applications/[jobSlug]">) {
  const job = await getJobBySlug((await params).jobSlug);
  if (!job) notFound();
  return <ApplicationDetail job={job} />;
}
