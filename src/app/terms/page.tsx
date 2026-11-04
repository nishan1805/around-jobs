import type { Metadata } from "next";

import { TextPage } from "@/components/text-page";

export const metadata: Metadata = { title: "Terms" };

export default function TermsPage() {
  return (
    <TextPage title="Terms of use">
      <p>
        Around Jobs helps people in Raipur find nearby roles and keep track of the ones they save or apply to. These terms cover use of this
        job seeker app.
      </p>
      <p>
        Job posts, salaries and apply-by dates are sample listings for this product. An employer may close a role before the date shown. Applying
        sends the profile details you entered in the app and does not guarantee an interview.
      </p>
      <p>
        You agree to use your own mobile number, to keep your login to yourself, and not to post false information about your experience or a
        resume that is not yours.
      </p>
      <p>Saved jobs, applications and profile details stay on this device until you sign out or clear the site data.</p>
    </TextPage>
  );
}
