"use client";

import { useRef, useState } from "react";

import { Icon } from "@/components/icon";
import { Button } from "@/components/ui/button";

const MAX_RESUME_BYTES = 5 * 1024 * 1024;
const RESUME_TYPES =
  ".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";

export type PickedResume = { name: string; kb: number };

/** Hidden file input plus size check; `open()` shows the picker. */
function useResumePicker(onPick: (file: PickedResume) => void) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
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
          setError("That file is over 5 MB. Choose a smaller one.");
          return;
        }
        setError(null);
        onPick({ name: file.name, kb: Math.max(1, Math.round(file.size / 1024)) });
      }}
    />
  );
  return { input, error, open: () => inputRef.current?.click() };
}

/** Dashed upload box from Complete Profile (1953:19248) and Apply step 3. */
export function ResumeDropzone({ fileName, onPick }: { fileName: string | null; onPick: (file: PickedResume) => void }) {
  const picker = useResumePicker(onPick);
  return (
    <div className="flex flex-col items-center gap-2 rounded-md border border-dashed bg-background-secondary p-6 text-center">
      <span className="flex rounded-full bg-primary-50 p-3 text-brand-primary">
        <Icon name="upload" className="size-5" />
      </span>
      <p className="text-body-semibold text-text-primary">{fileName ?? "Upload your resume"}</p>
      <p className="text-label-medium text-text-tertiary" aria-live="polite">
        {picker.error ?? (fileName ? "Stays on this device in the Sample app" : "PDF or DOC, up to 5 MB")}
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
