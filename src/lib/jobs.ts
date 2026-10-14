export const categories = [
  "Retail",
  "Hospitality",
  "Sales",
  "Healthcare support",
  "Office admin",
  "Technology",
] as const;

export type Category = (typeof categories)[number];

export const employmentTypes = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  INTERN: "Internship",
} as const;

export type EmploymentType = keyof typeof employmentTypes;

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
};

export type Job = {
  slug: string;
  title: string;
  category: Category;
  employmentType: EmploymentType;
  salary: { min: number; max: number; currency: "INR"; unit: "MONTH" };
  datePosted: string;
  validThrough: string;
  summary: string;
  responsibilities: string[];
  requirements: string[];
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

type JobSeed = [title: string, type: EmploymentType, min: number, max: number];

type CompanySeed = Omit<Company, "citySlug"> & { jobs: JobSeed[] };

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
      ["Visual Merchandiser", "FULL_TIME", 18000, 24000],
      ["Store Inventory Executive", "FULL_TIME", 15000, 19000],
    ],
  },
  {
    slug: "urban-bites-cafe",
    name: "Urban Bites Café (Sample)",
    category: "Hospitality",
    area: "Devendra Nagar",
    streetAddress: "Sector 2, Devendra Nagar",
    postalCode: "492004",
    position: [21.2632, 81.6211],
    jobs: [
      ["Barista", "FULL_TIME", 12000, 16000],
      ["Kitchen Helper", "PART_TIME", 9000, 12000],
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
    jobs: [["Front Office Executive", "FULL_TIME", 18000, 24000]],
  },
  {
    slug: "raipur-tech-hub",
    name: "Raipur Tech Hub (Sample)",
    category: "Technology",
    area: "Anupam Nagar",
    streetAddress: "Anupam Nagar Main Road",
    postalCode: "492007",
    position: [21.2624, 81.6629],
    jobs: [
      ["Junior Frontend Developer", "FULL_TIME", 25000, 40000],
      ["IT Support Technician", "FULL_TIME", 18000, 25000],
      ["QA Tester", "FULL_TIME", 20000, 30000],
      ["Android Developer", "FULL_TIME", 35000, 55000],
      ["UI Designer", "FULL_TIME", 25000, 40000],
      ["Technical Support Intern", "INTERN", 8000, 10000],
    ],
  },
  {
    slug: "nds-cafe",
    name: "NDS Café (Sample)",
    category: "Hospitality",
    area: "Gayatri Nagar",
    streetAddress: "Gayatri Nagar Square",
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
    streetAddress: "Avanti Vihar Colony",
    postalCode: "492006",
    position: [21.2292, 81.6842],
    jobs: [
      ["Store Manager", "FULL_TIME", 28000, 35000],
      ["Billing Executive", "FULL_TIME", 13000, 16000],
      ["Stock Associate", "FULL_TIME", 12000, 15000],
      ["Delivery Partner", "PART_TIME", 10000, 15000],
      ["Customer Service Associate", "FULL_TIME", 13000, 17000],
    ],
  },
  {
    slug: "patanjali-wellness",
    name: "Patanjali Wellness (Sample)",
    category: "Healthcare support",
    area: "Bhawna Nagar",
    streetAddress: "Bhawna Nagar Road",
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
    streetAddress: "Pandri Main Road",
    postalCode: "492004",
    position: [21.2541, 81.6455],
    jobs: [
      ["Pharmacy Assistant", "FULL_TIME", 14000, 18000],
      ["Lab Sample Collector", "FULL_TIME", 13000, 17000],
      ["Night Shift Pharmacist", "FULL_TIME", 25000, 32000],
      ["Patient Care Attendant", "FULL_TIME", 12000, 16000],
    ],
  },
  {
    slug: "swift-couriers",
    name: "Swift Couriers (Sample)",
    category: "Office admin",
    area: "Pandri",
    streetAddress: "Lodhipara Chowk, Pandri",
    postalCode: "492004",
    position: [21.253, 81.6471],
    jobs: [
      ["Office Assistant", "FULL_TIME", 13000, 16000],
      ["Dispatch Coordinator", "FULL_TIME", 16000, 21000],
      ["Accounts Assistant", "FULL_TIME", 18000, 24000],
    ],
  },
  {
    slug: "cg-mobile-point",
    name: "CG Mobile Point (Sample)",
    category: "Sales",
    area: "Pandri",
    streetAddress: "Mobile Market, Pandri",
    postalCode: "492004",
    position: [21.2547, 81.6469],
    jobs: [
      ["Mobile Sales Executive", "FULL_TIME", 14000, 20000],
      ["Field Sales Executive", "FULL_TIME", 16000, 22000],
      ["Telecaller", "PART_TIME", 9000, 12000],
    ],
  },
  {
    slug: "pandri-textiles",
    name: "Pandri Textiles (Sample)",
    category: "Retail",
    area: "Pandri Cloth Market",
    streetAddress: "Pandri Cloth Market",
    postalCode: "492004",
    position: [21.2527, 81.6451],
    jobs: [
      ["Saree Sales Associate", "FULL_TIME", 13000, 17000],
      ["Tailoring Assistant", "PART_TIME", 9000, 12000],
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
}));

export const jobs: Job[] = companySeeds.flatMap((seed, companyIndex) => {
  const company = companies[companyIndex];
  const copy = categoryCopy[seed.category];
  return seed.jobs.map(([title, employmentType, min, max], jobIndex) => {
    const datePosted = addDays("2026-09-28", (companyIndex * 3 + jobIndex * 2) % 14);
    return {
      slug: `${slugify(title)}-${company.slug}`,
      title,
      category: seed.category,
      employmentType,
      salary: { min, max, currency: "INR" as const, unit: "MONTH" as const },
      datePosted,
      validThrough: addDays(datePosted, 45),
      summary: `${company.name} is hiring a ${title} at its ${company.area} location in ${raipur.name}. ${copy.pitch}`,
      responsibilities: copy.responsibilities,
      requirements: copy.requirements,
      company,
      city: raipur,
    };
  });
});

export const jobPath = (job: Pick<Job, "slug" | "city">) => `/jobs/${job.city.slug}/${job.slug}`;

export async function getJob(citySlug: string, jobSlug: string) {
  return jobs.find((job) => job.city.slug === citySlug && job.slug === jobSlug) ?? null;
}

export async function getAllJobs() {
  return jobs;
}

const rupees = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

export const formatSalary = ({ min, max }: Job["salary"]) =>
  `${rupees.format(min)}–${rupees.format(max).replace("₹", "")} a month`;

const longDate = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

export const formatDate = (isoDate: string) => longDate.format(new Date(`${isoDate}T00:00:00Z`));
