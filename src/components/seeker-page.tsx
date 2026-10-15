"use client";

import type { ReactNode } from "react";

import { AppShell } from "@/components/app-shell";
import { useAuth } from "@/components/auth/auth-provider";
import type { IconName } from "@/components/icon";
import { TopBar } from "@/components/jobs/top-bar";
import { EmptyPage, PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { useHydrated } from "@/hooks/use-hydrated";
import { cn } from "@/lib/utils";

/**
 * Shell for the seeker's own pages (My applications, Saved): sidebar, top bar and the
 * grey content area. Shows `skeleton` until local data is read, and a login prompt
 * when nobody is logged in.
 */
export function SeekerPage({
  active,
  title,
  mobileTitle,
  intro,
  loginIcon,
  loginTitle,
  loginBody,
  skeleton,
  canvas = "grey",
  children,
}: {
  active: "applications" | "saved" | "profile";
  title: string;
  mobileTitle?: string;
  /** Subtitle used while loading and when logged out. */
  intro: string;
  loginIcon: IconName;
  loginTitle: string;
  loginBody: string;
  skeleton: ReactNode;
  /** "plain" is the white settings canvas (Profile, M20). */
  canvas?: "grey" | "plain";
  children: ReactNode;
}) {
  const hydrated = useHydrated();
  const { user, openLogin } = useAuth();

  return (
    <AppShell active={active}>
      <TopBar />
      <main
        className={cn(
          "flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-5 py-6 md:gap-6 md:px-10 md:py-8",
          canvas === "plain" ? "bg-surface-default" : "bg-background-secondary",
        )}
      >
        {!hydrated ? (
          <>
            <PageHeader title={title} mobileTitle={mobileTitle} subtitle={intro} />
            <div aria-busy className="flex flex-col gap-4">
              <span className="sr-only">Loading</span>
              {skeleton}
            </div>
          </>
        ) : !user ? (
          <>
            <PageHeader title={title} mobileTitle={mobileTitle} subtitle={intro} />
            <EmptyPage
              icon={loginIcon}
              title={loginTitle}
              body={loginBody}
              action={<Button onClick={openLogin}>Log in with mobile number</Button>}
            />
          </>
        ) : (
          children
        )}
      </main>
    </AppShell>
  );
}
