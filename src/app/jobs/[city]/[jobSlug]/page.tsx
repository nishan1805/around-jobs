import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AppShell, Wordmark } from "@/components/app-shell";
import { Icon } from "@/components/icon";
import { JobCard, VerifiedBadge } from "@/components/jobs/job-card";
import { Badge } from "@/components/ui/badge";
import { LocationMap } from "@/components/map";
import { buttonVariants } from "@/components/ui/button";
import {
  employmentTypes,
  experienceLabel,
  formatDate,
  formatSalary,
  isOpen,
  workModes,
  getAllJobs,
  getJob,
  jobPath,
  jobs as allJobs,
  type Job,
} from "@/lib/jobs";
import { jobPostingJsonLd, serializeJsonLd } from "@/lib/structured-data";
import { cn } from "@/lib/utils";

export async function generateStaticParams() {
  const jobs = await getAllJobs();
  return jobs.map((job) => ({ city: job.city.slug, jobSlug: job.slug }));
}

export async function generateMetadata({ params }: PageProps<"/jobs/[city]/[jobSlug]">): Promise<Metadata> {
  const { city, jobSlug } = await params;
  const job = await getJob(city, jobSlug);
  if (!job) return {};
  const title = `${job.title} at ${job.company.name}, ${job.company.area}`;
  const pay = job.salaryDisclosed ? formatSalary(job.salary) : "Salary not disclosed";
  const description = `${employmentTypes[job.employmentType]} · ${pay}. ${job.summary}`;
  return {
    title,
    description,
    alternates: { canonical: jobPath(job) },
    openGraph: { type: "website", title, description, url: jobPath(job), siteName: "around jobs" },
  };
}

const applyHref = (job: Job) =>
  `mailto:jobs@${job.company.slug}.example?subject=${encodeURIComponent(`Application: ${job.title}`)}`;

export default async function JobPage({ params }: PageProps<"/jobs/[city]/[jobSlug]">) {
  const { city, jobSlug } = await params;
  const job = await getJob(city, jobSlug);
  if (!job) notFound();

  const companyJobs = allJobs.filter((other) => other.company.slug === job.company.slug);
  const moreAtCompany = companyJobs.filter((other) => other.slug !== job.slug && isOpen(other));
  const pay = job.salaryDisclosed ? formatSalary(job.salary) : "Salary not disclosed";
  const canApply = isOpen(job);

  const facts = [
    { label: "Job type", value: employmentTypes[job.employmentType] },
    { label: "Work mode", value: workModes[job.workMode] },
    { label: "Experience", value: experienceLabel(job.experience) },
    { label: "Category", value: job.category },
    { label: "Posted", value: formatDate(job.datePosted) },
    { label: "Apply by", value: formatDate(job.validThrough) },
  ];

  return (
    <AppShell active="jobs">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jobPostingJsonLd(job)) }} />

      <header className="flex h-16 shrink-0 items-center gap-3 border-b bg-background-primary px-4 md:h-18 md:px-6">
        <Wordmark className="md:hidden" />
        <Link
          href="/"
          className="ml-auto flex items-center gap-1.5 rounded-full px-3 py-2 text-body-sm-semibold text-text-primary hover:bg-grey-100 md:ml-0 md:-translate-x-3"
        >
          <Icon name="chevronDown" className="size-4 rotate-90" />
          All jobs on the map
        </Link>
      </header>

      <main className="min-h-0 flex-1 overflow-y-auto bg-background-secondary">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-5 md:gap-6 md:px-6 md:py-8 lg:py-12">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-1.5 text-label-medium text-text-tertiary">
              <li>
                <Link href="/" className="hover:text-brand-primary">
                  Jobs
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>{job.city.name}</li>
              <li aria-hidden>/</li>
              <li aria-current="page" className="text-text-secondary">
                {job.title}
              </li>
            </ol>
          </nav>

          <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_18rem] md:gap-6 lg:grid-cols-[minmax(0,1fr)_24rem] lg:gap-8">
            <article className="flex flex-col gap-8 rounded-xl border bg-surface-default p-5 md:p-8">
              <header className="flex flex-col gap-3">
                <div className="flex flex-wrap items-center gap-1.5">
                  <Badge type="employment">{employmentTypes[job.employmentType]}</Badge>
                  <Badge type="mode">{workModes[job.workMode]}</Badge>
                  <Badge type="experience">{experienceLabel(job.experience)}</Badge>
                  {job.status === "expired" && <Badge type="expired">Expired</Badge>}
                  {job.status === "closed" && <Badge type="closed">Closed</Badge>}
                </div>
                <h1 className="text-heading-semibold text-text-primary md:text-display-small-semibold">{job.title}</h1>
                <p className="flex flex-wrap items-center gap-2 text-subheading-medium text-text-secondary">
                  {job.company.name}
                  <VerifiedBadge verified={job.company.verified} />
                </p>
                <p className="flex items-center gap-1.5 text-body-sm-regular text-text-tertiary">
                  <Icon name="pin" className="size-4 text-brand-primary" />
                  {job.company.streetAddress}, {job.company.area}, {job.city.name}
                </p>
              </header>

              <p className="text-body-regular text-text-secondary">{job.summary}</p>

              <Section title="What you'll do" items={job.responsibilities} />
              <Section title="What we're looking for" items={job.requirements} />

              <section className="flex flex-col gap-3">
                <h2 className="text-heading-semibold text-text-primary">Where you&apos;ll work</h2>
                <div className="isolate h-56 overflow-hidden rounded-lg border md:h-72">
                  <LocationMap
                    position={job.company.position}
                    name={job.company.name}
                    jobCount={companyJobs.length}
                  />
                </div>
                <p className="text-body-sm-regular text-text-secondary">
                  {job.company.streetAddress}, {job.company.area}, {job.city.name}, {job.city.region}{" "}
                  {job.company.postalCode}
                </p>
              </section>
            </article>

            <aside className="flex flex-col gap-4 md:sticky md:top-0 md:self-start">
              <div className="flex flex-col gap-5 rounded-xl border bg-surface-default p-5">
                <div className="flex flex-col gap-1">
                  <span className="text-label-medium text-text-tertiary">Salary</span>
                  <span className="text-heading-semibold text-text-primary">{pay}</span>
                </div>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
                  {facts.map((fact) => (
                    <div key={fact.label} className="flex flex-col gap-0.5">
                      <dt className="text-label-medium text-text-tertiary">{fact.label}</dt>
                      <dd className="text-body-sm-medium text-text-primary">{fact.value}</dd>
                    </div>
                  ))}
                </dl>
                {canApply ? (
                  <a href={applyHref(job)} className={cn(buttonVariants({ size: "lg" }), "hidden w-full md:inline-flex")}>
                    Apply now
                  </a>
                ) : (
                  <p className="hidden rounded-sm bg-grey-100 px-4 py-3 text-center text-body-sm-semibold text-text-disabled md:block">
                    {job.status === "expired" ? "Applications closed" : "Position closed"}
                  </p>
                )}
              </div>

              {moreAtCompany.length > 0 && (
                <div className="flex flex-col gap-3">
                  <h2 className="text-body-sm-semibold text-text-primary">More jobs at {job.company.name}</h2>
                  {moreAtCompany.map((other) => (
                    <JobCard key={other.slug} job={other} from={job.city.center} />
                  ))}
                </div>
              )}
            </aside>
          </div>
        </div>
      </main>

      <div className="flex shrink-0 items-center justify-between gap-3 border-t bg-surface-default px-4 py-3 md:hidden">
        <div className="flex min-w-0 flex-col">
          <span className="text-label-medium text-text-tertiary">Salary</span>
          <span className="truncate text-body-sm-semibold text-text-primary">{pay}</span>
        </div>
        {canApply ? (
          <a href={applyHref(job)} className={buttonVariants()}>
            Apply now
          </a>
        ) : (
          <span className="text-body-sm-semibold text-text-disabled">
            {job.status === "expired" ? "Applications closed" : "Position closed"}
          </span>
        )}
      </div>
    </AppShell>
  );
}

function Section({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-heading-semibold text-text-primary">{title}</h2>
      <ul className="flex flex-col gap-2">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-body-regular text-text-secondary">
            <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-brand-primary" />
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
