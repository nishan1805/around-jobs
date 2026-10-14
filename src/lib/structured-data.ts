import { jobPath, type Job } from "@/lib/jobs";
import { absoluteUrl } from "@/lib/site";

// https://developers.google.com/search/docs/appearance/structured-data/job-posting
export function jobPostingJsonLd(job: Job) {
  const description = [
    `<p>${job.summary}</p>`,
    "<h3>What you'll do</h3>",
    `<ul>${job.responsibilities.map((item) => `<li>${item}</li>`).join("")}</ul>`,
    "<h3>What we're looking for</h3>",
    `<ul>${job.requirements.map((item) => `<li>${item}</li>`).join("")}</ul>`,
  ].join("");

  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description,
    identifier: { "@type": "PropertyValue", name: job.company.name, value: job.slug },
    url: absoluteUrl(jobPath(job)),
    datePosted: job.datePosted,
    validThrough: `${job.validThrough}T23:59:59+05:30`,
    employmentType: job.employmentType,
    industry: job.category,
    directApply: true,
    hiringOrganization: { "@type": "Organization", name: job.company.name },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        streetAddress: `${job.company.streetAddress}, ${job.company.area}`,
        addressLocality: job.city.name,
        addressRegion: job.city.region,
        postalCode: job.company.postalCode,
        addressCountry: job.city.country,
      },
      geo: { "@type": "GeoCoordinates", latitude: job.company.position[0], longitude: job.company.position[1] },
    },
    baseSalary: {
      "@type": "MonetaryAmount",
      currency: job.salary.currency,
      value: {
        "@type": "QuantitativeValue",
        minValue: job.salary.min,
        maxValue: job.salary.max,
        unitText: job.salary.unit,
      },
    },
  };
}

export const serializeJsonLd = (data: unknown) => JSON.stringify(data).replace(/</g, "\\u003c");
