"use client";

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import type { ComponentProps, ReactNode } from "react";

import { IconButton } from "@/components/ui/icon-button";
import { cn } from "@/lib/utils";

/**
 * Popup used for Login and Complete Profile: a centred 400px card on tablet and
 * desktop (Figma "Desktop" variants), a bottom sheet with 20px padding on phones
 * ("Mobile" variants).
 */
export function Dialog({
  open,
  onOpenChange,
  children,
  className,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-overlay-scrim transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0" />
        <DialogPrimitive.Popup
          className={cn(
            "fixed inset-x-0 bottom-0 z-50 flex max-h-[90dvh] flex-col gap-5 overflow-y-auto rounded-t-xl bg-surface-default px-5 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] text-text-primary shadow-xl outline-none transition duration-200 data-ending-style:translate-y-10 data-ending-style:opacity-0 data-starting-style:translate-y-10 data-starting-style:opacity-0",
            "md:inset-x-auto md:top-1/2 md:bottom-auto md:left-1/2 md:w-100 md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-md md:p-6 md:shadow-lg md:data-ending-style:-translate-y-1/2 md:data-ending-style:scale-95 md:data-starting-style:-translate-y-1/2 md:data-starting-style:scale-95",
            className,
          )}
        >
          {children}
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

export function DialogHeader({
  title,
  description,
  onClose,
  children,
}: {
  title: string;
  description: ReactNode;
  onClose?: () => void;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <DialogPrimitive.Title className="min-w-0 flex-1 text-heading-semibold text-text-primary">{title}</DialogPrimitive.Title>
        {onClose && (
          <IconButton
            variant="outline"
            icon="close"
            label="Close"
            onClick={onClose}
            className="hidden md:inline-flex"
            iconClassName="size-4"
          />
        )}
      </div>
      <DialogPrimitive.Description className="text-body-sm-regular text-text-secondary">{description}</DialogPrimitive.Description>
      {children}
    </div>
  );
}

/** Figma "Around / Jobs / Input" (1888:42407). */
export function Field({
  label,
  helper,
  error,
  id,
  children,
}: {
  label: string;
  helper?: string;
  error?: string | null;
  id: string;
  children: ReactNode;
}) {
  return (
    <div className="flex w-full flex-col gap-1.5">
      <label htmlFor={id} className="text-label-medium text-text-secondary">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-label-medium text-error-default">
          {error}
        </p>
      ) : helper ? (
        <p id={`${id}-helper`} className="text-label-medium text-text-tertiary">
          {helper}
        </p>
      ) : null}
    </div>
  );
}

export function TextInput({ className, ...props }: ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "w-full rounded-sm border bg-surface-default p-3 text-body-sm-regular text-text-primary placeholder:text-text-tertiary focus-visible:border-brand-primary focus-visible:ring-3 focus-visible:ring-brand-primary/20 focus-visible:outline-none aria-invalid:border-error-default",
        className,
      )}
      {...props}
    />
  );
}
