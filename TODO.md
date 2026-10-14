# Design questions and decisions

Things in the Figma file (`CqYtGTafIxJo5rfRSa6AbJ`, page "Around Jobs") that were unclear
or could not be matched exactly with the published tokens. Each item records what the
code does today so a designer can confirm or correct it.

## Tokens and text styles

- **Salary badge text `#07964e` is not a token.** "Around / Jobs / Badge" type Salary
  (1888:42346) uses a raw hex. The code uses `text-success-700` (`green-700`, `#239148`),
  the closest published success colour.
- **Orange badges and banners use the `secondary` scale.** Figma binds "Unverified" and
  the warning banner to `orange/orange-50` and `orange/orange-600`; those primitives are
  exposed as `secondary-50` and `secondary-600`.
- **Max text size is 24px.** The job page title used `display-32`; it now uses
  `heading-semibold` on phones and `display-small-semibold` (24px) from tablet up.

## Map overlays (S01–S05)

- **Panel heights.** S01/S02/S04 panels fill the map height (24px inset); S03 (726px)
  and S05 (544px) are cut at arbitrary heights. Every panel fills the available height
  and scrolls internally.
- **Two Map/List toggles in S03.** The top-right toggle still shows "Map" while the
  panel's toggle shows "List". Both are kept in sync (List is active while the Jobs List
  panel is open); choosing Map in either closes the panel.
- **What counts as a "filter".** S05 shows "Filters (2) · 2 filters applied" with Retail,
  Full-time and On-site selected, so categories are not counted. The badge and the
  removable chips count experience, employment type, work mode, salary and "More filters"
  options only.
- **Salary slider range.** Figma shows "₹10,000 – ₹50,000 / month" with both handles
  inset. The slider spans ₹0–₹60,000 in ₹1,000 steps, and the full span means "no salary
  filter". Jobs with an undisclosed salary still match a salary range unless "Salary
  disclosed" is on.
- **Experience buckets vs badges.** Filters use Fresher / 1–3 / 3–5 / 5+ yrs, while cards
  show ranges like "0–2 yrs". A job matches a bucket when its range overlaps it.
- **"Posted in 24h" vs "Last 7 days".** Treated as mutually exclusive options.
- **"Search this area" (Empty area state).** There is no server search yet, so the button
  flies the map to the nearest matching jobs.
- **Jobs List contents.** The list shows matching jobs inside the visible map area plus
  all matching remote jobs ("Remote jobs are listed but not shown on the map").
- **Employer panel job list.** Shows all open jobs at the employer regardless of map
  filters; the map pin count reflects the filters.
- **"Multiple branches" employer variant** (1889:42132) needs a brand/branch model that
  the sample data doesn't have yet. Not built.
- **Gallery photos.** There are no photos in the design, so the 240px header is a
  grey placeholder with a working counter ("1 / 8", Sample).
- **Job Detail location map.** Figma shows a 120px grey "Map placeholder"; the code
  renders a real non-draggable map with a plain pin, since the photo marker would be
  clipped at that height.
- **Expired / Closed footers.** Figma shows disabled grey buttons ("Applications
  closed" / "Position closed"); these use `bg-grey-100` + `text-text-disabled`.
- **Loading / error states** have no trigger in a static prototype. They can be
  previewed with `/?view=list&state=loading` and `/?view=list&state=error`, and loading
  shows while a search is being applied.
