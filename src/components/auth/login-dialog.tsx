"use client";

import { useEffect, useRef, useState, type ClipboardEvent, type KeyboardEvent } from "react";

import { Icon } from "@/components/icon";
import { Button } from "@/components/ui/button";
import { Dialog, DialogHeader, DialogNav, Field } from "@/components/ui/dialog";
import {
  authActions,
  isValidIndianMobile,
  maskPhone,
  OTP_ATTEMPTS,
  OTP_LENGTH,
  RESEND_SECONDS,
  SAMPLE_OTP,
  type User,
} from "@/lib/auth-store";
import { cn } from "@/lib/utils";

type Step = "phone" | "otp";

function useCountdown(seconds: number, runKey: number) {
  const [left, setLeft] = useState(seconds);
  useEffect(() => {
    if (runKey === 0) return;
    const started = Date.now();
    const id = window.setInterval(() => {
      const remaining = Math.max(0, seconds - Math.floor((Date.now() - started) / 1000));
      setLeft(remaining);
      if (remaining === 0) window.clearInterval(id);
    }, 250);
    return () => window.clearInterval(id);
  }, [seconds, runKey]);
  return runKey === 0 ? seconds : left;
}

const formatTimer = (seconds: number) => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;

function OtpInput({
  value,
  onChange,
  invalid,
  disabled,
  describedBy,
}: {
  value: string;
  onChange: (value: string) => void;
  invalid: boolean;
  disabled: boolean;
  describedBy?: string;
}) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = Array.from({ length: OTP_LENGTH }, (_, index) => value[index] ?? "");
  const focus = (index: number) => refs.current[Math.max(0, Math.min(OTP_LENGTH - 1, index))]?.focus();

  const setDigit = (index: number, digit: string) => {
    const next = digits.slice();
    next[index] = digit;
    onChange(next.join("").slice(0, OTP_LENGTH));
  };

  const onKeyDown = (index: number) => (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && !digits[index]) {
      event.preventDefault();
      setDigit(index - 1, "");
      focus(index - 1);
    } else if (event.key === "ArrowLeft") {
      focus(index - 1);
    } else if (event.key === "ArrowRight") {
      focus(index + 1);
    }
  };

  const onPaste = (event: ClipboardEvent<HTMLInputElement>) => {
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;
    event.preventDefault();
    onChange(pasted);
    focus(pasted.length);
  };

  return (
    <div role="group" aria-label="One-time password" className="flex gap-2">
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(node) => {
            refs.current[index] = node;
          }}
          value={digit}
          disabled={disabled}
          inputMode="numeric"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          maxLength={1}
          aria-label={`Digit ${index + 1}`}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          autoFocus={index === 0}
          onPaste={onPaste}
          onKeyDown={onKeyDown(index)}
          onChange={(event) => {
            const digitValue = event.target.value.replace(/\D/g, "").slice(-1);
            setDigit(index, digitValue);
            if (digitValue) focus(index + 1);
          }}
          className={cn(
            "h-13 w-12 rounded-sm border bg-surface-default text-center text-body-semibold text-text-primary transition-colors focus-visible:ring-3 focus-visible:ring-brand-primary/20 focus-visible:outline-none disabled:opacity-100",
            invalid ? "border-error-default" : digit || disabled ? "border-brand-primary" : "focus-visible:border-brand-primary",
          )}
        />
      ))}
    </div>
  );
}

/** Figma "Around / Jobs / Login Popup" (1913:16320): phone entry, OTP entry, OTP error, loading. */
export function LoginDialog({
  open,
  onOpenChange,
  onLoggedIn,
  reason,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLoggedIn: (user: User) => void;
  reason?: string;
}) {
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [attemptsLeft, setAttemptsLeft] = useState(OTP_ATTEMPTS);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [sentCount, setSentCount] = useState(0);
  const resendIn = useCountdown(RESEND_SECONDS, sentCount);

  const reset = () => {
    setStep("phone");
    setCode("");
    setOtpError(null);
    setPhoneError(null);
    setAttemptsLeft(OTP_ATTEMPTS);
    setBusy(false);
  };

  const close = () => {
    onOpenChange(false);
    reset();
  };

  const sendOtp = async () => {
    if (!isValidIndianMobile(phone)) {
      setPhoneError("Enter a valid 10-digit mobile number.");
      return;
    }
    setPhoneError(null);
    setBusy(true);
    await authActions.sendOtp(phone);
    setBusy(false);
    setCode("");
    setOtpError(null);
    setAttemptsLeft(OTP_ATTEMPTS);
    setSentCount((count) => count + 1);
    setStep("otp");
  };

  const verify = async () => {
    if (code.length < OTP_LENGTH || attemptsLeft === 0) return;
    setBusy(true);
    const result = await authActions.verifyOtp(phone, code);
    setBusy(false);
    if (result.ok) {
      reset();
      setPhone("");
      onLoggedIn(result.user);
      return;
    }
    const left = attemptsLeft - 1;
    setAttemptsLeft(left);
    setOtpError(
      left > 0
        ? `Incorrect OTP. ${left} ${left === 1 ? "attempt" : "attempts"} left.`
        : "Too many incorrect attempts. Request a new OTP.",
    );
  };

  return (
    <Dialog screen open={open} onOpenChange={(next) => (next ? onOpenChange(true) : close())}>
      <DialogNav
        onClose={close}
        backLabel={step === "otp" ? "Change number" : "Back"}
        onBack={() => {
          if (step === "phone" || busy) return close();
          setStep("phone");
          setOtpError(null);
        }}
      />
      {step === "phone" ? (
        <form
          className="flex flex-col gap-5"
          onSubmit={(event) => {
            event.preventDefault();
            void sendOtp();
          }}
        >
          <DialogHeader
            title="Log in to Around Jobs"
            description={reason ?? "Enter your mobile number to receive a one-time password (OTP)."}
            onClose={close}
          />
          <Field id="login-phone" label="Mobile number" error={phoneError}>
            <div
              className={cn(
                "flex w-full items-center gap-2 rounded-sm border bg-surface-default p-3 focus-within:border-brand-primary focus-within:ring-3 focus-within:ring-brand-primary/20",
                phoneError && "border-error-default",
              )}
            >
              <span className="text-body-sm-regular text-text-tertiary">+91</span>
              <input
                id="login-phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                autoFocus
                placeholder="Enter 10-digit number"
                value={phone}
                aria-invalid={phoneError ? true : undefined}
                aria-describedby={phoneError ? "login-phone-error" : undefined}
                onChange={(event) => setPhone(event.target.value.replace(/\D/g, "").slice(0, 10))}
                className="min-w-0 flex-1 bg-transparent text-body-sm-regular text-text-primary placeholder:text-text-tertiary focus:outline-none"
              />
            </div>
          </Field>
          <Button type="submit" shape="rect" className="w-full" disabled={busy}>
            {busy ? (
              <>
                <Icon name="spinner" className="size-4 animate-spin" />
                Sending…
              </>
            ) : (
              "Send OTP"
            )}
          </Button>
          <p className="text-label-medium text-text-tertiary">By continuing you agree to the Terms and Privacy Policy.</p>
        </form>
      ) : (
        <form
          className="flex flex-col gap-5"
          onSubmit={(event) => {
            event.preventDefault();
            void verify();
          }}
        >
          <DialogHeader
            title="Enter OTP"
            description={`Enter the 6-digit code sent to ${maskPhone(phone)} (Sample)`}
            onClose={close}
          >
            {!busy && (
              <button
                type="button"
                onClick={() => {
                  setStep("phone");
                  setOtpError(null);
                }}
                className="self-start text-body-sm-semibold text-brand-primary hover:underline"
              >
                Change number
              </button>
            )}
          </DialogHeader>
          <OtpInput
            value={code}
            onChange={(next) => {
              setCode(next);
              if (otpError && attemptsLeft > 0) setOtpError(null);
            }}
            invalid={Boolean(otpError)}
            disabled={busy || attemptsLeft === 0}
            describedBy={otpError ? "otp-error" : "otp-hint"}
          />
          {otpError ? (
            <div className="flex items-center gap-2">
              <p id="otp-error" role="alert" className="flex-1 text-label-medium text-error-default">
                {otpError}
              </p>
              <button
                type="button"
                onClick={() => void sendOtp()}
                disabled={resendIn > 0 && attemptsLeft > 0}
                className="text-body-sm-semibold text-brand-primary hover:underline disabled:text-text-disabled disabled:no-underline"
              >
                Resend OTP
              </button>
            </div>
          ) : (
            <p id="otp-hint" className="text-label-medium text-text-tertiary">
              {resendIn > 0 ? (
                <>Resend OTP in {formatTimer(resendIn)}</>
              ) : (
                <button type="button" onClick={() => void sendOtp()} className="text-body-sm-semibold text-brand-primary hover:underline">
                  Resend OTP
                </button>
              )}
              <span className="block">Sample OTP: {SAMPLE_OTP}</span>
            </p>
          )}
          <Button type="submit" shape="rect" className="w-full" disabled={busy || code.length < OTP_LENGTH || attemptsLeft === 0}>
            {busy ? (
              <>
                <Icon name="spinner" className="size-4 animate-spin" />
                Submitting…
              </>
            ) : (
              "Verify"
            )}
          </Button>
        </form>
      )}
    </Dialog>
  );
}
