import type { Metadata } from "next";

import { TextPage } from "@/components/text-page";

export const metadata: Metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return (
    <TextPage title="Privacy">
      <p>
        Around Jobs stores your mobile number, name, resume file name and saved jobs in this browser so you can come back to them. The sample
        login does not send that information to a server.
      </p>
      <p>
        If you allow location, the browser shares your position only to centre the map. You can refuse that permission and still browse jobs by
        neighbourhood.
      </p>
      <p>
        Profile photos and resumes you pick stay on this device. Employers in this demo do not receive a copy. Clearing site data removes the
        session, the saved list and the applications stored here.
      </p>
      <p>Questions about this page can go to the Help & support screen in your account menu.</p>
    </TextPage>
  );
}
