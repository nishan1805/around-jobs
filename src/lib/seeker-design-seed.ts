/**
 * Sample copy taken from the finalized job-seeker frames (Around Jobs, file
 * CqYtGTafIxJo5rfRSa6AbJ). Components read this module; they do not inline it.
 */

export const SEARCH_PLACEHOLDER = "Search places, restaurants, events, offers...";

export const POPULAR_AREAS = [
  "Shankar Nagar, Raipur",
  "Pandri, Raipur",
  "Telibandha, Raipur",
  "Amanaka, Raipur",
  "Kota, Raipur",
] as const;

export const PROFILE_UPDATED_LABEL = "16 Oct 2026";

/** Header, completion card and account menu. The basic-info form uses a different name — see TODO. */
export const PROFILE_DISPLAY_NAME = "Nishan Kumar Mondal";

export const profileBasicSeed = {
  fullName: "Nishan Kumar Mondal",
  phone: "98765 43210",
  email: "nishan.kumar.mondal@example.com",
  gender: "Male",
  location: "Raipur, Chhattisgarh",
  headline: "Civil Engineer",
  about:
    "Civil engineer with 2+ years of site supervision experience on residential and commercial projects in Raipur. Looking for site engineer roles with a growing construction firm.",
};

export const genderOptions = ["Male", "Female", "Other"] as const;

export const yourSkillsSeed = [
  "AutoCAD",
  "Site supervision",
  "Quantity estimation",
  "MS Project",
  "Structural drawing reading",
  "Bar bending schedule",
  "Concrete testing",
] as const;

export const suggestedSkillsSeed = [
  "STAAD.Pro",
  "Revit",
  "Primavera P6",
  "Land surveying",
  "Safety compliance",
  "Billing & invoicing",
  "Team coordination",
] as const;

export type EducationEntry = {
  id: string;
  degree: string;
  institute: string;
  field: string;
  startYear: string;
  endYear: string;
  mode: string;
  grade: string;
};

export const educationSeed: EducationEntry[] = [
  {
    id: "edu-btech",
    degree: "B.Tech in Civil Engineering",
    institute: "NIT Raipur",
    field: "Civil Engineering",
    startYear: "2019",
    endYear: "2023",
    mode: "Full-time",
    grade: "",
  },
];

/** Second card on P02e. Uses the filled values from the Add education dialog. */
export const educationExtraSeed: EducationEntry = {
  id: "edu-diploma",
  degree: "Diploma in Civil Engineering",
  institute: "Government Polytechnic, Raipur",
  field: "Civil Engineering",
  startYear: "2016",
  endYear: "2019",
  mode: "Full-time",
  grade: "8.5 CGPA",
};

export const degreeOptions = [
  "Diploma in Civil Engineering",
  "B.Tech in Civil Engineering",
  "M.Tech in Civil Engineering",
] as const;

export type CertificationEntry = {
  id: string;
  name: string;
  issuer: string;
  issued: string;
  expiry: string;
  url: string;
};

export const certificationSeed: CertificationEntry[] = [
  {
    id: "cert-autocad",
    name: "AutoCAD Certified Professional",
    issuer: "Autodesk",
    issued: "Mar 2024",
    expiry: "",
    url: "",
  },
];

/** P02c Add certification, filled. Title stays "Add certification". */
export const certificationFilledPreview: CertificationEntry = {
  id: "cert-nptel",
  name: "Quantity Surveying and Estimation",
  issuer: "NPTEL",
  issued: "Jan 2025",
  expiry: "No expiry date",
  url: "",
};

export const linksSeed = {
  linkedin: "https://linkedin.com/in/nishan-kumar-mondal",
  portfolio: "",
  other: "",
};

export const resumeSeed = {
  name: "Resume_Nishan_Kumar_Mondal.pdf",
  sizeLabel: "240 KB",
  uploadedLabel: "Uploaded 16 Oct 2026",
};

export type ExperienceEntry = {
  id: string;
  title: string;
  company: string;
  initials: string;
  start: string;
  end: string;
  location: string;
  type: string;
  arrangement: string;
  description: string;
};

export const experienceSeed: ExperienceEntry[] = [
  {
    id: "exp-site",
    title: "Site Engineer",
    company: "Chhattisgarh Infra Projects Pvt. Ltd.",
    initials: "CI",
    start: "Jan 2024",
    end: "Present",
    location: "Raipur, Chhattisgarh",
    type: "Full-time",
    arrangement: "On-site",
    description:
      "Supervise residential and commercial site work, check drawings and bar bending schedules, and coordinate daily with contractors. Prepare quantity estimates and weekly progress reports.",
  },
  {
    id: "exp-junior",
    title: "Junior Site Engineer (Trainee)",
    company: "Mahanadi Builders",
    initials: "MB",
    start: "Jul 2023",
    end: "Dec 2023",
    location: "Raipur, Chhattisgarh",
    type: "Full-time",
    arrangement: "On-site",
    description:
      "Assisted the site engineer with layout marking, concrete pour checks and material records on a G+4 residential project in Raipur.",
  },
];

/** Third card on P03c. */
export const experienceInternSeed: ExperienceEntry = {
  id: "exp-intern",
  title: "Civil Engineering Intern",
  company: "Public Works Department, Raipur",
  initials: "PW",
  start: "May 2022",
  end: "Jun 2022",
  location: "Raipur, Chhattisgarh",
  type: "Internship",
  arrangement: "On-site",
  description:
    "Summer internship on road and drain works: site visits, level surveys and measurement book entries.",
};

export const experienceTotalLabel = "Total experience: 3 yrs 3 mos";
export const experienceTotalThreeLabel = "Total experience: 3 yrs 5 mos";

export const employmentTypeOptions = ["Full-time", "Part-time", "Internship", "Contract"] as const;
export const workArrangementOptions = ["On-site", "Hybrid", "Remote"] as const;

export const preferredLocationsSeed = ["Pandri", "Shankar Nagar", "Telibandha"] as const;
export const locationSuggestionsSeed = ["Civil Lines", "VIP Road", "Telibandh"] as const;
export const preferredRolesSeed = ["Site Engineer", "Civil Engineer", "Project Engineer"] as const;
export const roleSuggestionsSeed = ["Quantity Surveyor"] as const;

export const noticePeriodOptions = ["Immediate", "15 days", "30 days", "60 days", "90 days"] as const;
export const salaryPeriodOptions = ["per month", "per year"] as const;

export const PROFILE_COMPLETION = 70;

export type SavedCardSeed = {
  id: string;
  title: string;
  company: string;
  initials: string;
  verified: boolean;
  location: string;
  distance: string;
  type: string;
  experience: string;
  expiring: boolean;
  nearby: boolean;
  recent: boolean;
  salary: string;
  posted: string;
};

/** S17 Saved jobs. Every card in the frame is Site Supervisor at Raipur Builder. */
export const savedCardsSeed: SavedCardSeed[] = [
  {
    id: "saved-1",
    title: "Site Supervisor",
    company: "Raipur Builder",
    initials: "RB",
    verified: true,
    location: "Shankar Nagar, Raipur",
    distance: "2.1 km",
    type: "Full-time",
    experience: "0–1 yrs",
    expiring: true,
    nearby: true,
    recent: true,
    salary: "₹15,000 – ₹20,000",
    posted: "Posted 2d ago",
  },
  {
    id: "saved-2",
    title: "Site Supervisor",
    company: "Raipur Builder",
    initials: "RB",
    verified: true,
    location: "Shankar Nagar, Raipur",
    distance: "2.1 km",
    type: "Full-time",
    experience: "1–2 yrs",
    expiring: true,
    nearby: true,
    recent: true,
    salary: "₹15,000 – ₹20,000",
    posted: "Posted 2d ago",
  },
  {
    id: "saved-3",
    title: "Site Supervisor",
    company: "Raipur Builder",
    initials: "RB",
    verified: true,
    location: "Shankar Nagar, Raipur",
    distance: "2.1 km",
    type: "Part-time",
    experience: "Fresher",
    expiring: true,
    nearby: true,
    recent: false,
    salary: "₹15,000 – ₹20,000",
    posted: "Posted 2d ago",
  },
  {
    id: "saved-4",
    title: "Site Supervisor",
    company: "Raipur Builder",
    initials: "RB",
    verified: true,
    location: "Shankar Nagar, Raipur",
    distance: "2.1 km",
    type: "Shift",
    experience: "Fresher",
    expiring: true,
    nearby: false,
    recent: false,
    salary: "₹15,000 – ₹20,000",
    posted: "Posted 2d ago",
  },
  {
    id: "saved-5",
    title: "Site Supervisor",
    company: "Raipur Builder",
    initials: "RB",
    verified: true,
    location: "Shankar Nagar, Raipur",
    distance: "2.1 km",
    type: "Shift",
    experience: "0–2 yrs",
    expiring: false,
    nearby: false,
    recent: false,
    salary: "₹15,000 – ₹20,000",
    posted: "Posted 2d ago",
  },
  {
    id: "saved-6",
    title: "Site Supervisor",
    company: "Raipur Builder",
    initials: "RB",
    verified: true,
    location: "Shankar Nagar, Raipur",
    distance: "2.1 km",
    type: "Full-time",
    experience: "2–4 yrs",
    expiring: false,
    nearby: false,
    recent: false,
    salary: "₹15,000 – ₹20,000",
    posted: "Posted 2d ago",
  },
];

export type FrameJobCard = {
  id: string;
  title: string;
  company?: string;
  initials?: string;
  tone?: "info" | "orange";
  verified?: boolean;
  location: string;
  salary: string;
  employment: string;
  experience: string;
  posted: string;
  applied?: boolean;
};

/** S03 list. The frame prints "(Sample)" on the first employer; the visible UI omits it. */
export const browseListSeed: FrameJobCard[] = [
  {
    id: "browse-1",
    title: "Site Supervisor",
    company: "Raipur Builder",
    initials: "RB",
    tone: "orange",
    verified: true,
    location: "Shankar Nagar, Raipur · 2.1 km",
    salary: "₹15k–20k/mo",
    employment: "Full Time",
    experience: "0-1 yrs",
    posted: "Posted 2d ago",
    applied: true,
  },
  {
    id: "browse-2",
    title: "Front Desk Executive",
    company: "Mayura Residency",
    initials: "RB",
    verified: true,
    location: "Civil Lines, Raipur · 3.4 km",
    salary: "Salary not disclosed",
    employment: "Full Time",
    experience: "0-1 yrs",
    posted: "Posted 5 days ago",
  },
  {
    id: "browse-3",
    title: "Patient Care Assistant",
    company: "Shree Care Clinic",
    initials: "RB",
    verified: true,
    location: "Kota, Raipur · 4.8 km",
    salary: "₹12k–18k/mo",
    employment: "Full Time",
    experience: "0-1 yrs",
    posted: "Posted 1 week ago",
  },
  {
    id: "browse-4",
    title: "Junior Web Developer",
    company: "Raipur Tech Labs",
    initials: "RB",
    verified: true,
    location: "Shankar Nagar, Raipur · 3.9 km",
    salary: "₹25k–40k/mo",
    employment: "Full Time",
    experience: "0-1 yrs",
    posted: "Posted 1 week ago",
  },
  {
    id: "browse-5",
    title: "Cashier",
    company: "Magneto Mall Store",
    initials: "RB",
    verified: true,
    location: "Telibandha, Raipur · 5.2 km",
    salary: "₹14k–18k/mo",
    employment: "Full Time",
    experience: "0-1 yrs",
    posted: "Posted 1 week ago",
  },
];

/** S06 filtered results. */
export const filteredListSeed: FrameJobCard[] = [
  {
    id: "filtered-1",
    title: "Store Sales Associate",
    company: "Raipur Builder",
    initials: "RB",
    verified: true,
    location: "Pandri, Raipur · 2.1 km",
    salary: "₹15k–20k/mo",
    employment: "Full Time",
    experience: "0-1 yrs",
    posted: "Posted 2d ago",
    applied: true,
  },
  {
    id: "filtered-2",
    title: "Cashier",
    company: "Magneto Mall Store",
    initials: "RB",
    verified: true,
    location: "Telibandha, Raipur · 5.2 km",
    salary: "₹14k–18k/mo",
    employment: "Full Time",
    experience: "0-1 yrs",
    posted: "Posted 1 week ago",
  },
  {
    id: "filtered-3",
    title: "Retail Billing Executive",
    company: "Shree Shyam Mart",
    initials: "RB",
    verified: true,
    location: "Tatibandh, Raipur · 4.1 km",
    salary: "₹13k–16k/mo",
    employment: "Full Time",
    experience: "0-1 yrs",
    posted: "Posted 3 days ago",
  },
];

export const BROWSE_LIST_SUBTITLE = "24 jobs near you";
export const FILTERED_LIST_SUBTITLE = "3 jobs match your filters";

export const RAIPUR_BUILDER_SLUG = "raipur-builder";
export const CIVIL_ENGINEER_SLUG = "civil-engineer";

export const employerOverviewSeed = {
  name: "Raipur Builder Pvt. Ltd.",
  industry: "Construction & Interior Design",
  location: "Currency Tower, Vishal Nagar, Telibandha, Raipur",
  website: "https://www.raipurbuilder.com/",
  logo: "/images/raipur-builder.png",
  about: "Raipur Builder provides residential and commercial construction, renovation, interior design and space-planning services.",
  size: "51–200 employees",
  founded: "Founded 2019",
  jobs: [
    {
      id: "rb-civil",
      title: "Civil Engineer",
      location: "Telibandha, Raipur",
      salary: "Salary not disclosed",
      employment: "Full Time",
      experience: "0-1 yrs",
      posted: "Posted 2d ago",
    },
    {
      id: "rb-architect",
      title: "Architect",
      location: "Telibandha, Raipur",
      salary: "Salary not disclosed",
      employment: "Full Time",
      experience: "0-1 yrs",
      posted: "Posted 5d ago",
    },
    {
      id: "rb-interior",
      title: "Interior Designer",
      location: "Telibandha, Raipur",
      salary: "Salary not disclosed",
      employment: "Full Time",
      experience: "0-1 yrs",
      posted: "Posted 1w ago",
    },
  ] satisfies FrameJobCard[],
};

export const civilEngineerDetail = {
  title: "Civil Engineer",
  company: "Raipur Builder Pvt. Ltd.",
  salary: "₹15,000 – ₹20,000 / month",
  employment: "Full-time",
  mode: "On-site",
  experience: "3–5 yrs",
  area: "Telibandha, Raipur",
  posted: "Posted 2d ago",
  deadline: "Apply by 31 Oct 2026",
  applicants: "12 applicants",
  description:
    "Join Raipur Builder Pvt. Ltd. as a Civil Engineer. Raipur Builder provides residential and commercial construction, renovation, interior design and space-planning services.",
  requirements: ["3–5 years of experience", "Full-time role"],
  skills: [
    "Residential construction",
    "Commercial construction",
    "Renovation",
    "Interior & exterior design",
    "Project management",
    "Space planning",
  ],
  address: "Unit 4055, 4th Floor, Currency Tower, Vishal Nagar, Telibandha, Raipur, Chhattisgarh 492001",
};

export type JobDetailVariant = "open" | "expired" | "applied" | "remote" | "closed";

export const jobDetailVariantCopy: Record<
  JobDetailVariant,
  {
    banner?: string;
    bannerTone?: "error" | "success";
    button: string;
    buttonDisabled: boolean;
    buttonVariant?: "default" | "outline";
    salary?: string;
    mode?: string;
    area?: string;
    hideDeadline?: boolean;
    hideMap?: boolean;
  }
> = {
  open: { button: "Apply now", buttonDisabled: false },
  // 1889:42619
  expired: {
    banner: "This job is no longer accepting applications.",
    bannerTone: "error",
    button: "Applications closed",
    buttonDisabled: true,
    hideDeadline: true,
  },
  // 1889:42721
  applied: {
    banner: "You applied on 12 Oct 2026",
    bannerTone: "success",
    button: "View application",
    buttonDisabled: false,
    buttonVariant: "outline",
  },
  // 1896:12970 — salary, mode and area change; the address and map placeholder stay.
  remote: {
    button: "Apply now",
    buttonDisabled: false,
    salary: "Salary not disclosed",
    mode: "Remote",
    area: "Remote",
  },
  // 1896:12936
  closed: {
    banner: "This job is closed. The employer is no longer hiring for this role.",
    bannerTone: "error",
    button: "Position closed",
    buttonDisabled: true,
  },
};
