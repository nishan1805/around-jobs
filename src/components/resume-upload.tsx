"use client";

import { useRef, useState } from "react";

import { Icon } from "@/components/icon";
import { Button } from "@/components/ui/button";

const MAX_RESUME_BYTES = 5 * 1024 * 1024;

/** Figma resume upload, state "Too large" (2105:25466). */
export const RESUME_TOO_LARGE_MESSAGE = "File is larger than 5 MB. Upload a smaller file.";

/** Figma resume upload error (P02d1). */
export const RESUME_UNSUPPORTED_MESSAGE = "This file isn't supported. Please upload a PDF, DOC or DOCX under 5 MB.";

export type ResumeUploadState = "empty" | "uploading" | "uploaded" | "unsupported" | "too-large";
const RESUME_TYPES =
  ".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";

export type PickedResume = { name: string; kb: number };

/** Hidden file input plus size check; `open()` shows the picker. */
function useResumePicker(onPick: (file: PickedResume) => void) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [rejectedName, setRejectedName] = useState<string | null>(null);
  const input = (
    <input
      ref={inputRef}
      type="file"
      accept={RESUME_TYPES}
      className="sr-only"
      tabIndex={-1}
      aria-hidden
      onChange={(event) => {
        const file = event.target.files?.[0];
        event.target.value = "";
        if (!file) return;
        if (file.size > MAX_RESUME_BYTES) {
          setRejectedName(file.name);
          setError(RESUME_TOO_LARGE_MESSAGE);
          return;
        }
        setRejectedName(null);
        setError(null);
        onPick({ name: file.name, kb: Math.max(1, Math.round(file.size / 1024)) });
      }}
    />
  );
  return { input, error, rejectedName, open: () => inputRef.current?.click() };
}

/**
 * The resume upload component in each visual state. `/states` renders this
 * directly. The dropzone and file card below are the interactive cases.
 */
export function ResumeUpload({
  state,
  fileName = "Resume_Nishan_Kumar_Mondal.pdf",
  detail = "240 KB · Uploaded 16 Oct 2026",
  onChoose,
  onRemove,
}: {
  state: ResumeUploadState;
  fileName?: string;
  detail?: string;
  onChoose?: () => void;
  onRemove?: () => void;
}) {
  if (state === "empty") {
    return (
      <div className="flex w-full flex-col items-center gap-2 rounded-md border border-dashed bg-background-secondary p-6 text-center">
        <span className="flex rounded-full bg-primary-50 p-3 text-brand-primary">
          <Icon name="upload" className="size-5" />
        </span>
        <p className="text-body-semibold text-text-primary">Upload your resume</p>
        <p className="text-label-medium text-text-tertiary">PDF or DOC, up to 5 MB</p>
        <Button type="button" variant="outline" shape="rect" onClick={onChoose}>
          Choose file
        </Button>
      </div>
    );
  }

  if (state === "unsupported") {
    return (
      <div className="flex w-full flex-col items-center gap-2 rounded-md border border-dashed border-error-default bg-background-secondary p-6 text-center">
        <span className="flex rounded-full bg-error-50 p-3 text-error-default">
          <Icon name="alertCircle" className="size-5" />
        </span>
        <p className="text-body-semibold text-text-primary">No resume uploaded yet</p>
        <p className="text-label-medium text-error-default">{RESUME_UNSUPPORTED_MESSAGE}</p>
        <Button type="button" variant="outline" shape="rect" onClick={onChoose}>
          Try again
        </Button>
      </div>
    );
  }

  if (state === "too-large") {
    return (
      <div className="flex w-full items-center gap-3 rounded-sm border border-error-500 bg-surface-default p-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-sm bg-error-50 text-error-default">
          <Icon name="alertCircle" className="size-5" />
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <p className="truncate text-body-semibold text-text-primary">{fileName}</p>
          <p className="text-label-medium text-error-default">{RESUME_TOO_LARGE_MESSAGE}</p>
        </div>
        <button
          type="button"
          onClick={onChoose}
          className="shrink-0 text-body-sm-semibold text-brand-primary hover:underline focus-visible:ring-3 focus-visible:ring-brand-primary/40 focus-visible:outline-none"
        >
          Choose file
        </button>
      </div>
    );
  }

  return (
    <div className="flex w-full items-center gap-3 rounded-sm border bg-surface-default p-3">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-sm bg-primary-50 text-brand-primary">
        <Icon name="file" className="size-5" />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="truncate text-body-semibold text-text-primary">{fileName}</p>
        <p className="text-label-medium text-success-700">{state === "uploading" ? "Uploading…" : detail}</p>
        {state === "uploading" && (
          <span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-grey-200">
            <span className="block h-full w-1/2 rounded-full bg-brand-primary" />
          </span>
        )}
      </div>
      {state === "uploaded" && onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="shrink-0 text-body-sm-semibold text-brand-primary hover:underline focus-visible:ring-3 focus-visible:ring-brand-primary/40 focus-visible:outline-none"
        >
          Remove
        </button>
      )}
    </div>
  );
}

/** Dashed upload box from Complete Profile (1953:19248) and Apply step 3. */
export function ResumeDropzone({ fileName, onPick }: { fileName: string | null; onPick: (file: PickedResume) => void }) {
  const picker = useResumePicker(onPick);
  if (picker.error && picker.rejectedName) {
    return (
      <>
        {picker.input}
        <ResumeUpload state="too-large" fileName={picker.rejectedName} onChoose={picker.open} />
      </>
    );
  }
  return (
    <div className="flex flex-col items-center gap-2 rounded-md border border-dashed bg-background-secondary p-6 text-center">
      <span className="flex rounded-full bg-primary-50 p-3 text-brand-primary">
        <Icon name="upload" className="size-5" />
      </span>
      <p className="text-body-semibold text-text-primary">{fileName ?? "Upload your resume"}</p>
      <p className="text-label-medium text-text-tertiary" aria-live="polite">
        {picker.error ?? "PDF or DOC, up to 5 MB"}
      </p>
      {picker.input}
      <Button type="button" variant="outline" shape="rect" onClick={picker.open}>
        {fileName ? "Replace file" : "Choose file"}
      </Button>
    </div>
  );
}

/** Uploaded resume row (M10): file icon, name, size and a Remove or View action. */
export function ResumeFileCard({
  name,
  kb,
  action,
}: {
  name: string;
  kb: number | null;
  action?: { label: string; onClick: () => void };
}) {
  return (
    <div className="flex items-center gap-3 rounded-md border bg-surface-default p-3">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-sm bg-primary-50 text-brand-primary">
        <Icon name="file" className="size-5" />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="truncate text-body-semibold text-text-primary">{name}</p>
        <p className="text-label-medium text-success-700">{kb ? `${kb} KB · Uploaded` : "Uploaded"}</p>
      </div>
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="shrink-0 rounded-xs text-body-sm-semibold text-brand-primary hover:underline focus-visible:ring-3 focus-visible:ring-brand-primary/40 focus-visible:outline-none"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
