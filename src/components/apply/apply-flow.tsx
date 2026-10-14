"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useRef, useState, type ReactNode } from "react";

import { applicationPath } from "@/components/jobs/apply-button";
import { useAuth } from "@/components/auth/auth-provider";
import { FlowScreen, JobSummaryRow, StepProgress } from "@/components/flow-screen";
import { Icon } from "@/components/icon";
import { Chip } from "@/components/jobs/chip";
import { EmptyPage } from "@/components/page-header";
import { ResumeDropzone, ResumeFileCard } from "@/components/resume-upload";
import { Banner } from "@/components/ui/banner";
import { Button, buttonVariants } from "@/components/ui/button";
import { Field, TextInput } from "@/components/ui/dialog";
import { useHydrated } from "@/hooks/use-hydrated";
import { maskPhone } from "@/lib/auth-store";
import { jobPath, type Job } from "@/lib/jobs";
import { activeApplicationFor, seekerActions, useSeeker, type Submission } from "@/lib/seeker-store";
import { cn } from "@/lib/utils";

const steps = ["Details", "Experience", "Resume", "Cover letter", "Review"] as const;
const COVER_MAX = 600;
const SUBMIT_DELAY_MS = 1400;
const educationOptions = ["Class 10", "Class 12", "Diploma / ITI", "Graduate", "Postgraduate"];

type Phase = "form" | "submitting" | "sent";
type Errors = Partial<Record<"name" | "email" | "location" | "experience", string>>;

const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

function validate(step: number, form: Submission): Errors {
  const errors: Errors = {};
  if (step === 0) {
    if (!form.name.trim()) errors.name = "Enter your full name.";
    if (form.email.trim() && !isEmail(form.email.trim())) errors.email = "Enter an email like name@example.com.";
    if (!form.location.trim()) errors.location = "Enter the area you live in.";
  }
  if (step === 1 && !form.experience.trim()) errors.experience = "Enter your total experience, or Fresher.";
  return errors;
}

const selectClass =
  "w-full appearance-none rounded-sm border bg-surface-default p-3 pr-10 text-body-sm-regular text-text-primary focus-visible:border-brand-primary focus-visible:ring-3 focus-visible:ring-brand-primary/20 focus-visible:outline-none";

/** Figma mobile M08–M14: five-step apply flow, then Submitting and Application sent. */
export function ApplyFlow({ job }: { job: Job }) {
  const hydrated = useHydrated();
  const router = useRouter();
  const { user, openLogin } = useAuth();
  const seeker = useSeeker();
  const existing = activeApplicationFor(seeker, job.slug);

  const [phase, setPhase] = useState<Phase>("form");
  const [step, setStep] = useState(0);
  const [returnToReview, setReturnToReview] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [form, setForm] = useState<Submission | null>(null);
  const [skillDraft, setSkillDraft] = useState<string | null>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const ids = useId();

  const leave = () => (window.history.length > 1 ? router.back() : router.push(jobPath(job)));

  if (!hydrated) {
    return (
      <FlowScreen active="jobs" title="Apply" back={jobPath(job)}>
        <div aria-busy className="flex flex-col gap-4">
          <span className="sr-only">Loading</span>
          <div className="h-12 animate-pulse rounded-sm bg-grey-100" />
          <div className="h-12 animate-pulse rounded-sm bg-grey-100" />
          <div className="h-12 animate-pulse rounded-sm bg-grey-100" />
        </div>
      </FlowScreen>
    );
  }

  if (!user) {
    return (
      <FlowScreen active="jobs" title="Apply" back={jobPath(job)}>
        <JobSummaryRow job={job} />
        <EmptyPage
          icon="user"
          title="Log in to apply"
          body="Use your mobile number. Your details are saved for the next job."
          action={<Button onClick={openLogin}>Log in with mobile number</Button>}
        />
      </FlowScreen>
    );
  }

  if (phase !== "sent" && (existing || job.status !== "open")) {
    return (
      <FlowScreen active="jobs" title="Apply" back={jobPath(job)}>
        <JobSummaryRow job={job} />
        <EmptyPage
          icon={existing ? "checkCircle" : "alertCircle"}
          title={existing ? "You've already applied" : "This job isn't taking applications"}
          body={
            existing
              ? "Track the status of this application in My applications."
              : "The employer has stopped hiring for this role. Similar jobs near you are on the map."
          }
          action={
            <Link
              href={existing ? applicationPath(job.slug) : "/"}
              className={buttonVariants({ variant: "default" })}
            >
              {existing ? "View application" : "Find similar jobs"}
            </Link>
          }
        />
      </FlowScreen>
    );
  }

  const data: Submission = form ?? {
    name: user.name ?? "",
    phone: user.phone,
    email: "",
    location: user.city ?? "",
    latestTitle: "",
    latestCompany: "",
    experience: "",
    education: "Class 12",
    skills: [],
    resumeName: user.resumeName,
    resumeKb: user.resumeName ? 240 : null,
    coverNote: "",
  };
  const update = (patch: Partial<Submission>) => {
    setForm({ ...data, ...patch });
    setErrors((current) => {
      const next = { ...current };
      for (const key of Object.keys(patch)) delete next[key as keyof Errors];
      return next;
    });
  };

  const goTo = (next: number) => {
    setStep(next);
    setErrors({});
    bodyRef.current?.scrollTo({ top: 0 });
    bodyRef.current?.focus({ preventScroll: true });
  };

  const next = () => {
    const found = validate(step, data);
    if (Object.keys(found).length) {
      setErrors(found);
      return;
    }
    if (returnToReview) {
      setReturnToReview(false);
      goTo(steps.length - 1);
    } else goTo(step + 1);
  };

  const submit = async () => {
    setSubmitError(null);
    setPhase("submitting");
    await new Promise((resolve) => setTimeout(resolve, SUBMIT_DELAY_MS));
    if (!navigator.onLine) {
      setPhase("form");
      setSubmitError("We couldn't send your application. Check your internet connection and try again.");
      return;
    }
    seekerActions.apply(job.slug, { ...data, name: data.name.trim(), email: data.email.trim() });
    setPhase("sent");
  };

  if (phase === "sent") {
    return (
      <FlowScreen
        active="applications"
        className="justify-center md:py-10"
        footer={
          <>
            <Link href={applicationPath(job.slug)} className={cn(buttonVariants({ shape: "rect" }), "w-full")}>
              View my applications
            </Link>
            <Link href="/" className={cn(buttonVariants({ variant: "outline", shape: "rect" }), "w-full")}>
              Back to jobs
            </Link>
          </>
        }
      >
        <div role="status" className="flex flex-col items-center gap-2 text-center">
          <span className="mb-2 flex size-16 items-center justify-center rounded-full bg-success-50 text-text-primary">
            <Icon name="checkCircle" className="size-6" />
          </span>
          <h1 className="text-heading-semibold text-text-primary">Application sent</h1>
          <p className="text-body-sm-regular text-text-secondary">
            {job.title} · {job.company.name}
          </p>
        </div>
        <section className="flex flex-col gap-3 pt-4">
          <h2 className="text-body-semibold text-text-primary">What happens next</h2>
          <ol className="flex list-inside list-decimal flex-col gap-3 text-body-sm-regular text-text-secondary">
            <li>The employer reviews your application, usually within 3–5 days.</li>
            <li>You&apos;ll get a notification when your status changes.</li>
            <li>Track it in My applications.</li>
          </ol>
        </section>
      </FlowScreen>
    );
  }

  const submitting = phase === "submitting";
  const isReview = step === steps.length - 1;
  const fieldError = (key: keyof Errors) => (errors[key] ? { "aria-invalid": true, "aria-describedby": `${ids}-${key}-error` } : {});

  const footer = isReview ? (
    <Button shape="rect" className="w-full disabled:opacity-100" disabled={submitting} onClick={() => void submit()}>
      {submitting ? (
        <>
          <Icon name="spinner" className="size-4 animate-spin" />
          Submitting…
        </>
      ) : (
        "Submit application"
      )}
    </Button>
  ) : (
    <>
      <Button shape="rect" className="w-full" onClick={next}>
        {returnToReview ? "Save and review" : "Continue"}
      </Button>
      {step === 3 && !returnToReview && (
        <Button
          variant="outline"
          shape="rect"
          className="w-full"
          onClick={() => {
            update({ coverNote: "" });
            goTo(step + 1);
          }}
        >
          Skip
        </Button>
      )}
    </>
  );

  return (
    <FlowScreen
      active="jobs"
      title={isReview ? "Review" : "Apply"}
      backDisabled={submitting}
      back={step === 0 ? leave : () => goTo(returnToReview ? steps.length - 1 : step - 1)}
      backLabel={step === 0 ? "Back to job" : "Previous step"}
      meta={<StepProgress step={step + 1} total={steps.length} label={steps[step]} />}
      footer={footer}
    >
      <div ref={bodyRef} tabIndex={-1} className="flex flex-col gap-4 outline-none" aria-label={`Step ${step + 1}: ${steps[step]}`}>
        {(step === 0 || isReview) && <JobSummaryRow job={job} />}

        {submitError && <Banner tone="error">{submitError}</Banner>}

        {step === 0 && (
          <>
            <Field id={`${ids}-name`} label="Full name" error={errors.name}>
              <TextInput
                id={`${ids}-name`}
                autoComplete="name"
                placeholder="Rahul Sharma (Sample)"
                value={data.name}
                onChange={(event) => update({ name: event.target.value })}
                {...fieldError("name")}
              />
            </Field>
            <Field id={`${ids}-phone`} label="Phone" helper="The number you logged in with">
              <TextInput id={`${ids}-phone`} value={maskPhone(data.phone)} readOnly className="bg-background-secondary text-text-secondary" />
            </Field>
            <Field id={`${ids}-email`} label="Email (Optional)" error={errors.email}>
              <TextInput
                id={`${ids}-email`}
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={data.email}
                onChange={(event) => update({ email: event.target.value })}
                {...fieldError("email")}
              />
            </Field>
            <Field id={`${ids}-location`} label="Your location" error={errors.location}>
              <TextInput
                id={`${ids}-location`}
                autoComplete="address-level3"
                placeholder="Area, city"
                value={data.location}
                onChange={(event) => update({ location: event.target.value })}
                {...fieldError("location")}
              />
            </Field>
          </>
        )}

        {step === 1 && (
          <>
            <Field id={`${ids}-title`} label="Latest job title">
              <TextInput
                id={`${ids}-title`}
                autoComplete="organization-title"
                placeholder="e.g. Sales Assistant"
                value={data.latestTitle}
                onChange={(event) => update({ latestTitle: event.target.value })}
              />
            </Field>
            <Field id={`${ids}-company`} label="Company">
              <TextInput
                id={`${ids}-company`}
                autoComplete="organization"
                placeholder="Where you work or last worked"
                value={data.latestCompany}
                onChange={(event) => update({ latestCompany: event.target.value })}
              />
            </Field>
            <Field id={`${ids}-experience`} label="Total experience" error={errors.experience}>
              <TextInput
                id={`${ids}-experience`}
                placeholder="e.g. 2 years, or Fresher"
                value={data.experience}
                onChange={(event) => update({ experience: event.target.value })}
                {...fieldError("experience")}
              />
            </Field>
            <Field id={`${ids}-education`} label="Highest education">
              <div className="relative">
                <select
                  id={`${ids}-education`}
                  value={data.education}
                  onChange={(event) => update({ education: event.target.value })}
                  className={selectClass}
                >
                  {educationOptions.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
                <Icon name="chevronDown" className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-text-tertiary" />
              </div>
            </Field>
            <SkillsPicker
              labelId={`${ids}-skills`}
              options={[...new Set([...job.skills, ...data.skills])]}
              selected={data.skills}
              onChange={(skills) => update({ skills })}
              draft={skillDraft}
              onDraftChange={setSkillDraft}
            />
          </>
        )}

        {step === 2 && (
          <>
            <p className="text-body-sm-regular text-text-secondary">Upload your resume or use the one saved in your profile.</p>
            {data.resumeName ? (
              <ResumeFileCard
                name={data.resumeName}
                kb={data.resumeKb}
                action={{ label: "Remove", onClick: () => update({ resumeName: null, resumeKb: null }) }}
              />
            ) : (
              <ResumeDropzone fileName={null} onPick={(file) => update({ resumeName: file.name, resumeKb: file.kb })} />
            )}
            <p className="text-label-medium text-text-tertiary">
              {data.resumeName ? "Employers see your resume only after you apply." : "Optional. Applications with a resume get more replies."}
            </p>
          </>
        )}

        {step === 3 && (
          <>
            <label htmlFor={`${ids}-cover`} className="text-body-sm-regular text-text-secondary">
              Optional. A few lines on why you fit this role.
            </label>
            <textarea
              id={`${ids}-cover`}
              rows={7}
              maxLength={COVER_MAX}
              value={data.coverNote}
              placeholder="I have 2 years of billing experience and can work morning shifts. (Sample)"
              aria-describedby={`${ids}-cover-count`}
              onChange={(event) => update({ coverNote: event.target.value })}
              className="w-full resize-none rounded-md border bg-surface-default p-4 text-body-sm-regular text-text-primary placeholder:text-text-tertiary focus-visible:border-brand-primary focus-visible:ring-3 focus-visible:ring-brand-primary/20 focus-visible:outline-none"
            />
            <p id={`${ids}-cover-count`} className="text-label-medium text-text-tertiary">
              {data.coverNote.length} / {COVER_MAX}
            </p>
          </>
        )}

        {isReview && submitting && (
          <p role="status" className="flex items-center gap-3 text-body-sm-regular text-text-secondary">
            <Icon name="spinner" className="size-5 animate-spin text-brand-primary" />
            Sending your application… Don&apos;t close the app.
          </p>
        )}

        {isReview && !submitting && (
          <>
            <ReviewSection title="Your details">
              <ReviewRow label="Name" value={data.name.trim()} onEdit={() => editStep(0)} />
              <ReviewRow label="Phone" value={maskPhone(data.phone)} onEdit={() => editStep(0)} />
              <ReviewRow
                label="Experience"
                value={[data.experience.trim(), data.latestTitle.trim()].filter(Boolean).join(" · ")}
                onEdit={() => editStep(1)}
              />
            </ReviewSection>
            <ReviewSection title="Resume & note">
              <ReviewRow label="Resume" value={data.resumeName ?? "Not added"} onEdit={() => editStep(2)} />
              <ReviewRow label="Cover note" value={data.coverNote.trim() ? "Added" : "Not added"} onEdit={() => editStep(3)} />
            </ReviewSection>
          </>
        )}
      </div>
    </FlowScreen>
  );

  function editStep(target: number) {
    setReturnToReview(true);
    goTo(target);
  }
}

function SkillsPicker({
  labelId,
  options,
  selected,
  onChange,
  draft,
  onDraftChange,
}: {
  labelId: string;
  options: string[];
  selected: string[];
  onChange: (skills: string[]) => void;
  draft: string | null;
  onDraftChange: (draft: string | null) => void;
}) {
  const toggle = (skill: string) =>
    onChange(selected.includes(skill) ? selected.filter((item) => item !== skill) : [...selected, skill]);
  const addDraft = () => {
    const skill = draft?.trim();
    if (skill && !selected.includes(skill)) onChange([...selected, skill]);
    onDraftChange(null);
  };

  return (
    <div role="group" aria-labelledby={labelId} className="flex flex-col gap-2">
      <span id={labelId} className="text-label-medium text-text-secondary">
        Skills
      </span>
      <div className="flex flex-wrap gap-2">
        {options.map((skill) => (
          <Chip key={skill} soft selected={selected.includes(skill)} onClick={() => toggle(skill)} className="px-3 py-2 text-body-sm-medium">
            {skill}
          </Chip>
        ))}
        {draft === null ? (
          <Chip onClick={() => onDraftChange("")} className="px-3 py-2 text-body-sm-medium text-text-primary">
            + Add
          </Chip>
        ) : (
          <input
            autoFocus
            aria-label="New skill"
            value={draft}
            placeholder="Type a skill"
            onChange={(event) => onDraftChange(event.target.value)}
            onBlur={addDraft}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                addDraft();
              }
              if (event.key === "Escape") onDraftChange(null);
            }}
            className="h-9 w-36 rounded-full border border-brand-primary bg-surface-default px-3 text-body-sm-regular text-text-primary focus-visible:ring-3 focus-visible:ring-brand-primary/20 focus-visible:outline-none"
          />
        )}
      </div>
    </div>
  );
}

function ReviewSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-body-semibold text-text-primary">{title}</h2>
      <dl className="flex flex-col gap-3">{children}</dl>
    </section>
  );
}

function ReviewRow({ label, value, onEdit }: { label: string; value: string; onEdit: () => void }) {
  return (
    <div className="flex items-start gap-3">
      <dt className="w-29 shrink-0 pt-0.5 text-label-medium text-text-secondary">{label}</dt>
      <dd className="min-w-0 flex-1 truncate text-body-sm-regular text-text-primary">{value || "Not added"}</dd>
      <button
        type="button"
        onClick={onEdit}
        aria-label={`Edit ${label.toLowerCase()}`}
        className="shrink-0 rounded-xs text-body-sm-semibold text-brand-primary hover:underline focus-visible:ring-3 focus-visible:ring-brand-primary/40 focus-visible:outline-none"
      >
        Edit
      </button>
    </div>
  );
}
