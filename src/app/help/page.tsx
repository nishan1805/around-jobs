import type { Metadata } from "next";
import Link from "next/link";

import { TextPage } from "@/components/text-page";

export const metadata: Metadata = { title: "Help & support" };

export default function HelpPage() {
  return (
    <TextPage title="Help & support">
      <p>Around Jobs is the map of local roles in Raipur. Use this page when a button, a saved job or an application does not look right.</p>
      <h2 className="text-heading-semibold text-text-primary">Finding a job</h2>
      <p>
        Filter by employment type, work mode and more filters. The number on Filters counts those groups. Open a card to see that exact role, then
        save it or apply.
      </p>
      <h2 className="text-heading-semibold text-text-primary">Your account</h2>
      <p>
        Profile, saved jobs and applications stay with the mobile number you used to log in. Job preferences stay incomplete until you save them.
      </p>
      <p>
        Email <a className="text-brand-primary underline" href="mailto:support@around.jobs">support@around.jobs</a> or go back to{" "}
        <Link href="/" className="text-brand-primary underline">
          jobs
        </Link>
        .
      </p>
    </TextPage>
  );
}
