"use client";

import { useState, type ReactNode } from "react";

import { Icon } from "@/components/icon";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import {
  degreeOptions,
  employmentTypeOptions,
  workArrangementOptions,
  type CertificationEntry,
  type EducationEntry,
  type ExperienceEntry,
} from "@/lib/seeker-design-seed";
import { cn } from "@/lib/utils";

const control =
  "flex h-11 w-full items-center gap-2 rounded-sm border bg-surface-default px-3 text-body-sm-regular outline-none focus-within:border-brand-primary focus-within:ring-3 focus-within:ring-brand-primary/20";

export function FieldLabel({
  children,
  required,
  optional,
}: {
  children: string;
  required?: boolean;
  optional?: boolean;
}) {
  return (
    <span className="flex items-baseline gap-1 text-body-sm-medium text-text-primary">
      {children}
      {required && <span className="text-error-default">*</span>}
      {optional && <span className="font-normal text-text-tertiary">(Optional)</span>}
    </span>
  );
}

function ErrorText({ children }: { children: string }) {
  return <p className="text-label-medium text-error-default">{children}</p>;
}

function ModalFrame({
  title,
  onClose,
  children,
  footer,
  width,
  banner,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer: ReactNode;
  width: string;
  banner?: string;
}) {
  return (
    <Dialog open onOpenChange={(next) => !next && onClose()} className={cn("md:w-[720px] md:gap-0 md:p-0", width)}>
      <div className="flex items-center gap-2 px-6 pt-6 pb-4">
        <h2 className="min-w-0 flex-1 text-heading-semibold text-text-primary">{title}</h2>
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="flex size-10 items-center justify-center rounded-full border bg-surface-default"
        >
          <Icon name="close" className="size-4" />
        </button>
      </div>
      <div className="h-px bg-border-default" />
      <div className="flex max-h-[640px] flex-col gap-4 overflow-y-auto p-6">
        {banner && <p className="text-body-sm-regular text-error-default">{banner}</p>}
        {children}
      </div>
      <div className="h-px bg-border-default" />
      <div className="flex justify-end px-6 py-4">{footer}</div>
    </Dialog>
  );
}

export function EducationDialog({
  initial,
  invalid,
  onClose,
  onSave,
}: {
  initial?: EducationEntry;
  invalid?: boolean;
  onClose: () => void;
  onSave: (entry: EducationEntry) => void;
}) {
  const [degree, setDegree] = useState(invalid ? "" : (initial?.degree ?? "Diploma in Civil Engineering"));
  const [institute, setInstitute] = useState(invalid ? "" : (initial?.institute ?? "Government Polytechnic, Raipur"));
  const [field, setField] = useState(invalid ? "" : (initial?.field ?? "Civil Engineering"));
  const [startYear, setStartYear] = useState(invalid ? "" : (initial?.startYear ?? "2016"));
  const [endYear, setEndYear] = useState(invalid ? "" : (initial?.endYear ?? "2019"));
  const [grade, setGrade] = useState(initial?.grade ?? "");
  const [showErrors, setShowErrors] = useState(Boolean(invalid));

  const save = () => {
    if (!degree || !institute.trim() || !startYear || !endYear) {
      setShowErrors(true);
      return;
    }
    onSave({
      id: initial?.id ?? `edu-${Date.now()}`,
      degree,
      institute: institute.trim(),
      field: field.trim(),
      startYear,
      endYear,
      mode: initial?.mode ?? "Full-time",
      grade: grade.trim(),
    });
  };

  return (
    <ModalFrame
      title={initial ? "Edit education" : "Add education"}
      onClose={onClose}
      banner={showErrors ? "Fill in the required fields to save." : undefined}
      width="md:w-[720px]"
      footer={
        <Button type="button" shape="rect" onClick={save}>
          Save education
        </Button>
      }
    >
      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2">
          <FieldLabel required>Degree</FieldLabel>
          <span className={cn(control, showErrors && !degree && "border-error-default")}>
            <select
              value={degree}
              onChange={(event) => setDegree(event.target.value)}
              className="min-w-0 flex-1 bg-transparent outline-none"
            >
              <option value="">Select degree</option>
              {degreeOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
            <Icon name="chevronDown" className="size-4 text-text-tertiary" />
          </span>
          {showErrors && !degree && <ErrorText>Select your degree.</ErrorText>}
        </label>
        <label className="flex flex-col gap-2">
          <FieldLabel required>Institute name</FieldLabel>
          <input
            value={institute}
            placeholder="Enter institute name"
            onChange={(event) => setInstitute(event.target.value)}
            className={cn(control, "placeholder:text-text-tertiary", showErrors && !institute.trim() && "border-error-default")}
          />
          {showErrors && !institute.trim() && <ErrorText>Enter the institute name.</ErrorText>}
        </label>
        <label className="flex flex-col gap-2">
          <FieldLabel>Field of study</FieldLabel>
          <input
            value={field}
            placeholder="e.g. Civil Engineering"
            onChange={(event) => setField(event.target.value)}
            className={cn(control, "placeholder:text-text-tertiary")}
          />
        </label>
        <label className="flex flex-col gap-2">
          <FieldLabel required>Start year</FieldLabel>
          <input
            value={startYear}
            placeholder="Select year"
            onChange={(event) => setStartYear(event.target.value)}
            className={cn(control, "placeholder:text-text-tertiary", showErrors && !startYear && "border-error-default")}
          />
          {showErrors && !startYear && <ErrorText>Select a start year.</ErrorText>}
        </label>
        <label className="flex flex-col gap-2">
          <FieldLabel required>End year</FieldLabel>
          <input
            value={endYear}
            placeholder="Select year"
            onChange={(event) => setEndYear(event.target.value)}
            className={cn(control, "placeholder:text-text-tertiary", showErrors && !endYear && "border-error-default")}
          />
          {showErrors && !endYear && <ErrorText>Select an end year.</ErrorText>}
        </label>
        <label className="flex flex-col gap-2">
          <FieldLabel optional>Grade / Percentage</FieldLabel>
          <input
            value={grade}
            placeholder="e.g. 8.5 CGPA or 75%"
            onChange={(event) => setGrade(event.target.value)}
            className={cn(control, "placeholder:text-text-tertiary")}
          />
        </label>
      </div>
    </ModalFrame>
  );
}

export function CertificationDialog({
  initial,
  onClose,
  onSave,
}: {
  initial?: CertificationEntry;
  onClose: () => void;
  onSave: (entry: CertificationEntry) => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [issuer, setIssuer] = useState(initial?.issuer ?? "");
  const [issued, setIssued] = useState(initial?.issued ?? "");
  const [expiry, setExpiry] = useState(initial?.expiry ?? "");
  const [error, setError] = useState(false);

  const save = () => {
    if (!name.trim() || !issuer.trim()) {
      setError(true);
      return;
    }
    onSave({
      id: initial?.id ?? `cert-${Date.now()}`,
      name: name.trim(),
      issuer: issuer.trim(),
      issued: issued.trim(),
      expiry: expiry.trim(),
    });
  };

  return (
    <ModalFrame
      title={initial ? "Edit certification" : "Add certification"}
      onClose={onClose}
      banner={error ? "Fill in the required fields to save." : undefined}
      width="md:w-[720px]"
      footer={
        <Button type="button" shape="rect" onClick={save}>
          Save certification
        </Button>
      }
    >
      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2">
          <FieldLabel required>Certification name</FieldLabel>
          <input
            value={name}
            placeholder="e.g. AutoCAD Certified Professional"
            onChange={(event) => setName(event.target.value)}
            className={cn(control, "placeholder:text-text-tertiary", error && !name.trim() && "border-error-default")}
          />
        </label>
        <label className="flex flex-col gap-2">
          <FieldLabel required>Issuing organization</FieldLabel>
          <input
            value={issuer}
            placeholder="e.g. Autodesk"
            onChange={(event) => setIssuer(event.target.value)}
            className={cn(control, "placeholder:text-text-tertiary", error && !issuer.trim() && "border-error-default")}
          />
        </label>
        <label className="flex flex-col gap-2">
          <FieldLabel>Issue date</FieldLabel>
          <input
            value={issued}
            placeholder="Select month and year"
            onChange={(event) => setIssued(event.target.value)}
            className={cn(control, "placeholder:text-text-tertiary")}
          />
        </label>
        <label className="flex flex-col gap-2">
          <FieldLabel optional>Expiry date</FieldLabel>
          <input
            value={expiry}
            placeholder="No expiry date"
            onChange={(event) => setExpiry(event.target.value)}
            className={cn(control, "placeholder:text-text-tertiary")}
          />
        </label>
      </div>
    </ModalFrame>
  );
}

const blankExperience: Omit<ExperienceEntry, "id" | "initials"> = {
  title: "",
  company: "",
  start: "",
  end: "",
  location: "",
  type: "",
  arrangement: "",
  description: "",
};

export function ExperienceDialog({
  initial,
  invalid,
  onClose,
  onSave,
}: {
  initial?: ExperienceEntry;
  invalid?: boolean;
  onClose: () => void;
  onSave: (entry: ExperienceEntry) => void;
}) {
  const [form, setForm] = useState(invalid ? blankExperience : {
    title: initial?.title ?? "",
    company: initial?.company ?? "",
    start: initial?.start ?? "",
    end: initial?.end ?? "",
    location: initial?.location ?? "",
    type: initial?.type ?? "",
    arrangement: initial?.arrangement ?? "",
    description: initial?.description ?? "",
  });
  const [current, setCurrent] = useState(initial?.end === "Present");
  const [showErrors, setShowErrors] = useState(Boolean(invalid));
  const set = (key: keyof typeof form, value: string) => setForm((currentForm) => ({ ...currentForm, [key]: value }));

  const save = () => {
    if (!form.title.trim() || !form.company.trim() || !form.type || !form.arrangement || !form.start || (!current && !form.end)) {
      setShowErrors(true);
      return;
    }
    const company = form.company.trim();
    onSave({
      id: initial?.id ?? `exp-${Date.now()}`,
      initials: initial?.initials ?? company.slice(0, 2).toUpperCase(),
      title: form.title.trim(),
      company,
      start: form.start.trim(),
      end: current ? "Present" : form.end.trim(),
      location: form.location.trim(),
      type: form.type,
      arrangement: form.arrangement,
      description: form.description.trim(),
    });
  };

  return (
    <ModalFrame
      title={initial ? "Edit experience" : "Add experience"}
      onClose={onClose}
      banner={showErrors ? "Fill in the required fields to save." : undefined}
      width="md:w-[720px]"
      footer={
        <Button type="button" shape="rect" onClick={save}>
          Save experience
        </Button>
      }
    >
      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2">
          <FieldLabel required>Job title</FieldLabel>
          <input
            value={form.title}
            placeholder="e.g. Site Engineer"
            onChange={(event) => set("title", event.target.value)}
            className={cn(control, "placeholder:text-text-tertiary", showErrors && !form.title.trim() && "border-error-default")}
          />
        </label>
        <label className="flex flex-col gap-2">
          <FieldLabel required>Company name</FieldLabel>
          <input
            value={form.company}
            placeholder="e.g. ABC Constructions Pvt. Ltd."
            onChange={(event) => set("company", event.target.value)}
            className={cn(control, "placeholder:text-text-tertiary", showErrors && !form.company.trim() && "border-error-default")}
          />
        </label>
        <label className="flex flex-col gap-2">
          <FieldLabel required>Employment type</FieldLabel>
          <span className={cn(control, showErrors && !form.type && "border-error-default")}>
            <select value={form.type} onChange={(event) => set("type", event.target.value)} className="min-w-0 flex-1 bg-transparent outline-none">
              <option value="">Select employment type</option>
              {employmentTypeOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </span>
        </label>
        <label className="flex flex-col gap-2">
          <FieldLabel required>Work mode</FieldLabel>
          <span className={cn(control, showErrors && !form.arrangement && "border-error-default")}>
            <select
              value={form.arrangement}
              onChange={(event) => set("arrangement", event.target.value)}
              className="min-w-0 flex-1 bg-transparent outline-none"
            >
              <option value="">Select work mode</option>
              {workArrangementOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </span>
        </label>
      </div>
      <label className="flex flex-col gap-2">
        <FieldLabel optional>Location</FieldLabel>
        <span className={control}>
          <Icon name="pin" className="size-4.5 text-text-tertiary" />
          <span className="h-6 w-px bg-border-default" />
          <input
            value={form.location}
            placeholder="e.g. Raipur, Chhattisgarh"
            onChange={(event) => set("location", event.target.value)}
            className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-text-tertiary"
          />
        </span>
      </label>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2">
          <FieldLabel required>Start date</FieldLabel>
          <input
            value={form.start}
            placeholder="Select month and year"
            onChange={(event) => set("start", event.target.value)}
            className={cn(control, "placeholder:text-text-tertiary", showErrors && !form.start && "border-error-default")}
          />
        </label>
        <label className="flex flex-col gap-2">
          <FieldLabel required>End date</FieldLabel>
          <input
            value={current ? "" : form.end}
            disabled={current}
            placeholder="Select month and year"
            onChange={(event) => set("end", event.target.value)}
            className={cn(control, "placeholder:text-text-tertiary disabled:bg-background-secondary", showErrors && !current && !form.end && "border-error-default")}
          />
        </label>
      </div>
      <label className="flex items-center gap-2 text-body-sm-regular text-text-primary">
        <input
          type="checkbox"
          checked={current}
          onChange={(event) => setCurrent(event.target.checked)}
          className="size-5 accent-brand-primary"
        />
        I currently work here
      </label>
      <label className="flex flex-col gap-2">
        <FieldLabel optional>Job description</FieldLabel>
        <textarea
          value={form.description}
          maxLength={1000}
          placeholder="Describe your role, key responsibilities and achievements."
          onChange={(event) => set("description", event.target.value)}
          className="h-24 w-full resize-none rounded-sm border bg-surface-default p-3 text-body-sm-regular outline-none placeholder:text-text-tertiary focus:border-brand-primary focus:ring-3 focus:ring-brand-primary/20"
        />
        <span className="text-right text-label-medium text-text-tertiary">{form.description.length}/1000</span>
      </label>
    </ModalFrame>
  );
}

export function ConfirmDialog({
  title,
  body,
  confirmLabel,
  onClose,
  onConfirm,
}: {
  title: string;
  body: string;
  confirmLabel: string;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <Dialog open onOpenChange={(next) => !next && onClose()} className="md:w-[480px]">
      <h2 className="text-heading-semibold text-text-primary">{title}</h2>
      <p className="text-body-sm-regular text-text-secondary">{body}</p>
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" shape="rect" onClick={onClose}>
          Cancel
        </Button>
        <Button type="button" variant="destructive" shape="rect" onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </div>
    </Dialog>
  );
}

export type PhotoPhase = "initial" | "selected" | "saving" | "success" | "error" | "remove";

export function PhotoDialog({
  phase,
  onClose,
  onPhase,
  onRemove,
}: {
  phase: PhotoPhase;
  onClose: () => void;
  onPhase: (phase: PhotoPhase) => void;
  onRemove: () => void;
}) {
  return (
    <Dialog open onOpenChange={(next) => !next && onClose()} className="items-center md:w-[440px]">
      <div className="flex w-full items-start gap-2">
        <div className="min-w-0 flex-1">
          <h2 className="text-heading-semibold text-text-primary">
            {phase === "remove" ? "Remove profile photo?" : "Change profile photo"}
          </h2>
          <p className="mt-1.5 text-body-sm-regular text-text-secondary">
            {phase === "remove"
              ? "Your photo will be removed. Employers will see your initial instead."
              : phase === "success"
                ? "Your profile photo was updated."
                : "Add a clear photo so employers can recognise you."}
          </p>
        </div>
        <button type="button" aria-label="Close" onClick={onClose} className="flex size-10 items-center justify-center rounded-full border">
          <Icon name="close" className="size-4" />
        </button>
      </div>
      {phase === "error" && (
        <p className="w-full rounded-sm bg-error-50 px-3 py-2 text-center text-label-regular text-error-default">
          Unsupported format. Upload a JPG or PNG.
        </p>
      )}
      {phase !== "remove" && (
        <span
          className={cn(
            "flex size-24 items-center justify-center rounded-full bg-grey-200 text-heading-semibold text-text-primary",
            phase === "error" && "border-[3px] border-error-default",
            phase === "selected" && "bg-primary-100 text-primary-700",
            phase === "success" && "bg-success-50 text-success-700",
          )}
        >
          {phase === "success" ? <Icon name="checkCircle" className="size-8" /> : "N"}
        </span>
      )}
      {phase !== "remove" && phase !== "success" && <p className="text-label-medium text-text-tertiary">JPG or PNG, max 5 MB</p>}
      <div className="flex w-full justify-center gap-3">
        {phase === "remove" ? (
          <>
            <Button type="button" variant="outline" shape="rect" onClick={onClose}>
              Cancel
            </Button>
            <Button type="button" variant="destructive" shape="rect" onClick={onRemove}>
              Remove
            </Button>
          </>
        ) : phase === "success" ? (
          <Button type="button" shape="rect" onClick={onClose}>
            Done
          </Button>
        ) : (
          <Button
            type="button"
            shape="rect"
            disabled={phase === "saving"}
            onClick={() => onPhase(phase === "selected" ? "saving" : phase === "saving" ? "success" : "selected")}
          >
            {phase === "saving" ? "Saving…" : "Upload photo"}
          </Button>
        )}
      </div>
    </Dialog>
  );
}
