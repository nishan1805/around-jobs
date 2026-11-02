"use client";

import { useId, useState } from "react";

import { Chip } from "@/components/jobs/chip";
import { ResumeDropzone } from "@/components/resume-upload";
import { Button } from "@/components/ui/button";
import { Dialog, DialogHeader, DialogNav, Field, TextInput } from "@/components/ui/dialog";
import { authActions, type User } from "@/lib/auth-store";
import { toggleValue } from "@/lib/job-filters";
import { employmentTypes, type EmploymentType } from "@/lib/jobs";

const preferredOptions: EmploymentType[] = ["FULL_TIME", "PART_TIME", "INTERN"];

/** Figma "Around / Jobs / Complete Profile Popup" (1953:19248). */
export function ProfileDialog({
  open,
  user,
  onDone,
  presetName = "",
}: {
  open: boolean;
  user: User | null;
  onDone: () => void;
  /** Filled value for the S10 preview. */
  presetName?: string;
}) {
  const [name, setName] = useState(user?.name ?? presetName);
  const [city, setCity] = useState(user?.city ?? "Raipur");
  const [types, setTypes] = useState<EmploymentType[]>(user?.preferredTypes.length ? user.preferredTypes : ["FULL_TIME"]);
  const [resumeName, setResumeName] = useState<string | null>(user?.resumeName ?? null);
  const [nameError, setNameError] = useState<string | null>(null);
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
          <ResumeDropzone fileName={resumeName} onPick={(file) => setResumeName(file.name)} />
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
