import {
  daysSince,
  employmentTypes,
  experienceBuckets,
  matchesExperience,
  workModes,
  type Category,
  type EmploymentType,
  type ExperienceBucket,
  type Job,
  type WorkMode,
} from "@/lib/jobs";

export const SALARY_BOUNDS = { min: 0, max: 60_000, step: 1_000 } as const;

export const morePresets = {
  posted24h: "Posted in 24h",
  posted7d: "Last 7 days",
  verifiedOnly: "Verified employers only",
  salaryDisclosed: "Salary disclosed",
} as const;

export type MorePreset = keyof typeof morePresets;

export type JobFilters = {
  query: string;
  categories: Category[];
  experience: ExperienceBucket[];
  types: EmploymentType[];
  workModes: WorkMode[];
  salary: [number, number];
  more: MorePreset[];
};

export const defaultFilters: JobFilters = {
  query: "",
  categories: ["Retail"],
  experience: [],
  types: [],
  workModes: [],
  salary: [SALARY_BOUNDS.min, SALARY_BOUNDS.max],
  more: [],
};

export const toggleValue = <T>(list: T[], value: T) =>
  list.includes(value) ? list.filter((item) => item !== value) : [...list, value];

const matchesQuery = (job: Job, query: string) => {
  if (!query) return true;
  const haystack = `${job.title} ${job.company.name} ${job.company.area} ${job.category}`.toLowerCase();
  return query
    .toLowerCase()
    .split(/\s+/)
    .every((term) => haystack.includes(term));
};

const salaryIsFiltered = (filters: JobFilters) =>
  filters.salary[0] !== SALARY_BOUNDS.min || filters.salary[1] !== SALARY_BOUNDS.max;

export function matchesFilters(job: Job, filters: JobFilters) {
  const { more } = filters;
  return (
    matchesQuery(job, filters.query.trim()) &&
    (filters.categories.length === 0 || filters.categories.includes(job.category)) &&
    (filters.experience.length === 0 || filters.experience.some((bucket) => matchesExperience(job, bucket))) &&
    (filters.types.length === 0 || filters.types.includes(job.employmentType)) &&
    (filters.workModes.length === 0 || filters.workModes.includes(job.workMode)) &&
    (!salaryIsFiltered(filters) ||
      !job.salaryDisclosed ||
      (job.salary.max >= filters.salary[0] && job.salary.min <= filters.salary[1])) &&
    (!more.includes("posted24h") || daysSince(job.datePosted) <= 1) &&
    (!more.includes("posted7d") || daysSince(job.datePosted) <= 7) &&
    (!more.includes("verifiedOnly") || job.company.verified) &&
    (!more.includes("salaryDisclosed") || job.salaryDisclosed)
  );
}

export type ActiveFilter = { key: string; label: string; remove: (filters: JobFilters) => JobFilters };

/**
 * The removable chips under the Jobs List header. Categories stay out of this
 * list because they already show as selected chips in the row above.
 */
export function activeFilters(filters: JobFilters): ActiveFilter[] {
  const chips: ActiveFilter[] = [
    ...filters.experience.map((value) => ({
      key: `exp-${value}`,
      label: experienceBuckets[value].label,
      remove: (f: JobFilters) => ({ ...f, experience: f.experience.filter((item) => item !== value) }),
    })),
    ...filters.types.map((value) => ({
      key: `type-${value}`,
      label: employmentTypes[value],
      remove: (f: JobFilters) => ({ ...f, types: f.types.filter((item) => item !== value) }),
    })),
    ...filters.workModes.map((value) => ({
      key: `mode-${value}`,
      label: workModes[value],
      remove: (f: JobFilters) => ({ ...f, workModes: f.workModes.filter((item) => item !== value) }),
    })),
    ...filters.more.map((value) => ({
      key: `more-${value}`,
      label: morePresets[value],
      remove: (f: JobFilters) => ({ ...f, more: f.more.filter((item) => item !== value) }),
    })),
  ];
  if (salaryIsFiltered(filters)) {
    chips.push({
      key: "salary",
      label: `₹${filters.salary[0] / 1000}k–${filters.salary[1] / 1000}k`,
      remove: (f) => ({ ...f, salary: defaultFilters.salary }),
    });
  }
  return chips;
}

/**
 * Number on the Filters control. Figma S05 selects Retail, Fresher, Full-time,
 * a salary range and On-site, and the button still reads Filters 2. The badge
 * counts employment type, work mode and the "more" presets. Category, experience
 * and salary stay out of it.
 */
export function filterBadgeCount(filters: JobFilters) {
  return filters.types.length + filters.workModes.length + filters.more.length;
}

/** `Retail · Full-time · On-site`, used in "6 results for …". */
export function describeFilters(filters: JobFilters) {
  const parts = [
    filters.query.trim(),
    ...filters.categories,
    ...activeFilters(filters).map((chip) => chip.label),
  ].filter(Boolean);
  return parts.join(" · ");
}
