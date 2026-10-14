import { cn } from "@/lib/utils";

/**
 * Two-tone tab glyphs from Figma "Mobile Tab Bar" (1952:18438). Inactive tabs use
 * grey-400 with white details; the active tab uses primary-600 with an orange accent.
 */
export type TabIconName = "jobs" | "applications" | "saved" | "profile";

export function TabIcon({ name, active, className }: { name: TabIconName; active: boolean; className?: string }) {
  const body = active ? "fill-primary-600" : "fill-grey-400";
  const accent = active ? "fill-brand-secondary" : "fill-surface-default";
  const accentStroke = active ? "stroke-brand-secondary" : "stroke-surface-default";

  return (
    <svg aria-hidden viewBox="0 0 28 28" fill="none" className={cn("size-7 shrink-0", className)}>
      {name === "jobs" && (
        <g transform="translate(2.333 2.333)">
          <circle cx="11.667" cy="11.667" r="11.667" className={body} />
          <path
            d="M16.427 6.78 10.14 8.876a2.1 2.1 0 0 0-1.264 1.264L6.78 16.427a.1.1 0 0 0 .127.126l6.286-2.095a2.1 2.1 0 0 0 1.265-1.265l2.095-6.286a.1.1 0 0 0-.126-.127Z"
            className={accent}
          />
        </g>
      )}
      {name === "applications" && (
        <>
          <path
            d="M19.833 3.208H8.167a4.958 4.958 0 0 0-4.959 4.959v11.666a4.958 4.958 0 0 0 4.959 4.959h11.666a4.958 4.958 0 0 0 4.959-4.959V8.167a4.958 4.958 0 0 0-4.959-4.959Z"
            className={body}
          />
          <path
            d="m8.167 17.5 4.32-4.667 2.593 2.8 4.753-5.133"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={accentStroke}
          />
        </>
      )}
      {name === "saved" && (
        <g transform="translate(2.625 3.607)">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M17.722.325c-2.447-.788-4.674-.132-6.347 1.85C9.7.193 7.474-.464 5.027.325 1.94 1.32.014 4.111 0 7.606c-.03 5.99 5.735 10.682 11.14 13.075l.236.105.237-.105c5.403-2.394 11.166-7.086 11.137-13.076-.014-3.495-1.94-6.285-5.028-7.28Z"
            className={body}
          />
          <path
            d="M11.466 13.174c1.958 0 3.881-1.218 5.031-3.194a.875.875 0 0 0-1.512-.881c-.665 1.143-1.95 2.375-3.602 2.324-1.642.06-2.909-1.182-3.574-2.324a.875.875 0 0 0-1.512.881c1.15 1.976 3.073 3.194 5.003 3.194h.166Z"
            className={accent}
          />
        </g>
      )}
      {name === "profile" && (
        <path
          transform="translate(2.917 2.333)"
          d="M7.74 21.902v-3.567c0-.911.744-1.649 1.662-1.649h3.353c.44 0 .863.174 1.174.483.312.31.487.729.487 1.166v3.567a1.42 1.42 0 0 0 .415 1.011c.269.27.635.42 1.016.42h2.288a4.04 4.04 0 0 0 2.85-1.165 3.96 3.96 0 0 0 1.182-2.827V9.178c0-.857-.383-1.67-1.045-2.22L13.34.79a3.72 3.72 0 0 0-4.607.083L1.128 6.959A2.9 2.9 0 0 0 0 9.178v10.152c0 2.211 1.805 4.003 4.032 4.003h2.236c.792 0 1.436-.634 1.441-1.42l.031-.011Z"
          className={body}
        />
      )}
    </svg>
  );
}
