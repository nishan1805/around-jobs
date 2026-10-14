import Link from "next/link";

import { Icon } from "@/components/icon";
import { employmentTypes, formatDate, formatSalary, jobPath, type Job } from "@/lib/jobs";
import { cn } from "@/lib/utils";

export function CategoryTag({ children }: { children: string }) {
  return (
    <span className="rounded-full bg-primary-50 px-2 py-0.5 text-label-medium text-brand-primary">{children}</span>
  );
}

export function JobCard({ job, showCompany = true, className }: { job: Job; showCompany?: boolean; className?: string }) {
  return (
    <Link
      href={jobPath(job)}
      className={cn(
        "group flex flex-col gap-3 rounded-lg border bg-surface-default p-4 transition-shadow hover:shadow-md focus-visible:outline-2",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <CategoryTag>{job.category}</CategoryTag>
        <span className="text-label-medium text-text-tertiary">{employmentTypes[job.employmentType]}</span>
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="text-body-semibold text-text-primary group-hover:text-brand-primary">{job.title}</h3>
        {showCompany && <p className="text-body-sm-medium text-text-secondary">{job.company.name}</p>}
        <p className="flex items-center gap-1 text-label-regular text-text-tertiary">
          <Icon name="pin" className="size-3.5" />
          {job.company.area}, {job.city.name}
        </p>
      </div>
      <div className="mt-auto flex items-end justify-between gap-2 border-t pt-3">
        <span className="text-body-sm-semibold text-text-primary">{formatSalary(job.salary)}</span>
        <span className="text-label-regular text-text-tertiary">{formatDate(job.datePosted)}</span>
      </div>
    </Link>
  );
}
