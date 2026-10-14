"use client";

import { useId, useRef, useState } from "react";

import { Icon } from "@/components/icon";
import { Chip } from "@/components/jobs/chip";
import { Button } from "@/components/ui/button";
import { Dialog, DialogHeader, DialogNav, Field, TextInput } from "@/components/ui/dialog";
import { authActions, type User } from "@/lib/auth-store";
import { toggleValue } from "@/lib/job-filters";
import { employmentTypes, type EmploymentType } from "@/lib/jobs";

const preferredOptions: EmploymentType[] = ["FULL_TIME", "PART_TIME", "INTERN"];
const MAX_RESUME_BYTES = 5 * 1024 * 1024;
const RESUME_TYPES = ".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";

/** Figma "Around / Jobs / Complete Profile Popup" (1953:19248). */
export function ProfileDialog({
  open,
  user,
  onDone,
}: {
  open: boolean;
  user: User | null;
  onDone: () => void;
}) {
  const [name, setName] = useState(user?.name ?? "");
  const [city, setCity] = useState(user?.city ?? "Raipur");
  const [types, setTypes] = useState<EmploymentType[]>(user?.preferredTypes.length ? user.preferredTypes : ["FULL_TIME"]);
  const [resumeName, setResumeName] = useState<string | null>(user?.resumeName ?? null);
  const [nameError, setNameError] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const groupId = useId();

  const skip = () => {
    authActions.updateProfile({ profileSkipped: true });
    onDone();
  };

  const save = () => {
    if (!name.trim()) {
      setNameError("Enter your full name.");
      return;
    }
    authActions.updateProfile({ name: name.trim(), city: city.trim() || null, preferredTypes: types, resumeName });
    onDone();
  };

  return (
    <Dialog screen open={open} onOpenChange={(next) => !next && skip()}>
      <DialogNav onBack={skip} onClose={skip} />
      <form
        className="flex flex-col gap-5"
        onSubmit={(event) => {
          event.preventDefault();
          save();
        }}
      >
        <DialogHeader title="Complete your profile" description="Add a few details so employers can contact you." onClose={skip} />
        <Field id="profile-name" label="Full name" error={nameError}>
          <TextInput
            id="profile-name"
            autoComplete="name"
            autoFocus
            placeholder="Rahul Sharma (Sample)"
            value={name}
            aria-invalid={nameError ? true : undefined}
            aria-describedby={nameError ? "profile-name-error" : undefined}
            onChange={(event) => {
              setName(event.target.value);
              if (nameError) setNameError(null);
            }}
          />
        </Field>
        <Field id="profile-city" label="City">
          <TextInput
            id="profile-city"
            autoComplete="address-level2"
            value={city}
            onChange={(event) => setCity(event.target.value)}
          />
        </Field>
        <div role="group" aria-labelledby={groupId} className="flex flex-col gap-2">
          <span id={groupId} className="text-label-medium text-text-secondary">
            Preferred job type
          </span>
          <div className="flex flex-wrap gap-2">
            {preferredOptions.map((value) => (
              <Chip key={value} selected={types.includes(value)} onClick={() => setTypes((current) => toggleValue(current, value))}>
                {employmentTypes[value]}
              </Chip>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-label-medium text-text-secondary">Resume (Optional)</span>
          <div className="flex flex-col items-center gap-2 rounded-md border border-dashed bg-background-secondary p-6 text-center">
            <span className="flex rounded-full bg-primary-50 p-3 text-brand-primary">
              <Icon name="upload" className="size-5" />
            </span>
            <p className="text-body-semibold text-text-primary">{resumeName ?? "Upload your resume"}</p>
            <p className="text-label-medium text-text-tertiary" aria-live="polite">
              {fileError ?? (resumeName ? "Stays on this device in the Sample app" : "PDF or DOC, up to 5 MB")}
            </p>
            <input
              ref={fileRef}
              type="file"
              accept={RESUME_TYPES}
              className="sr-only"
              tabIndex={-1}
              aria-hidden
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (!file) return;
                if (file.size > MAX_RESUME_BYTES) {
                  setFileError("That file is over 5 MB. Choose a smaller one.");
                  return;
                }
                setFileError(null);
                setResumeName(file.name);
              }}
            />
            <Button type="button" variant="outline" shape="rect" onClick={() => fileRef.current?.click()}>
              {resumeName ? "Replace file" : "Choose file"}
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button type="button" onClick={skip} className="text-body-sm-semibold text-brand-primary hover:underline">
            Skip for now
          </button>
          <Button type="submit" shape="rect" className="flex-1">
            Continue
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
