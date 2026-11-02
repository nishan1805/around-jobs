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
};

export const certificationSeed: CertificationEntry[] = [
  {
    id: "cert-autocad",
    name: "AutoCAD Certified Professional",
    issuer: "Autodesk",
    issued: "Mar 2024",
    expiry: "",
  },
];

export const linksSeed = {
  linkedin: "https://linkedin.com/in/nishan-kumar-mondal",
  portfolio: "https://yourportfolio.com",
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
export const locationSuggestionsSeed = ["Civil Lines", "VIP Road", "Tetibandh"] as const;
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
    salary: "₹15,000 – ₹20,000 / month",
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
    salary: "₹15,000 – ₹20,000 / month",
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
    salary: "₹15,000 – ₹20,000 / month",
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
    salary: "₹15,000 – ₹20,000 / month",
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
    expiring: true,
    nearby: false,
    recent: false,
    salary: "₹15,000 – ₹20,000 / month",
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
    expiring: true,
    nearby: false,
    recent: false,
    salary: "₹15,000 – ₹20,000 / month",
    posted: "Posted 2d ago",
  },
];
