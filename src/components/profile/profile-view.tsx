"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";

import { useAuth } from "@/components/auth/auth-provider";
import { Icon } from "@/components/icon";
import { Chip } from "@/components/jobs/chip";
import { PageHeader } from "@/components/page-header";
import { ResumeDropzone, ResumeFileCard } from "@/components/resume-upload";
import { SeekerPage } from "@/components/seeker-page";
import { Button, buttonVariants } from "@/components/ui/button";
import { Dialog, DialogHeader } from "@/components/ui/dialog";
import { authActions, maskPhone, type User } from "@/lib/auth-store";
import { toggleValue } from "@/lib/job-filters";
import { categories, employmentTypes, type Category, type EmploymentType } from "@/lib/jobs";
import { cn } from "@/lib/utils";

const NOTIFICATION_KEY = "around-jobs:notifications:v1";
const preferredOptions: EmploymentType[] = ["FULL_TIME", "PART_TIME", "INTERN"];

type NotificationPrefs = { jobsNearby: boolean; applicationUpdates: boolean };

const defaultNotifications: NotificationPrefs = { jobsNearby: true, applicationUpdates: true };

function readNotifications(): NotificationPrefs {
  try {
    const raw = window.localStorage.getItem(NOTIFICATION_KEY);
    return raw ? { ...defaultNotifications, ...(JSON.parse(raw) as Partial<NotificationPrefs>) } : defaultNotifications;
  } catch {
    return defaultNotifications;
  }
}

function preferencesLine(user: User) {
  const types = user.preferredTypes.map((type) => employmentTypes[type]).join(", ");
  const chosen = (user.preferredCategories ?? []).join(", ");
  return [types, chosen].filter(Boolean).join(" · ") || "Not set";
}

/** Figma mobile M20. The same page sits in the desktop shell; Figma has no desktop profile. */
export function ProfileView() {
  return (
    <SeekerPage
      active="profile"
      canvas="plain"
      title="Profile"
      intro="Your name, resume and job preferences."
      loginIcon="user"
      loginTitle="Log in to see your profile"
      loginBody="Your profile is saved to your mobile number."
      skeleton={<ProfileSkeleton />}
    >
      <ProfileContent />
    </SeekerPage>
  );
}

function ProfileSkeleton() {
  return (
    <div aria-hidden className="flex flex-col gap-4">
      <span className="size-16 animate-pulse rounded-full bg-grey-100" />
      <span className="h-11 animate-pulse rounded-sm bg-grey-100" />
      <span className="h-14 animate-pulse rounded-sm bg-grey-100" />
      <span className="h-14 animate-pulse rounded-sm bg-grey-100" />
    </div>
  );
}

function ProfileContent() {
  const { user, editProfile } = useAuth();
  const [resumeOpen, setResumeOpen] = useState(false);
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  if (!user) return null;

  const notifications = readNotifications();
  const notificationsOn = notifications.jobsNearby || notifications.applicationUpdates;

  return (
    <div className="flex flex-col gap-5 md:mx-auto md:w-full md:max-w-140">
      <PageHeader title="Profile" />

      <div className="flex items-center gap-4">
        <span aria-hidden className="size-16 shrink-0 rounded-full bg-grey-200" />
        <div className="flex min-w-0 flex-col gap-0.5">
          <p className="truncate text-subheading-semibold text-text-primary">{user.name ?? "Your account"}</p>
          <p className="truncate text-body-sm-regular text-text-secondary">
            {maskPhone(user.phone)}
            {user.city ? ` · ${user.city}` : ""}
          </p>
        </div>
      </div>

      <Button variant="outline" shape="rect" className="w-full" onClick={editProfile}>
        Edit profile
      </Button>

      <div className="flex flex-col">
        <Row
          title="Resume"
          detail={user.resumeName ? `${user.resumeName} · saved on this device` : "Not added"}
          onClick={() => setResumeOpen(true)}
        />
        <Row title="Job preferences" detail={preferencesLine(user)} onClick={() => setPreferencesOpen(true)} />
        <Row title="Notifications" detail={notificationsOn ? "On" : "Off"} onClick={() => setNotificationsOpen(true)} />
        <Row title="Language" detail="English" onClick={() => setLanguageOpen(true)} />
        <Row title="Help & support" onClick={() => setHelpOpen(true)} />
      </div>

      <div className="flex flex-col items-start gap-3 rounded-xl bg-primary-50 p-4">
        <div className="flex flex-col gap-1">
          <p className="text-body-semibold text-text-primary">Are you hiring?</p>
          <p className="text-body-sm-regular text-text-secondary">Post a job and reach job seekers near your business.</p>
        </div>
        <Link href="/post-a-job" className={cn(buttonVariants({ shape: "rect" }), "self-start")}>
          Post a job
        </Link>
      </div>

      <button
        type="button"
        onClick={() => authActions.logout()}
        className="flex w-full items-center justify-between border-b py-4 text-left text-body-semibold text-text-primary outline-none focus-visible:ring-3 focus-visible:ring-brand-primary/40"
      >
        Log out
        <Icon name="chevronRight" className="size-5 text-text-tertiary" />
      </button>

      {resumeOpen && <ResumeDialog user={user} onClose={() => setResumeOpen(false)} />}
      {preferencesOpen && <PreferencesDialog user={user} onClose={() => setPreferencesOpen(false)} />}
      {notificationsOpen && <NotificationsDialog onClose={() => setNotificationsOpen(false)} />}
      {languageOpen && <LanguageDialog onClose={() => setLanguageOpen(false)} />}
      {helpOpen && <HelpDialog onClose={() => setHelpOpen(false)} />}
    </div>
  );
}

function Row({ title, detail, onClick }: { title: string; detail?: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 border-b py-4 text-left outline-none focus-visible:ring-3 focus-visible:ring-brand-primary/40"
    >
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-body-semibold text-text-primary">{title}</span>
        {detail && <span className="truncate text-body-sm-regular text-text-secondary">{detail}</span>}
      </span>
      <Icon name="chevronRight" className="size-5 shrink-0 text-text-tertiary" />
    </button>
  );
}

function ResumeDialog({ user, onClose }: { user: User; onClose: () => void }) {
  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogHeader
        title="Resume"
        description="PDF or DOC, up to 5 MB. In the Sample app it stays on this device."
        onClose={onClose}
      />
      {user.resumeName ? (
        <ResumeFileCard
          name={user.resumeName}
          kb={240}
          action={{ label: "Remove", onClick: () => authActions.updateProfile({ resumeName: null }) }}
        />
      ) : (
        <ResumeDropzone fileName={null} onPick={(file) => authActions.updateProfile({ resumeName: file.name })} />
      )}
      <Button shape="rect" className="w-full" onClick={onClose}>
        Done
      </Button>
    </Dialog>
  );
}

function PreferencesDialog({ user, onClose }: { user: User; onClose: () => void }) {
  const [types, setTypes] = useState<EmploymentType[]>(user.preferredTypes);
  const [chosen, setChosen] = useState<Category[]>(user.preferredCategories ?? []);

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <form
        className="flex flex-col gap-5"
        onSubmit={(event) => {
          event.preventDefault();
          authActions.updateProfile({ preferredTypes: types, preferredCategories: chosen });
          onClose();
        }}
      >
        <DialogHeader
          title="Job preferences"
          description="Used to highlight jobs that fit you. Sample setting, saved on this device."
          onClose={onClose}
        />
        <ChipGroup label="Job type">
          {preferredOptions.map((value) => (
            <Chip key={value} soft selected={types.includes(value)} onClick={() => setTypes((current) => toggleValue(current, value))}>
              {employmentTypes[value]}
            </Chip>
          ))}
        </ChipGroup>
        <ChipGroup label="Categories">
          {categories.map((value) => (
            <Chip key={value} soft selected={chosen.includes(value)} onClick={() => setChosen((current) => toggleValue(current, value))}>
              {value}
            </Chip>
          ))}
        </ChipGroup>
        <Button type="submit" shape="rect" className="w-full">
          Save
        </Button>
      </form>
    </Dialog>
  );
}

function ChipGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-label-medium text-text-secondary">{label}</span>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function NotificationsDialog({ onClose }: { onClose: () => void }) {
  const [prefs, setPrefs] = useState(readNotifications);

  const toggle = (key: keyof NotificationPrefs) => {
    const next = { ...prefs, [key]: !prefs[key] };
    setPrefs(next);
    try {
      window.localStorage.setItem(NOTIFICATION_KEY, JSON.stringify(next));
    } catch {
      // The switch still updates on screen for this visit.
    }
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogHeader
        title="Notifications"
        description="Sample switches. Nothing is sent from this device."
        onClose={onClose}
      />
      <div className="flex flex-col">
        <Switch label="New jobs near you" checked={prefs.jobsNearby} onChange={() => toggle("jobsNearby")} />
        <Switch label="Application updates" checked={prefs.applicationUpdates} onChange={() => toggle("applicationUpdates")} />
      </div>
      <Button shape="rect" className="w-full" onClick={onClose}>
        Done
      </Button>
    </Dialog>
  );
}

function Switch({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className="flex w-full items-center justify-between gap-4 border-b py-3 text-left outline-none focus-visible:ring-3 focus-visible:ring-brand-primary/40"
    >
      <span className="text-body-sm-medium text-text-primary">{label}</span>
      <span className={cn("flex h-6 w-11 shrink-0 rounded-full p-0.5", checked ? "bg-brand-primary" : "bg-grey-300")}>
        <span className={cn("size-5 rounded-full bg-surface-default transition-transform", checked && "translate-x-5")} />
      </span>
    </button>
  );
}

function LanguageDialog({ onClose }: { onClose: () => void }) {
  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogHeader title="Language" description="More languages are coming. (Sample)" onClose={onClose} />
      <p className="rounded-sm border bg-primary-50 px-4 py-3 text-body-sm-semibold text-brand-primary">English</p>
      <Button shape="rect" className="w-full" onClick={onClose}>
        Done
      </Button>
    </Dialog>
  );
}

function HelpDialog({ onClose }: { onClose: () => void }) {
  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogHeader
        title="Help & support"
        description="Questions about an application or your account. We reply within a day. (Sample)"
        onClose={onClose}
      />
      <a href="mailto:support@around.jobs" className={cn(buttonVariants({ variant: "outline", shape: "rect" }), "w-full")}>
        Email support
      </a>
      <Button shape="rect" className="w-full" onClick={onClose}>
        Done
      </Button>
    </Dialog>
  );
}
