export const categories = [
  "Retail",
  "Hospitality",
  "Sales",
  "Healthcare support",
  "Office admin",
  "Technology",
] as const;

export type Category = (typeof categories)[number];

/** Keys are schema.org JobPosting `employmentType` values. */
export const employmentTypes = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  CONTRACTOR: "Contract",
  INTERN: "Internship",
} as const;

export type EmploymentType = keyof typeof employmentTypes;

export const workModes = {
  ON_SITE: "On-site",
  HYBRID: "Hybrid",
  REMOTE: "Remote",
} as const;

export type WorkMode = keyof typeof workModes;

/** Filter buckets from the Figma Filters panel; a job matches when its range overlaps the bucket. */
export const experienceBuckets = {
  FRESHER: { label: "Fresher", min: 0, max: 0 },
  "1_3": { label: "1–3 yrs", min: 1, max: 3 },
  "3_5": { label: "3–5 yrs", min: 3, max: 5 },
  "5_PLUS": { label: "5+ yrs", min: 5, max: 99 },
} as const;

export type ExperienceBucket = keyof typeof experienceBuckets;

export type JobStatus = "open" | "expired" | "closed";

/** All relative dates in the sample data ("Posted 2d ago") are measured from this day. */
export const SAMPLE_TODAY = "2026-10-14";

export type City = {
  slug: string;
  name: string;
  region: string;
  country: string;
  center: [number, number];
};

export type Company = {
  slug: string;
  name: string;
  category: Category;
  area: string;
  streetAddress: string;
  postalCode: string;
  position: [number, number];
  citySlug: string;
  verified: boolean;
  /** Number of placeholder photos in the gallery header. */
  photoCount: number;
};

export type Job = {
  slug: string;
  title: string;
  category: Category;
  employmentType: EmploymentType;
  workMode: WorkMode;
  experience: { min: number; max: number };
  salary: { min: number; max: number; currency: "INR"; unit: "MONTH" };
  salaryDisclosed: boolean;
  datePosted: string;
  validThrough: string;
  status: JobStatus;
  applicants: number;
  summary: string;
  responsibilities: string[];
  requirements: string[];
  skills: string[];
  skillNotes: string[];
  education: string;
  benefits: string[];
  company: Company;
  city: City;
};

export const cities: City[] = [
  {
    slug: "raipur",
    name: "Raipur",
    region: "Chhattisgarh",
    country: "IN",
    center: [21.2465, 81.6505],
  },
];

type JobOptions = {
  experience?: [number, number];
  mode?: WorkMode;
  salaryHidden?: boolean;
  status?: Exclude<JobStatus, "open">;
};

type JobSeed = [title: string, type: EmploymentType, min: number, max: number, options?: JobOptions];

type CompanySeed = Omit<Company, "citySlug" | "verified" | "photoCount"> & {
  verified?: boolean;
  jobs: JobSeed[];
};

const companySeeds: CompanySeed[] = [
  {
    slug: "magneto-retail",
    name: "Magneto Retail (Sample)",
    category: "Retail",
    area: "Sector 3, Pachpedi Naka",
    streetAddress: "GE Road, Sector 3",
    postalCode: "492001",
    position: [21.2607, 81.603],
    jobs: [
      ["Retail Sales Associate", "FULL_TIME", 14000, 18000],
      ["Cashier", "FULL_TIME", 13000, 16000],
      ["Visual Merchandiser", "FULL_TIME", 18000, 24000, { experience: [1, 3], salaryHidden: true }],
      ["Store Inventory Executive", "FULL_TIME", 15000, 19000],
    ],
  },
  {
    slug: "urban-bites-cafe",
    name: "Urban Bites Café (Sample)",
    category: "Hospitality",
    area: "Devendra Nagar",
    streetAddress: "Sector 2",
    postalCode: "492004",
    position: [21.2632, 81.6211],
    jobs: [
      ["Barista", "FULL_TIME", 12000, 16000],
      ["Kitchen Helper", "PART_TIME", 9000, 12000, { experience: [0, 0] }],
    ],
  },
  {
    slug: "ghatarani-resort",
    name: "Ghatarani Resort (Sample)",
    category: "Hospitality",
    area: "Moti Bagh",
    streetAddress: "Near Moti Bagh Chowk",
    postalCode: "492001",
    position: [21.2441, 81.6088],
    jobs: [["Front Office Executive", "FULL_TIME", 18000, 24000, { experience: [1, 3], salaryHidden: true }]],
  },
  {
    slug: "raipur-tech-hub",
    name: "Raipur Tech Hub (Sample)",
    category: "Technology",
    area: "Anupam Nagar",
    streetAddress: "Main Road",
    postalCode: "492007",
    position: [21.2624, 81.6629],
    jobs: [
      ["Junior Frontend Developer", "FULL_TIME", 25000, 40000, { experience: [0, 2], mode: "HYBRID" }],
      ["IT Support Technician", "FULL_TIME", 18000, 25000],
      ["QA Tester", "FULL_TIME", 20000, 30000, { experience: [1, 3], mode: "REMOTE" }],
      ["Android Developer", "FULL_TIME", 35000, 55000, { experience: [3, 5], mode: "HYBRID" }],
      ["UI Designer", "CONTRACTOR", 25000, 40000, { experience: [1, 3], mode: "REMOTE", salaryHidden: true }],
      ["Technical Support Intern", "INTERN", 8000, 10000, { experience: [0, 0] }],
    ],
  },
  {
    slug: "nds-cafe",
    name: "NDS Café (Sample)",
    category: "Hospitality",
    area: "Gayatri Nagar",
    streetAddress: "Near Gayatri Mandir",
    postalCode: "492006",
    position: [21.2424, 81.676],
    jobs: [
      ["Waiter / Waitress", "FULL_TIME", 11000, 14000],
      ["Line Cook", "FULL_TIME", 15000, 20000],
      ["Café Shift Supervisor", "FULL_TIME", 20000, 26000],
    ],
  },
  {
    slug: "amuseorama",
    name: "AmuseoRama (Sample)",
    category: "Hospitality",
    area: "Shastri Market",
    streetAddress: "Jail Road, near Shastri Market",
    postalCode: "492001",
    position: [21.2309, 81.6249],
    jobs: [
      ["Ticketing Executive", "PART_TIME", 10000, 13000],
      ["Guest Experience Associate", "FULL_TIME", 13000, 17000],
    ],
  },
  {
    slug: "shree-shyam-mart",
    name: "Shree Shyam Mart (Sample)",
    category: "Retail",
    area: "Avanti Vihar",
    streetAddress: "Sector 1",
    postalCode: "492006",
    position: [21.2292, 81.6842],
    jobs: [
      ["Store Manager", "FULL_TIME", 28000, 35000, { experience: [5, 8] }],
      ["Billing Executive", "FULL_TIME", 13000, 16000],
      ["Stock Associate", "FULL_TIME", 12000, 15000],
      ["Delivery Partner", "CONTRACTOR", 10000, 15000, { experience: [0, 0] }],
      ["Customer Service Associate", "FULL_TIME", 13000, 17000],
    ],
  },
  {
    slug: "patanjali-wellness",
    name: "Patanjali Wellness (Sample)",
    category: "Healthcare support",
    area: "Bhawna Nagar",
    streetAddress: "Main Road",
    postalCode: "492007",
    position: [21.254, 81.6873],
    jobs: [
      ["Wellness Centre Receptionist", "FULL_TIME", 13000, 17000],
      ["Ayurvedic Therapy Assistant", "FULL_TIME", 15000, 20000],
    ],
  },
  {
    slug: "lakeside-pharmacy",
    name: "Lakeside Pharmacy (Sample)",
    category: "Healthcare support",
    area: "Pandri",
    streetAddress: "Main Road",
    postalCode: "492004",
    position: [21.2541, 81.6455],
    jobs: [
      ["Pharmacy Assistant", "FULL_TIME", 14000, 18000],
      ["Lab Sample Collector", "FULL_TIME", 13000, 17000],
      ["Night Shift Pharmacist", "FULL_TIME", 25000, 32000, { experience: [3, 5], status: "closed" }],
      ["Patient Care Attendant", "FULL_TIME", 12000, 16000],
    ],
  },
  {
    slug: "swift-couriers",
    name: "Swift Couriers (Sample)",
    category: "Office admin",
    verified: false,
    area: "Pandri",
    streetAddress: "Lodhipara Chowk",
    postalCode: "492004",
    position: [21.253, 81.6471],
    jobs: [
      ["Office Assistant", "FULL_TIME", 13000, 16000],
      ["Dispatch Coordinator", "CONTRACTOR", 16000, 21000],
      ["Accounts Assistant", "FULL_TIME", 18000, 24000],
    ],
  },
  {
    slug: "cg-mobile-point",
    name: "CG Mobile Point (Sample)",
    category: "Sales",
    area: "Pandri",
    streetAddress: "Mobile Market",
    postalCode: "492004",
    position: [21.2547, 81.6469],
    jobs: [
      ["Mobile Sales Executive", "FULL_TIME", 14000, 20000],
      ["Field Sales Executive", "FULL_TIME", 16000, 22000],
      ["Telecaller", "PART_TIME", 9000, 12000],
    ],
  },
  {
    slug: "sunrise-care-clinic",
    name: "Sunrise Care Clinic (Sample)",
    category: "Healthcare support",
    area: "Shankar Nagar",
    streetAddress: "Near Shankar Nagar Chowk",
    postalCode: "492007",
    position: [21.2499, 81.6603],
    jobs: [],
  },
  {
    slug: "pandri-textiles",
    name: "Pandri Textiles (Sample)",
    category: "Retail",
    area: "Pandri",
    streetAddress: "Cloth Market",
    postalCode: "492004",
    position: [21.2527, 81.6451],
    jobs: [
      ["Saree Sales Associate", "FULL_TIME", 13000, 17000],
      ["Tailoring Assistant", "PART_TIME", 9000, 12000, { status: "expired" }],
    ],
  },
];

const categoryCopy: Record<Category, { pitch: string; responsibilities: string[]; requirements: string[] }> = {
  Retail: {
    pitch: "You'll be the friendly face on the shop floor, helping walk-in customers find what they need and keeping the store ready for the next rush.",
    responsibilities: [
      "Greet customers, understand what they're looking for and recommend products",
      "Keep shelves stocked, priced and tidy throughout the shift",
      "Handle billing, returns and exchanges accurately",
      "Help with weekly stock counts and new arrivals",
    ],
    requirements: [
      "Comfortable speaking Hindi; basic English is a plus",
      "Class 12 pass or equivalent",
      "Able to stand for long shifts and work weekends during festive season",
    ],
  },
  Hospitality: {
    pitch: "Join a busy team that takes pride in quick, warm service and a spotless space for every guest.",
    responsibilities: [
      "Welcome guests and look after them from arrival to departure",
      "Follow hygiene and food-safety standards on every shift",
      "Coordinate with the kitchen and front desk to keep service moving",
      "Handle feedback calmly and escalate issues to the shift lead",
    ],
    requirements: [
      "A positive attitude and good communication in Hindi",
      "Previous hospitality experience is helpful but not required",
      "Flexible with early, late and weekend shifts",
    ],
  },
  Sales: {
    pitch: "Help people in your neighbourhood pick the right product, and earn incentives on top of your fixed salary for every sale you close.",
    responsibilities: [
      "Explain products, plans and offers clearly to walk-in and phone customers",
      "Follow up on leads and keep the daily sales register updated",
      "Meet monthly targets with support from the store manager",
      "Keep demo units and display areas in top condition",
    ],
    requirements: [
      "Confident, persuasive communication in Hindi",
      "Basic smartphone and WhatsApp skills",
      "Two-wheeler and licence preferred for field roles",
    ],
  },
  "Healthcare support": {
    pitch: "Support patients and customers with care and accuracy in a clean, well-run facility.",
    responsibilities: [
      "Assist patients and customers with empathy and patience",
      "Maintain accurate records, prescriptions and appointment logs",
      "Follow hygiene, safety and handling protocols at all times",
      "Coordinate with doctors, pharmacists or therapists on duty",
    ],
    requirements: [
      "Relevant certificate or diploma for clinical roles",
      "Attention to detail and a calm manner",
      "Willing to work rotational shifts",
    ],
  },
  "Office admin": {
    pitch: "Keep a growing local business running smoothly behind the scenes.",
    responsibilities: [
      "Manage daily paperwork, filing and data entry",
      "Coordinate pickups, deliveries and vendor calls",
      "Maintain registers in Excel or Tally",
      "Support the manager with scheduling and reports",
    ],
    requirements: [
      "Graduate in any discipline, or Class 12 with relevant experience",
      "Working knowledge of MS Office; Tally is a plus",
      "Organised, punctual and good on the phone",
    ],
  },
  Technology: {
    pitch: "Work on products used by thousands of people across Chhattisgarh, with mentoring from a small senior team.",
    responsibilities: [
      "Build, test and ship features with the product team",
      "Fix bugs reported by customers and the support desk",
      "Document your work and share it in weekly reviews",
      "Learn and apply good practices for quality and security",
    ],
    requirements: [
      "Portfolio, GitHub profile or college projects that show your skills",
      "Comfortable reading English documentation",
      "Freshers with strong fundamentals are welcome",
    ],
  },
};

const categoryExtras: Record<
  Category,
  { skills: string[]; skillNotes: string[]; education: string; benefits: string[] }
> = {
  Retail: {
    skills: ["Customer service", "Billing / POS", "Basic computer", "Hindi", "English"],
    skillNotes: ["Good communication skills", "Comfortable standing for long shifts"],
    education: "Class 12 pass (required) · Graduate (preferred)",
    benefits: ["Monthly incentives", "Staff discount", "Paid weekly off"],
  },
  Hospitality: {
    skills: ["Guest service", "Food safety", "Teamwork", "Hindi"],
    skillNotes: ["Calm under pressure during rush hours", "Neat and well groomed"],
    education: "Class 10 pass (required) · Hotel management diploma (preferred)",
    benefits: ["Free meals on shift", "Tips shared weekly", "Paid weekly off"],
  },
  Sales: {
    skills: ["Negotiation", "Product demos", "WhatsApp", "Hindi"],
    skillNotes: ["Comfortable meeting targets", "Friendly and persuasive"],
    education: "Class 12 pass (required)",
    benefits: ["Sales incentives", "Travel allowance", "Paid weekly off"],
  },
  "Healthcare support": {
    skills: ["Patient care", "Record keeping", "Hygiene protocols", "Hindi"],
    skillNotes: ["Empathetic with patients", "Careful with medicines and samples"],
    education: "Relevant certificate or diploma (required for clinical roles)",
    benefits: ["Health cover", "Shift allowance", "Paid weekly off"],
  },
  "Office admin": {
    skills: ["MS Excel", "Tally", "Data entry", "Phone etiquette"],
    skillNotes: ["Organised and punctual", "Clear written Hindi and English"],
    education: "Graduate in any discipline (preferred)",
    benefits: ["Fixed day shift", "Provident fund", "Paid weekly off"],
  },
  Technology: {
    skills: ["JavaScript", "Git", "Problem solving", "English"],
    skillNotes: ["Comfortable reading documentation", "Willing to learn new tools"],
    education: "B.Tech / BCA / MCA or an equivalent portfolio",
    benefits: ["Laptop provided", "Learning budget", "Flexible hours"],
  },
};

const defaultExperience: [number, number][] = [
  [0, 2],
  [0, 0],
  [1, 3],
];

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const addDays = (isoDate: string, days: number) => {
  const date = new Date(`${isoDate}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
};

const raipur = cities[0];

export const companies: Company[] = companySeeds.map((seed) => ({
  slug: seed.slug,
  name: seed.name,
  category: seed.category,
  area: seed.area,
  streetAddress: seed.streetAddress,
  postalCode: seed.postalCode,
  position: seed.position,
  citySlug: raipur.slug,
  verified: seed.verified ?? true,
  photoCount: 8,
}));

export const jobs: Job[] = companySeeds.flatMap((seed, companyIndex) => {
  const company = companies[companyIndex];
  const copy = categoryCopy[seed.category];
  const extras = categoryExtras[seed.category];
  return seed.jobs.map(([title, employmentType, min, max, options = {}], jobIndex) => {
    const datePosted = addDays("2026-09-30", (companyIndex * 3 + jobIndex * 2) % 14);
    const [expMin, expMax] = options.experience ?? defaultExperience[(companyIndex + jobIndex) % defaultExperience.length];
    const status = options.status ?? "open";
    return {
      slug: `${slugify(title)}-${company.slug}`,
      title,
      category: seed.category,
      employmentType,
      workMode: options.mode ?? "ON_SITE",
      experience: { min: expMin, max: expMax },
      salary: { min, max, currency: "INR" as const, unit: "MONTH" as const },
      salaryDisclosed: !options.salaryHidden,
      datePosted,
      validThrough: status === "expired" ? addDays(SAMPLE_TODAY, -2) : addDays(datePosted, 31),
      status,
      applicants: ((companyIndex * 7 + jobIndex * 5) % 28) + 3,
      summary: `${company.name} is hiring a ${title} at its ${company.area} location in ${raipur.name}. ${copy.pitch}`,
      responsibilities: copy.responsibilities,
      requirements: copy.requirements,
      ...extras,
      company,
      city: raipur,
    };
  });
});

export const jobPath = (job: Pick<Job, "slug" | "city">) => `/jobs/${job.city.slug}/${job.slug}`;

export const isOpen = (job: Pick<Job, "status">) => job.status === "open";

export const experienceLabel = ({ min, max }: Job["experience"]) =>
  max === 0 ? "Fresher" : `${min}–${max} yrs`;

export const matchesExperience = (job: Job, bucket: ExperienceBucket) => {
  const range = experienceBuckets[bucket];
  return job.experience.min <= range.max && job.experience.max >= range.min;
};

const EARTH_RADIUS_KM = 6371;

export function distanceKm([lat1, lng1]: [number, number], [lat2, lng2]: [number, number]) {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(a));
}

/** "Pandri, Raipur · 2.1 km" (or "Remote · Raipur") measured from the searched location. */
export function locationLine(job: Job, from: [number, number]) {
  if (job.workMode === "REMOTE") return `Remote · ${job.city.name}`;
  return `${job.company.area}, ${job.city.name} · ${distanceKm(from, job.company.position).toFixed(1)} km`;
}

const daysBetween = (fromIso: string, toIso: string) =>
  Math.round((Date.parse(`${toIso}T00:00:00Z`) - Date.parse(`${fromIso}T00:00:00Z`)) / 86_400_000);

export function timeAgo(isoDate: string) {
  const days = daysBetween(isoDate, SAMPLE_TODAY);
  if (days <= 0) return "today";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

export const daysSince = (isoDate: string) => daysBetween(isoDate, SAMPLE_TODAY);

export async function getJob(citySlug: string, jobSlug: string) {
  return jobs.find((job) => job.city.slug === citySlug && job.slug === jobSlug) ?? null;
}

export async function getAllJobs() {
  return jobs;
}

const rupees = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

export const formatSalary = ({ min, max }: Job["salary"]) =>
  `${rupees.format(min)}–${rupees.format(max).replace("₹", "")} a month`;

/** "₹15,000 – ₹20,000 / month", as on the Job Detail panel. */
export const formatSalaryRange = ({ min, max }: Job["salary"]) =>
  `${rupees.format(min)} – ${rupees.format(max)} / month`;

/** "₹15k–20k/mo", as on the Job Card salary badge. */
export const formatSalaryShort = ({ min, max }: Job["salary"]) => {
  const k = (value: number) => `${Math.round(value / 1000)}k`;
  return `₹${k(min)}–${k(max)}/mo`;
};

export const formatRupees = (value: number) => rupees.format(value);

const longDate = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

export const formatDate = (isoDate: string) => longDate.format(new Date(`${isoDate}T00:00:00Z`));
