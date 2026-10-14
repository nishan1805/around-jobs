import { formatDayMonth, isOpen, relativeDay, type Job } from "@/lib/jobs";
import type { Application, ApplicationEvent, ApplicationStage } from "@/lib/seeker-store";

export type ApplicationGroup = "applied" | "viewed" | "shortlisted" | "interview" | "closed";

export const applicationGroups: { key: ApplicationGroup; label: string }[] = [
  { key: "applied", label: "Applied" },
  { key: "viewed", label: "Viewed" },
  { key: "shortlisted", label: "Shortlisted" },
  { key: "interview", label: "Interview" },
  { key: "closed", label: "Closed" },
];

/** Rejected applications and jobs that stopped hiring are "Closed". */
export const groupOf = (application: Application, job: Job): ApplicationGroup =>
  application.stage === "rejected" || !isOpen(job) ? "closed" : application.stage;

export const stageLabels: Record<ApplicationStage, string> = {
  applied: "Applied",
  viewed: "Viewed",
  shortlisted: "Shortlisted",
  interview: "Interview",
  rejected: "Not selected",
};

export function statusLabel(application: Application, job: Job) {
  if (application.stage === "rejected") return stageLabels.rejected;
  if (!isOpen(job)) return "Closed";
  if (application.stage === "interview" && application.interviewOn)
    return `Interview on ${formatDayMonth(application.interviewOn)}`;
  return stageLabels[application.stage];
}

const eventCopy: Record<ApplicationStage, string> = {
  applied: "Application sent",
  viewed: "Employer viewed your profile",
  shortlisted: "You were shortlisted",
  interview: "Interview scheduled",
  rejected: "The employer chose other candidates",
};

export function eventText(event: ApplicationEvent, application: Application) {
  if (event.stage === "interview" && application.interviewOn)
    return `Interview set for ${formatDayMonth(application.interviewOn)}`;
  return eventCopy[event.stage];
}

/** "Today, 10:30 AM (Sample)" */
export function eventWhen(event: ApplicationEvent, application: Application) {
  const day = relativeDay(event.on);
  const when = event.time ? `${day}, ${event.time}` : day;
  return application.sample ? `${when} (Sample)` : when;
}

/** "Applied 3 days ago" / "Applied today" */
export function appliedWhen(application: Application) {
  const day = relativeDay(application.appliedOn);
  return day === "Today" ? "Applied today" : `Applied ${day.toLowerCase()}`;
}

export function nextStep(application: Application, job: Job) {
  if (application.stage === "rejected")
    return "This one didn't work out. New jobs near you are added every day, so keep applying.";
  if (!isOpen(job)) return "The employer has stopped taking applications for this job.";
  switch (application.stage) {
    case "applied":
      return "Employers usually look at new applications within 2–3 days.";
    case "viewed":
      return "If your profile is a match, the employer will shortlist you.";
    case "shortlisted":
      return "The employer may call you to fix an interview time.";
    case "interview":
      return application.interviewOn
        ? `Your interview is on ${formatDayMonth(application.interviewOn)}. Carry an ID proof and reach 10 minutes early.`
        : "The employer will share the interview time with you.";
  }
}
