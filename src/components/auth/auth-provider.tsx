"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";

import { useSearchParam } from "@/hooks/use-search-param";
import { needsProfile, useUser, type User } from "@/lib/auth-store";

import { LoginDialog } from "./login-dialog";
import { ProfileDialog } from "./profile-dialog";

type AuthContextValue = {
  user: User | null;
  /** Runs `action` straight away when logged in, otherwise after login (and the optional profile step). */
  requireAuth: (action?: () => void, reason?: string) => void;
  openLogin: () => void;
  editProfile: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const user = useUser();
  const authPreview = useSearchParam("auth");
  const [loginOpen, setLoginOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  useEffect(() => {
    // Wait until the shell has hydrated. Opening a dialog sooner marks the page
    // inert while a nested boundary is still hydrating.
    const id = window.setTimeout(() => {
      if (authPreview === "phone" || authPreview === "otp" || authPreview === "otp-error" || authPreview === "loading") setLoginOpen(true);
      if (authPreview === "profile") setProfileOpen(true);
    }, 50);
    return () => window.clearTimeout(id);
  }, [authPreview]);
  const [reason, setReason] = useState<string | undefined>();
  const pending = useRef<(() => void) | null>(null);

  const runPending = () => {
    const action = pending.current;
    pending.current = null;
    action?.();
  };

  const requireAuth = useCallback(
    (action?: () => void, why?: string) => {
      if (user) {
        action?.();
        return;
      }
      pending.current = action ?? null;
      setReason(why);
      setLoginOpen(true);
    },
    [user],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      requireAuth,
      openLogin: () => requireAuth(),
      editProfile: () => setProfileOpen(true),
    }),
    [user, requireAuth],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
      <LoginDialog
        open={loginOpen}
        reason={reason}
        initialStep={authPreview === "otp" || authPreview === "otp-error" || authPreview === "loading" ? "otp" : "phone"}
        initialPhone={authPreview === "otp" || authPreview === "otp-error" || authPreview === "loading" ? "9800000010" : ""}
        initialCode={authPreview === "otp" ? "482" : authPreview === "otp-error" ? "482917" : authPreview === "loading" ? "482916" : ""}
        initialError={authPreview === "otp-error" ? "Incorrect OTP. 2 attempts left." : null}
        initialBusy={authPreview === "loading"}
        resting={authPreview === "phone"}
        verifyReady={authPreview === "otp"}
        onOpenChange={(open) => {
          setLoginOpen(open);
          if (!open) pending.current = null;
        }}
        onLoggedIn={(next) => {
          setLoginOpen(false);
          if (needsProfile(next)) setProfileOpen(true);
          else runPending();
        }}
      />
      {profileOpen && (
        <ProfileDialog
          open
          user={user}
          presetName={authPreview === "profile" ? "Nishan Kumar Mondal" : ""}
          onDone={() => {
            setProfileOpen(false);
            runPending();
          }}
        />
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside <AuthProvider>");
  return context;
}
