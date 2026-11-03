"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import { AppShell } from "@/components/app-shell";
import { useAuth } from "@/components/auth/auth-provider";
import { Icon } from "@/components/icon";
import { TopBar } from "@/components/jobs/top-bar";
import { Button } from "@/components/ui/button";
import { useHydrated } from "@/hooks/use-hydrated";
import { useSearchParam } from "@/hooks/use-search-param";
import {
  PROFILE_COMPLETION,
  PROFILE_DISPLAY_NAME,
  PROFILE_UPDATED_LABEL,
  certificationFilledPreview,
  certificationSeed,
  educationExtraSeed,
  educationSeed,
  experienceInternSeed,
  experienceSeed,
  experienceTotalLabel,
  experienceTotalThreeLabel,
  genderOptions,
  linksSeed,
  locationSuggestionsSeed,
  noticePeriodOptions,
  preferredLocationsSeed,
  preferredRolesSeed,
  profileBasicSeed,
  resumeSeed,
  roleSuggestionsSeed,
  salaryPeriodOptions,
  suggestedSkillsSeed,
  yourSkillsSeed,
  type CertificationEntry,
  type EducationEntry,
  type ExperienceEntry,
} from "@/lib/seeker-design-seed";
import { cn } from "@/lib/utils";

import {
  CertificationDialog,
  ConfirmDialog,
  EducationDialog,
  ExperienceDialog,
  FieldLabel,
  PhotoDialog,
  type PhotoPhase,
} from "./profile-dialogs";

type Section = "basic" | "skills" | "experience" | "preferences";

const sections: { id: Section; label: string }[] = [
  { id: "basic", label: "Basic Info" },
  { id: "skills", label: "Skills & Education" },
  { id: "experience", label: "Experience" },
  { id: "preferences", label: "Job Preferences" },
];

const inputClass =
  "h-11 w-full rounded-sm border bg-surface-default px-3 text-body-sm-regular text-text-primary outline-none placeholder:text-text-tertiary focus:border-brand-primary focus:ring-3 focus:ring-brand-primary/20";

function sectionFromParam(value: string | null): Section {
  if (value === "skills" || value === "experience" || value === "preferences") return value;
  return "basic";
}

/** Desktop profile (P01–P05, S18). Query params preview each dialog and empty state. */
export function ProfileDesktop() {
  const hydrated = useHydrated();
  const { user, openLogin } = useAuth();
  const sectionParam = useSearchParam("section");
  const dialogParam = useSearchParam("dialog");
  const errorParam = useSearchParam("error");
  const emptyParam = useSearchParam("empty");
  const photoParam = useSearchParam("photo");
  const uploadParam = useSearchParam("upload");
  const educationCount = useSearchParam("education");
  const experienceCount = useSearchParam("experience");

  const [section, setSection] = useState<Section>("basic");
  const [seenSection, setSeenSection] = useState<string | null>(null);
  if ((sectionParam ?? "") !== seenSection) {
    setSeenSection(sectionParam ?? "");
    if (sectionParam) setSection(sectionFromParam(sectionParam));
  }

  const empty = emptyParam === "1";
  const showErrors = errorParam === "1";
  const [skills, setSkills] = useState<string[]>([...yourSkillsSeed]);
  const [suggested, setSuggested] = useState<string[]>([...suggestedSkillsSeed]);
  const [skillQuery, setSkillQuery] = useState("");
  const [education, setEducation] = useState<EducationEntry[]>(educationSeed);
  const [certs, setCerts] = useState<CertificationEntry[]>(certificationSeed);
  const [links, setLinks] = useState({ ...linksSeed });
  const [resumeOn, setResumeOn] = useState(true);
  const [experience, setExperience] = useState<ExperienceEntry[]>(experienceSeed);
  const [locations, setLocations] = useState<string[]>([...preferredLocationsSeed]);
  const [roles, setRoles] = useState<string[]>([...preferredRolesSeed]);
  const [employment, setEmployment] = useState("Full-time");
  const [arrangement, setArrangement] = useState("On-site");
  const [salary, setSalary] = useState("35,000");
  const [salaryPeriod, setSalaryPeriod] = useState<string>(salaryPeriodOptions[0]);
  const [notice, setNotice] = useState<string>("30 days");
  const [relocate, setRelocate] = useState(false);
  const [basic, setBasic] = useState({ ...profileBasicSeed });
  const [dialog, setDialog] = useState<string | null>(null);
  const [editingEducation, setEditingEducation] = useState<EducationEntry | undefined>();
  const [editingCert, setEditingCert] = useState<CertificationEntry | undefined>();
  const [editingExperience, setEditingExperience] = useState<ExperienceEntry | undefined>();
  const [photoPhase, setPhotoPhase] = useState<PhotoPhase | null>(null);
  const [photoSaved, setPhotoSaved] = useState(false);

  const activeDialog = dialog ?? dialogParam;
  const photoRemovedPreview = photoParam === "removed";
  const photoSuccess = photoParam === "success" || photoSaved;
  const photo: PhotoPhase | null = photoRemovedPreview
    ? "initial"
    : photoSuccess
      ? null
      : ((photoParam as PhotoPhase | null) ?? photoPhase);
  const skillsPreviewEmpty =
    section === "skills" && (empty || uploadParam === "uploading" || uploadParam === "error");
  const educationList = useMemo(() => {
    if (skillsPreviewEmpty) return [];
    return educationCount === "2" ? [...education, educationExtraSeed] : education;
  }, [education, educationCount, skillsPreviewEmpty]);
  const certList = skillsPreviewEmpty ? [] : certs;
  const showResume = !(empty && section === "skills") && resumeOn && uploadParam !== "removed";
  const experienceList = empty && section === "experience" ? [] : experience;
  const preferenceError = showErrors && section === "preferences";
  const locationList = (empty || preferenceError) && section === "preferences" ? [] : locations;
  const roleList = (empty || preferenceError) && section === "preferences" ? [] : roles;
  const preferenceBlank = (empty || preferenceError) && section === "preferences";
  const noticeValue = preferenceBlank ? "" : notice;
  const complete = section === "preferences" && !empty && !showErrors;

  const addSkill = (skill: string) => {
    const next = skill.trim();
    if (!next || skills.includes(next)) return;
    setSkills((current) => [...current, next]);
    setSuggested((current) => current.filter((item) => item !== next));
    setSkillQuery("");
  };

  return (
    <AppShell active="profile">
      <TopBar />
      <main className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto bg-background-secondary px-10 py-8">
        {!hydrated ? (
          <div aria-busy className="h-40 animate-pulse rounded-md bg-grey-100" />
        ) : !user ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
            <h1 className="text-display-small-semibold text-text-primary">My Profile</h1>
            <p className="text-body-regular text-text-secondary">Log in to manage your professional information.</p>
            <Button type="button" shape="rect" onClick={openLogin}>
              Log in
            </Button>
          </div>
        ) : (
          <>
            <header className="flex items-start justify-between gap-6">
              <div className="flex flex-col gap-1">
                <h1 className="text-display-small-semibold text-text-primary">My Profile</h1>
                <p className="text-body-regular text-text-secondary">
                  Manage your professional information and help employers find you.
                </p>
              </div>
              <p className="shrink-0 text-label-medium text-text-tertiary">
                Profile last updated: <span className="text-text-primary">{PROFILE_UPDATED_LABEL}</span>
              </p>
            </header>

            <section className="rounded-md border bg-surface-default p-5">
              <div className="flex items-start gap-4">
                <button
                  type="button"
                  aria-label="Change profile photo"
                  onClick={() => setPhotoPhase("initial")}
                  className="relative size-14 shrink-0"
                >
                  {photoSuccess ? (
                    <Image
                      src="/images/profile-photo.jpg"
                      alt=""
                      width={56}
                      height={56}
                      className="size-14 rounded-full object-cover"
                    />
                  ) : (
                    <span className="flex size-14 items-center justify-center rounded-full bg-grey-200 text-subheading-semibold text-text-primary">
                      {PROFILE_DISPLAY_NAME.charAt(0)}
                    </span>
                  )}
                  <span className="absolute -right-0.5 -bottom-0.5 flex size-6 items-center justify-center rounded-full border bg-surface-default text-text-secondary">
                    <Icon name="pencil" className="size-3.5" />
                  </span>
                </button>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-body-semibold text-text-primary">{PROFILE_DISPLAY_NAME}</p>
                      <p className="text-body-sm-regular text-text-secondary">
                        {complete
                          ? "Your profile is complete. Employers can see all your details."
                          : "Complete your profile to unlock more opportunities."}
                      </p>
                    </div>
                    {!complete && (
                      <p className="shrink-0 text-body-semibold text-brand-primary">{PROFILE_COMPLETION}% complete</p>
                    )}
                  </div>
                  {!complete && (
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-grey-200" aria-hidden>
                      <div className="h-full rounded-full bg-brand-primary" style={{ width: `${PROFILE_COMPLETION}%` }} />
                    </div>
                  )}
                </div>
              </div>
              {!complete && (
                <>
                  <div className="my-4 h-px bg-border-default" />
                  <p className="flex items-center gap-2 text-body-sm-regular text-text-secondary">
                    <Icon name="alertCircle" className="size-4 text-text-tertiary" />
                    Add your education details to get better job recommendations.
                  </p>
                </>
              )}
            </section>

            <div className="rounded-md border bg-surface-default">
              <div role="tablist" aria-label="Profile sections" className="grid grid-cols-4">
                {sections.map((item) => {
                  const selected = section === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      onClick={() => setSection(item.id)}
                      className={cn(
                        "border-b-2 px-3 py-3 text-body-sm-medium text-text-secondary",
                        selected && "border-brand-primary bg-primary-50 text-body-sm-semibold text-brand-primary",
                        !selected && "border-transparent",
                      )}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {section === "basic" && (
              <BasicSection
                basic={basic}
                setBasic={setBasic}
                showErrors={showErrors}
              />
            )}
            {section === "skills" && (
              <SkillsSection
                skills={skills}
                suggested={suggested.filter((item) => item.toLowerCase().includes(skillQuery.toLowerCase()))}
                query={skillQuery}
                onQuery={setSkillQuery}
                onAdd={addSkill}
                onRemove={(skill) => {
                  setSkills((current) => current.filter((item) => item !== skill));
                  if ((suggestedSkillsSeed as readonly string[]).includes(skill)) {
                    setSuggested((current) => [...current, skill]);
                  }
                }}
                education={educationList}
                certs={certList}
                links={links}
                onLinks={setLinks}
                showResume={showResume}
                upload={uploadParam}
                onAddEducation={() => {
                  setEditingEducation(undefined);
                  setDialog("education");
                }}
                onEditEducation={(entry) => {
                  setEditingEducation(entry);
                  setDialog("edit-education");
                }}
                onDeleteEducation={(id) => setEducation((current) => current.filter((item) => item.id !== id))}
                onAddCert={() => {
                  setEditingCert(undefined);
                  setDialog("certification");
                }}
                onEditCert={(entry) => {
                  setEditingCert(entry);
                  setDialog("edit-certification");
                }}
                onDeleteCert={(id) => setCerts((current) => current.filter((item) => item.id !== id))}
                onRemoveResume={() => setDialog("remove-resume")}
              />
            )}
            {section === "experience" && (
              <ExperienceSection
                items={
                  experienceCount === "3" && experienceList.length < 3
                    ? [...experienceList, experienceInternSeed]
                    : experienceList
                }
                onAdd={() => {
                  setEditingExperience(undefined);
                  setDialog("experience");
                }}
                onEdit={(entry) => {
                  setEditingExperience(entry);
                  setDialog("edit-experience");
                }}
                onDelete={(entry) => {
                  setEditingExperience(entry);
                  setDialog("delete-experience");
                }}
              />
            )}
            {section === "preferences" && (
              <PreferencesSection
                locations={locationList}
                roles={roleList}
                suggestionsLeft={
                  empty || preferenceError
                    ? [...preferredLocationsSeed, ...locationSuggestionsSeed]
                    : locationSuggestionsSeed.filter((item) => !locationList.includes(item))
                }
                roleSuggestions={
                  empty || preferenceError
                    ? [...preferredRolesSeed, ...roleSuggestionsSeed]
                    : roleSuggestionsSeed.filter((item) => !roleList.includes(item))
                }
                onAddLocation={(value) => setLocations((current) => (current.includes(value) ? current : [...current, value]))}
                onRemoveLocation={(value) => setLocations((current) => current.filter((item) => item !== value))}
                onAddRole={(value) => setRoles((current) => (current.includes(value) ? current : [...current, value]))}
                onRemoveRole={(value) => setRoles((current) => current.filter((item) => item !== value))}
                employment={preferenceBlank ? "" : employment}
                onEmployment={setEmployment}
                arrangement={preferenceBlank ? "" : arrangement}
                onArrangement={setArrangement}
                salary={preferenceBlank ? "" : salary}
                onSalary={setSalary}
                salaryPeriod={salaryPeriod}
                onSalaryPeriod={setSalaryPeriod}
                notice={noticeValue}
                onNotice={setNotice}
                relocate={relocate}
                onRelocate={setRelocate}
                showErrors={showErrors || (empty && false)}
                forceErrors={showErrors}
              />
            )}
          </>
        )}
      </main>

      {(activeDialog === "education" || activeDialog === "edit-education") && (
        <EducationDialog
          initial={activeDialog === "edit-education" ? (editingEducation ?? educationSeed[0]) : undefined}
          invalid={showErrors && activeDialog === "education"}
          onClose={() => setDialog(null)}
          onSave={(entry) => {
            setEducation((current) => {
              const exists = current.some((item) => item.id === entry.id);
              return exists ? current.map((item) => (item.id === entry.id ? entry : item)) : [...current, entry];
            });
            setDialog(null);
          }}
        />
      )}
      {(activeDialog === "certification" || activeDialog === "edit-certification" || activeDialog === "add-certification") && (
        <CertificationDialog
          asNew={activeDialog === "add-certification"}
          initial={
            activeDialog === "edit-certification"
              ? (editingCert ?? certificationSeed[0])
              : activeDialog === "add-certification"
                ? certificationFilledPreview
                : undefined
          }
          onClose={() => setDialog(null)}
          onSave={(entry) => {
            setCerts((current) => {
              const exists = current.some((item) => item.id === entry.id);
              return exists ? current.map((item) => (item.id === entry.id ? entry : item)) : [...current, entry];
            });
            setDialog(null);
          }}
        />
      )}
      {(activeDialog === "experience" || activeDialog === "edit-experience") && (
        <ExperienceDialog
          initial={activeDialog === "edit-experience" ? (editingExperience ?? experienceSeed[0]) : undefined}
          invalid={showErrors && activeDialog === "experience"}
          onClose={() => setDialog(null)}
          onSave={(entry) => {
            setExperience((current) => {
              const exists = current.some((item) => item.id === entry.id);
              return exists ? current.map((item) => (item.id === entry.id ? entry : item)) : [...current, entry];
            });
            setDialog(null);
          }}
        />
      )}
      {activeDialog === "delete-experience" && (
        <ConfirmDialog
          title="Delete this experience?"
          body={`${(editingExperience ?? experienceSeed[1]).title} at ${(editingExperience ?? experienceSeed[1]).company} will be removed from your profile and your total experience will update. This can't be undone.`}
          confirmLabel="Delete"
          onClose={() => setDialog(null)}
          onConfirm={() => {
            const id = (editingExperience ?? experienceSeed[1]).id;
            setExperience((current) => current.filter((item) => item.id !== id));
            setDialog(null);
          }}
        />
      )}
      {activeDialog === "remove-resume" && (
        <ConfirmDialog
          title="Remove your resume?"
          body={`${resumeSeed.name} will be removed from your profile. Employers won't be able to view it until you upload a new one.`}
          confirmLabel="Remove"
          onClose={() => setDialog(null)}
          onConfirm={() => {
            setResumeOn(false);
            setDialog(null);
          }}
        />
      )}
      {photo && photo !== "success" && (
        <PhotoDialog
          phase={photo === "initial" || photo === "selected" || photo === "saving" || photo === "error" || photo === "remove" ? photo : "initial"}
          onClose={() => setPhotoPhase(null)}
          onPhase={(next) => {
            if (next === "success") {
              setPhotoSaved(true);
              setPhotoPhase(null);
              return;
            }
            setPhotoPhase(next);
          }}
          onRemove={() => {
            setPhotoSaved(false);
            setPhotoPhase("initial");
          }}
        />
      )}
      {photoSuccess && (
        <p
          role="status"
          className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-md bg-success-50 px-4 py-3 text-body-sm-medium text-success-700 shadow-lg"
        >
          <Icon name="checkCircle" className="size-5" />
          Profile photo updated successfully.
        </p>
      )}
    </AppShell>
  );
}

function BasicSection({
  basic,
  setBasic,
  showErrors,
}: {
  basic: typeof profileBasicSeed;
  setBasic: (next: typeof profileBasicSeed) => void;
  showErrors: boolean;
}) {
  const set = (key: keyof typeof profileBasicSeed, value: string) => setBasic({ ...basic, [key]: value });
  return (
    <section className="flex flex-col gap-6 rounded-md border bg-surface-default p-6">
      <div>
        <h2 className="text-heading-semibold text-text-primary">Basic Information</h2>
        <p className="mt-1 text-body-sm-regular text-text-secondary">Add your personal information and contact details.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className="text-label-medium text-text-secondary">
            Full name <span className="text-error-default">*</span>
          </span>
          <input value={basic.fullName} onChange={(event) => set("fullName", event.target.value)} className={cn(inputClass, showErrors && !basic.fullName && "border-error-default")} />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-label-medium text-text-secondary">
            Phone number <span className="text-error-default">*</span>
          </span>
          <span className={cn(inputClass, "flex items-center gap-2")}>
            <span aria-hidden className="inline-block h-3.5 w-5 overflow-hidden rounded-[2px] border border-grey-200 bg-[linear-gradient(#ff9933_0_33%,#fff_33%_66%,#138808_66%)]" />
            <span className="text-body-sm-regular text-text-secondary">+91</span>
            <Icon name="chevronDown" className="size-3.5 text-text-tertiary" />
            <input
              value={basic.phone}
              onChange={(event) => set("phone", event.target.value)}
              className="min-w-0 flex-1 bg-transparent outline-none"
            />
            <span className="inline-flex items-center gap-1 rounded-full bg-success-50 px-2 py-0.5 text-label-medium text-success-700">
              <Icon name="checkCircle" className="size-3.5" />
              Verified
            </span>
          </span>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-label-medium text-text-secondary">
            Email address <span className="text-text-tertiary">(Optional)</span>
          </span>
          <input value={basic.email} onChange={(event) => set("email", event.target.value)} className={inputClass} />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-label-medium text-text-secondary">
            Gender <span className="text-text-tertiary">(Optional)</span>
          </span>
          <span className={cn(inputClass, "flex items-center")}>
            <select value={basic.gender} onChange={(event) => set("gender", event.target.value)} className="min-w-0 flex-1 bg-transparent outline-none">
              {genderOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </span>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-label-medium text-text-secondary">
            Current location <span className="text-error-default">*</span>
          </span>
          <span className={cn(inputClass, "flex items-center gap-2")}>
            <Icon name="pin" className="size-4 text-text-tertiary" />
            <input
              value={basic.location}
              onChange={(event) => set("location", event.target.value)}
              className="min-w-0 flex-1 bg-transparent outline-none"
            />
            {basic.location && (
              <button type="button" aria-label="Clear location" onClick={() => set("location", "")}>
                <Icon name="close" className="size-4 text-text-tertiary" />
              </button>
            )}
          </span>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-label-medium text-text-secondary">
            Professional headline <span className="text-text-tertiary">(Optional)</span>
          </span>
          <input value={basic.headline} onChange={(event) => set("headline", event.target.value)} className={inputClass} />
        </label>
      </div>
      <label className="flex flex-col gap-1.5">
        <span className="text-label-medium text-text-secondary">
          About you <span className="text-text-tertiary">(Optional)</span>
        </span>
        <span className="text-label-medium text-text-tertiary">
          Tell employers a bit about yourself, your skills and career goals.
        </span>
        <textarea
          value={basic.about}
          maxLength={500}
          onChange={(event) => set("about", event.target.value)}
          className="h-22 w-full resize-none rounded-sm border bg-surface-default p-3 text-body-sm-regular outline-none focus:border-brand-primary focus:ring-3 focus:ring-brand-primary/20"
        />
        <span className="text-right text-label-medium text-text-tertiary">{basic.about.length}/500</span>
      </label>
      <div className="flex justify-end">
        <Button type="button" shape="rect">
          Save Changes
        </Button>
      </div>
    </section>
  );
}

function EmptyWell({
  title,
  body,
  action,
  onAction,
  icon = "plus",
  error,
}: {
  title: string;
  body: string;
  action: string;
  onAction?: () => void;
  icon?: "plus" | "briefcase" | "upload" | "graduation" | "file";
  error?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 rounded-md border border-dashed bg-background-secondary px-6 py-8 text-center",
        error && "border-error-default",
      )}
    >
      <span className="flex size-10 items-center justify-center rounded-full bg-primary-50 text-brand-primary">
        <Icon
          name={icon === "graduation" ? "graduationCap" : icon === "file" ? "file" : icon === "briefcase" ? "briefcase" : icon === "upload" ? "upload" : "plus"}
          className="size-5"
        />
      </span>
      <div>
        <p className="text-body-sm-semibold text-text-primary">{title}</p>
        <p className="mt-1 max-w-md text-body-sm-regular text-text-secondary">{body}</p>
      </div>
      {error && (
        <p className="flex items-center gap-2 text-body-sm-regular text-error-default">
          <Icon name="alertCircle" className="size-4" />
          {error}
        </p>
      )}
      <Button type="button" variant="outline" shape="rect" size="sm" onClick={onAction}>
        {action.startsWith("Try") ? action : `+ ${action}`}
      </Button>
    </div>
  );
}

function SkillsSection(props: {
  skills: string[];
  suggested: string[];
  query: string;
  onQuery: (value: string) => void;
  onAdd: (skill: string) => void;
  onRemove: (skill: string) => void;
  education: EducationEntry[];
  certs: CertificationEntry[];
  links: typeof linksSeed;
  onLinks: (links: typeof linksSeed) => void;
  showResume: boolean;
  upload: string | null;
  onAddEducation: () => void;
  onEditEducation: (entry: EducationEntry) => void;
  onDeleteEducation: (id: string) => void;
  onAddCert: () => void;
  onEditCert: (entry: CertificationEntry) => void;
  onDeleteCert: (id: string) => void;
  onRemoveResume: () => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-4 rounded-md border bg-surface-default p-6">
        <div>
          <h2 className="text-heading-semibold text-text-primary">Skills</h2>
          <p className="mt-1 text-body-sm-regular text-text-secondary">
            Add the skills that best describe your work. This helps employers find the right opportunities for you.
          </p>
        </div>
        <label className={cn(inputClass, "flex items-center gap-2")}>
          <Icon name="search" className="size-4 text-text-tertiary" />
          <input
            value={props.query}
            onChange={(event) => props.onQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                props.onAdd(props.query);
              }
            }}
            placeholder="Search and add skills (e.g. AutoCAD, Site supervision, Estimation)"
            className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-text-tertiary"
          />
        </label>
        <div>
          <p className="mb-2 text-label-medium text-text-secondary">Your skills</p>
          <div className="flex flex-wrap gap-2">
            {props.skills.map((skill) => (
              <button
                key={skill}
                type="button"
                onClick={() => props.onRemove(skill)}
                className="inline-flex items-center gap-1 rounded-full bg-brand-primary px-3 py-1 text-label-medium text-text-on-brand"
              >
                {skill}
                <Icon name="close" className="size-3" />
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-2 text-label-medium text-text-secondary">Suggested skills</p>
          <div className="flex flex-wrap gap-2">
            {props.suggested.map((skill) => (
              <button
                key={skill}
                type="button"
                onClick={() => props.onAdd(skill)}
                className="inline-flex items-center gap-1 rounded-full border bg-surface-default px-3 py-1 text-label-medium text-text-secondary hover:bg-grey-50"
              >
                <Icon name="plus" className="size-3" />
                {skill}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4 rounded-md border bg-surface-default p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-heading-semibold text-text-primary">Education</h2>
            <p className="mt-1 text-body-sm-regular text-text-secondary">
              Add your educational background. Start with your highest qualification.
            </p>
          </div>
          {props.education.length > 0 && (
            <Button type="button" variant="outline" shape="rect" size="sm" onClick={props.onAddEducation}>
              + Add education
            </Button>
          )}
        </div>
        {props.education.length === 0 ? (
          <EmptyWell
            icon="graduation"
            title="No education added yet"
            body="Add your highest qualification so employers can see your background."
            action="Add education"
            onAction={props.onAddEducation}
          />
        ) : (
          props.education.map((entry) => (
            <article key={entry.id} className="flex items-center gap-4 rounded-md border p-4">
              <span className="flex size-10 items-center justify-center rounded-full bg-primary-50 text-brand-primary">
                <Icon name="file" className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-body-semibold text-text-primary">{entry.degree}</p>
                <p className="text-body-sm-regular text-text-secondary">{entry.institute}</p>
                <p className="text-label-medium text-text-tertiary">
                  {entry.startYear} – {entry.endYear} · {entry.mode}
                </p>
              </div>
              <button type="button" aria-label={`Edit ${entry.degree}`} onClick={() => props.onEditEducation(entry)} className="p-2">
                <Icon name="pencil" className="size-4 text-text-secondary" />
              </button>
              <button type="button" aria-label={`Delete ${entry.degree}`} onClick={() => props.onDeleteEducation(entry.id)} className="p-2">
                <Icon name="trash" className="size-4 text-text-secondary" />
              </button>
            </article>
          ))
        )}
      </section>

      <section className="flex flex-col gap-4 rounded-md border bg-surface-default p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-heading-semibold text-text-primary">
              Certifications <span className="text-body-sm-regular text-text-tertiary">(Optional)</span>
            </h2>
            <p className="mt-1 text-body-sm-regular text-text-secondary">Add certifications to show your additional skills.</p>
          </div>
          {props.certs.length > 0 && (
            <Button type="button" variant="outline" shape="rect" size="sm" onClick={props.onAddCert}>
              + Add certification
            </Button>
          )}
        </div>
        {props.certs.length === 0 ? (
          <EmptyWell
            icon="file"
            title="No certifications added yet"
            body="Add certifications to show your additional skills."
            action="Add certification"
            onAction={props.onAddCert}
          />
        ) : (
          props.certs.map((entry) => (
            <article key={entry.id} className="flex items-center gap-4 rounded-md border p-4">
              <span className="flex size-10 items-center justify-center rounded-full bg-primary-50 text-brand-primary">
                <Icon name="file" className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-body-semibold text-text-primary">{entry.name}</p>
                <p className="text-body-sm-regular text-text-secondary">{entry.issuer}</p>
                <p className="text-label-medium text-text-tertiary">
                  Issued {entry.issued} · {entry.expiry || "No expiry date"}
                </p>
              </div>
              <button type="button" aria-label={`Edit ${entry.name}`} onClick={() => props.onEditCert(entry)} className="p-2">
                <Icon name="pencil" className="size-4 text-text-secondary" />
              </button>
              <button type="button" aria-label={`Delete ${entry.name}`} onClick={() => props.onDeleteCert(entry.id)} className="p-2">
                <Icon name="trash" className="size-4 text-text-secondary" />
              </button>
            </article>
          ))
        )}
      </section>

      <section className="flex flex-col gap-4 rounded-md border bg-surface-default p-6">
        <div>
          <h2 className="text-heading-semibold text-text-primary">
            Professional Links <span className="text-body-sm-regular text-text-tertiary">(Optional)</span>
          </h2>
          <p className="mt-1 text-body-sm-regular text-text-secondary">
            Add links to your professional profiles, project work or personal website.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <LinkField label="LinkedIn profile" value={props.links.linkedin} icon="linkedin" onChange={(linkedin) => props.onLinks({ ...props.links, linkedin })} />
          <LinkField
            label="Portfolio / Website"
            value={props.links.portfolio}
            icon="link"
            placeholder="https://yourportfolio.com"
            onChange={(portfolio) => props.onLinks({ ...props.links, portfolio })}
          />
          <LinkField
            label="Other professional link"
            value={props.links.other}
            icon="globe"
            placeholder="e.g. project photos or drawings link"
            onChange={(other) => props.onLinks({ ...props.links, other })}
          />
        </div>
        <div className="h-px bg-border-default" />
        <div className="flex flex-wrap items-baseline gap-2">
          <h3 className="text-body-semibold text-text-primary">
            Resume <span className="text-error-default">*</span>
          </h3>
          <p className="text-label-medium text-text-tertiary">Upload your latest resume (PDF, DOC, DOCX · max 5 MB)</p>
        </div>
        {!props.showResume || props.upload === "error" ? (
          <EmptyWell
            title="No resume uploaded yet"
            body="Upload your resume so employers can learn more about you. PDF, DOC or DOCX · max 5 MB."
            action={props.upload === "error" ? "Try again" : "Add Resume"}
            icon="upload"
            error={
              props.upload === "error"
                ? "This file isn't supported. Please upload a PDF, DOC or DOCX under 5 MB."
                : undefined
            }
          />
        ) : (
          <div className="flex items-center gap-3 rounded-sm border p-3">
            <span className="flex size-10 items-center justify-center rounded-sm bg-primary-50 text-brand-primary">
              <Icon name="file" className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <a href={resumeSeed.name} className="text-body-sm-semibold text-brand-primary underline" onClick={(event) => event.preventDefault()}>
                {resumeSeed.name}
              </a>
              {props.upload === "uploading" ? (
                <>
                  <p className="text-label-medium text-text-secondary">Uploading... 80%</p>
                  <span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-grey-200">
                    <span className="block h-full w-4/5 rounded-full bg-brand-primary" />
                  </span>
                </>
              ) : (
                <p className="text-label-medium text-success-700">
                  {resumeSeed.sizeLabel} · {resumeSeed.uploadedLabel}
                </p>
              )}
            </div>
            {props.upload === "uploading" ? (
              <button type="button" className="text-body-sm-semibold text-brand-primary">
                Cancel
              </button>
            ) : (
              <button type="button" className="text-body-sm-semibold text-brand-primary">
                Replace
              </button>
            )}
          </div>
        )}
      </section>
      <div className="flex justify-end">
        <Button type="button" shape="rect">
          Save Changes
        </Button>
      </div>
    </div>
  );
}

function LinkField({
  label,
  value,
  icon,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  icon: "linkedin" | "link" | "globe";
  placeholder?: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-label-medium text-text-secondary">{label}</span>
      <span className={cn(inputClass, "flex items-center gap-2")}>
        {icon === "linkedin" ? (
          <span className="flex size-5 shrink-0 items-center justify-center rounded-xs bg-brand-primary text-label-medium text-text-on-brand">
            in
          </span>
        ) : (
          <Icon name={icon} className="size-4 text-text-tertiary" />
        )}
        <span className="h-6 w-px bg-border-default" />
        <input
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-text-tertiary"
        />
        {value && (
          <button type="button" aria-label={`Clear ${label}`} onClick={() => onChange("")}>
            <Icon name="close" className="size-4 text-text-tertiary" />
          </button>
        )}
      </span>
    </label>
  );
}

function ExperienceSection({
  items,
  onAdd,
  onEdit,
  onDelete,
}: {
  items: ExperienceEntry[];
  onAdd: () => void;
  onEdit: (entry: ExperienceEntry) => void;
  onDelete: (entry: ExperienceEntry) => void;
}) {
  return (
    <section className="flex flex-col gap-4 rounded-md border bg-surface-default p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-heading-semibold text-text-primary">Experience</h2>
          <p className="mt-1 text-body-sm-regular text-text-secondary">Add your work history to showcase your professional journey.</p>
        </div>
        {items.length > 0 && (
          <Button type="button" variant="outline" shape="rect" size="sm" onClick={onAdd}>
            + Add experience
          </Button>
        )}
      </div>
      {items.length > 0 && (
        <p className="flex items-center gap-2 text-body-sm-medium text-text-secondary">
          <Icon name="briefcase" className="size-4" />
          <span>
            <span className="text-text-primary">{items.length >= 3 ? experienceTotalThreeLabel : experienceTotalLabel}</span>
            {" · calculated from your work history"}
          </span>
        </p>
      )}
      {items.length === 0 ? (
        <EmptyWell
          icon="briefcase"
          title="No work experience added yet"
          body="Add your jobs and internships so employers can see your site and project experience."
          action="Add experience"
          onAction={onAdd}
        />
      ) : (
        items.map((entry, index) => (
          <article key={`${entry.id}-${index}`} className="flex gap-4 rounded-md border p-4">
            <span
              className={cn(
                "flex size-10 shrink-0 items-center justify-center rounded-md text-label-semibold",
                index % 2 === 0 ? "bg-primary-50 text-primary-700" : "bg-secondary-50 text-secondary-700",
              )}
            >
              {entry.initials}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-body-semibold text-text-primary">{entry.title}</p>
              <p className="text-body-sm-regular text-text-secondary">{entry.company}</p>
              <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-label-medium text-text-tertiary">
                <span className="inline-flex items-center gap-1">
                  <Icon name="calendar" className="size-3.5" />
                  {entry.start} – {entry.end}
                </span>
                {entry.location && (
                  <span className="inline-flex items-center gap-1">
                    <Icon name="pin" className="size-3.5" />
                    {entry.location}
                  </span>
                )}
                <span>{entry.type}</span>
                <span>{entry.arrangement}</span>
              </p>
              {entry.description && <p className="mt-2 text-body-sm-regular text-text-secondary">{entry.description}</p>}
            </div>
            <button type="button" aria-label={`Edit ${entry.title}`} onClick={() => onEdit(entry)} className="p-2">
              <Icon name="pencil" className="size-4 text-text-secondary" />
            </button>
            <button type="button" aria-label={`Delete ${entry.title}`} onClick={() => onDelete(entry)} className="p-2">
              <Icon name="trash" className="size-4 text-text-secondary" />
            </button>
          </article>
        ))
      )}
      <div className="flex justify-end">
        <Button type="button" shape="rect">
          Save Changes
        </Button>
      </div>
    </section>
  );
}

function PreferencesSection(props: {
  locations: string[];
  roles: string[];
  suggestionsLeft: readonly string[];
  roleSuggestions: readonly string[];
  onAddLocation: (value: string) => void;
  onRemoveLocation: (value: string) => void;
  onAddRole: (value: string) => void;
  onRemoveRole: (value: string) => void;
  employment: string;
  onEmployment: (value: string) => void;
  arrangement: string;
  onArrangement: (value: string) => void;
  salary: string;
  onSalary: (value: string) => void;
  salaryPeriod: string;
  onSalaryPeriod: (value: string) => void;
  notice: string;
  onNotice: (value: string) => void;
  relocate: boolean;
  onRelocate: (value: boolean) => void;
  showErrors: boolean;
  forceErrors: boolean;
}) {
  const locationError = props.forceErrors && props.locations.length === 0;
  const roleError = props.forceErrors && props.roles.length === 0;
  const noticeError = props.forceErrors && !props.notice;
  return (
    <section className="flex flex-col gap-6 rounded-md border bg-surface-default p-6">
      <div>
        <h2 className="text-heading-semibold text-text-primary">Job Preferences</h2>
        <p className="mt-1 text-body-sm-regular text-text-secondary">Help us show you the most relevant job opportunities.</p>
      </div>
      <div className="flex flex-col gap-3 rounded-md border p-4">
        <FieldLabel required>Preferred locations</FieldLabel>
        <span className={cn(inputClass, "flex items-center gap-2", locationError && "border-error-default")}>
          <Icon name="pin" className="size-4 text-text-tertiary" />
          <input
            placeholder="Search and add locations (e.g. Pandri, Shankar Nagar)"
            className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-text-tertiary"
            onKeyDown={(event) => {
              if (event.key !== "Enter") return;
              const value = event.currentTarget.value.trim();
              if (!value) return;
              props.onAddLocation(value);
              event.currentTarget.value = "";
            }}
          />
        </span>
        {locationError && <p className="text-label-medium text-error-default">Select at least one preferred location.</p>}
        <div className="flex flex-wrap gap-2">
          {props.locations.map((item) => (
            <button key={item} type="button" onClick={() => props.onRemoveLocation(item)} className="inline-flex items-center gap-1 rounded-full bg-brand-primary px-3 py-1 text-label-medium text-text-on-brand">
              {item}
              <Icon name="close" className="size-3" />
            </button>
          ))}
          {props.suggestionsLeft.map((item) => (
            <button key={item} type="button" onClick={() => props.onAddLocation(item)} className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-label-medium text-text-secondary">
              <Icon name="plus" className="size-3" />
              {item}
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-3 rounded-md border p-4">
        <FieldLabel required>Preferred roles</FieldLabel>
        <span className={cn(inputClass, "flex items-center gap-2", roleError && "border-error-default")}>
          <Icon name="search" className="size-4 text-text-tertiary" />
          <input
            placeholder="Search job titles or roles (e.g. Site Engineer, Civil Engineer)"
            className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-text-tertiary"
            onKeyDown={(event) => {
              if (event.key !== "Enter") return;
              const value = event.currentTarget.value.trim();
              if (!value) return;
              props.onAddRole(value);
              event.currentTarget.value = "";
            }}
          />
        </span>
        {roleError && <p className="text-label-medium text-error-default">Select at least one preferred role.</p>}
        <div className="flex flex-wrap gap-2">
          {props.roles.map((item) => (
            <button key={item} type="button" onClick={() => props.onRemoveRole(item)} className="inline-flex items-center gap-1 rounded-full bg-brand-primary px-3 py-1 text-label-medium text-text-on-brand">
              {item}
              <Icon name="close" className="size-3" />
            </button>
          ))}
          {props.roleSuggestions.map((item) => (
            <button key={item} type="button" onClick={() => props.onAddRole(item)} className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-label-medium text-text-secondary">
              <Icon name="plus" className="size-3" />
              {item}
            </button>
          ))}
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <ChipRow label="Employment type" options={["Full-time", "Part-time", "Internship", "Contract"]} value={props.employment} onChange={props.onEmployment} />
        <ChipRow label="Work arrangement" options={["On-site", "Hybrid", "Remote"]} value={props.arrangement} onChange={props.onArrangement} />
        <label className="flex flex-col gap-2">
          <FieldLabel optional>Expected salary</FieldLabel>
          <span className="flex gap-2">
            <span className={cn(inputClass, "flex items-center gap-2")}>
              <span className="text-text-tertiary">₹</span>
              <input
                value={props.salary}
                placeholder="e.g. 35,000"
                onChange={(event) => props.onSalary(event.target.value)}
                className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-text-tertiary"
              />
            </span>
            <select value={props.salaryPeriod} onChange={(event) => props.onSalaryPeriod(event.target.value)} className={cn(inputClass, "w-36")}>
              {salaryPeriodOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </span>
        </label>
        <label className="flex flex-col gap-2">
          <FieldLabel required>Notice period</FieldLabel>
          <select
            value={props.notice}
            onChange={(event) => props.onNotice(event.target.value)}
            className={cn(inputClass, noticeError && "border-error-default")}
          >
            <option value="">Select notice period</option>
            {noticePeriodOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
          {noticeError && <p className="text-label-medium text-error-default">Select your notice period.</p>}
        </label>
      </div>
      <label className="flex items-start gap-2">
        <input type="checkbox" checked={props.relocate} onChange={(event) => props.onRelocate(event.target.checked)} className="mt-0.5 size-5 accent-brand-primary" />
        <span>
          <span className="block text-body-sm-regular text-text-primary">Yes, I’m open to relocating for the right opportunity</span>
          <span className="block text-label-medium text-text-tertiary">This helps us show you opportunities in other locations as well.</span>
        </span>
      </label>
      <div className="flex gap-2 rounded-md bg-info-50 px-4 py-3 text-body-sm-regular text-text-secondary">
        <Icon name="alertCircle" className="mt-0.5 size-4 shrink-0 text-info-700" />
        <p>
          <span className="block text-body-sm-semibold text-text-primary">This helps us show you relevant jobs.</span>
          You can keep this information private. It will only be used to suggest opportunities.
        </p>
      </div>
      <div className="flex justify-end">
        <Button type="button" shape="rect">
          Save Changes
        </Button>
      </div>
    </section>
  );
}

function ChipRow({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-body-sm-medium text-text-primary">{label}</span>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const selected = option === value;
          return (
            <button
              key={option}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(option)}
              className={cn(
                "rounded-full px-3 py-2 text-label-medium",
                selected ? "bg-brand-primary text-text-on-brand" : "border bg-surface-default text-text-secondary",
              )}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
