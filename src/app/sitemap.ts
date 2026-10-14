import type { MetadataRoute } from "next";

import { getAllJobs, jobPath } from "@/lib/jobs";
import { absoluteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const jobs = await getAllJobs();
  const latest = jobs.map((job) => job.datePosted).sort().at(-1);

  return [
    { url: absoluteUrl("/"), lastModified: latest, changeFrequency: "daily", priority: 1 },
    ...jobs.map((job) => ({
      url: absoluteUrl(jobPath(job)),
      lastModified: job.datePosted,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
