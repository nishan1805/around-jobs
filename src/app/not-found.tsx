"use client";

import { useState } from "react";

import { PlaceholderPage } from "@/components/placeholder-page";

export default function NotFound() {
  const [path] = useState(() => (typeof window === "undefined" ? "" : window.location.pathname));
  const missingJob = path.startsWith("/jobs/");
  return (
    <PlaceholderPage
      icon="search"
      title={missingJob ? "We couldn't find that job" : "Page not found"}
      body={
        missingJob
          ? "It may have been filled or removed. There are plenty more open roles on the map."
          : "That page is not part of Around Jobs. Head back to the map to keep looking."
      }
    />
  );
}
